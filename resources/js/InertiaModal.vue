<template>
  <template v-if="modal">
    <slot
        name="default"
        :loading="modal.loading"
        :component="modal.component"
        :page="modal.page"
        :close="close"
        :props="modal.props"
    />
    <Teleport
        v-if="modal.component && telRef"
        :to="telRef"
    >
      <Component
          is-modal
          :is="modal.component"
          v-bind="{...modal.page.props, ...modal.pageProps}"
      />
    </Teleport>
  </template>
</template>

<script lang="ts" setup>
import { Inertia, Page, VisitOptions } from '@inertiajs/inertia';
import Axios, { CancelTokenSource } from 'axios';
import Cancel from 'axios/lib/cancel/Cancel';
import {
  provide, shallowRef, watch,
} from 'vue';
import {
  GlobalEvent,
  GlobalEventResult,
} from '@inertiajs/inertia/types/types.d';
import { ModalRef } from './types';
import uniqueId from './uniqueId';
import { injectIsModal, modalHeader } from './symbols';
import { provider } from './useModalSlot';

const props = defineProps({
  component: String,
  componentAttrs: Object,
  modalKey: {
    type: String,
    default: '',
  },
});

const modal: ModalRef = shallowRef(null);

const telRef = provider();

provide(injectIsModal, modal);

const close = () => {
  if (modal.value && !modal.value.loading) {
    // remove the 'x-inertia-modal' and 'x-inertia-modal-redirect-back' headers for future requests
    modal.value.removeBeforeEventListener();
    if (modal.value.removeSuccessEventListener) {
      modal.value.removeSuccessEventListener();
    }
    Axios.interceptors.response.eject(modal.value.interceptor);
  } else if (modal.value && modal.value.cancelToken.value) {
    modal.value.cancelToken.value.cancel('Modal closed');
  }
  modal.value = null;
};

const visitInModal = (
  url: string,
  options: VisitOptions & {
    redirectBack?: boolean | ((event: GlobalEvent<'success'>) => GlobalEventResult<'success'>),
    modalProps?: object,
    pageProps?: object
  } = {},
) => {
  const opts = {
    headers: {}, redirectBack: true, modalProps: {}, pageProps: {}, ...options,
  };

  const currentId = uniqueId();

  const interceptor = Axios.interceptors.response.use((response) => {
    if (response.headers[modalHeader.toLowerCase()] === currentId) {
      const page: Page = response.data;

      // @ts-ignore Protected but we have to use it, no other way
      Promise.resolve(Inertia.resolveComponent(page.component)).then((component) => {
        // @ts-ignore Protected but we have to use it, no other way
        Inertia.finishVisit(Inertia.activeVisit);
        let removeSuccessEventListener;
        const removeBeforeEventListener = Inertia.on('before', (event) => {
          // make sure the backend knows we're requesting from within a modal
          event.detail.visit.headers[modalHeader] = currentId;
          event.detail.visit.headers['X-Inertia-Partial-Component'] = page.component;
          if (opts.redirectBack) {
            event.detail.visit.headers[
              'X-Inertia-Modal-Redirect-Back'
            ] = 'true';
            if (typeof opts.redirectBack === 'function') {
              removeSuccessEventListener = Inertia.on('success', opts.redirectBack);
            }
          }
        });
        modal.value = {
          loading: false,
          component,
          removeBeforeEventListener,
          removeSuccessEventListener,
          interceptor,
          page,
          props: opts.modalProps,
          pageProps: opts.pageProps,
        };
      });
      return Promise.reject(new Cancel());
    }
    return response;
  });
  const cancelToken = shallowRef<CancelTokenSource | null>(null);
  Inertia.visit(url, {
    ...opts,
    onCancelToken: (token) => {
      cancelToken.value = token as CancelTokenSource;
    },
    headers: { ...opts.headers, [modalHeader]: currentId },
  });
  modal.value = { loading: true, cancelToken };
};

watch(() => props.modalKey, (key) => {
  const fn = `visitInModal${key}`;
  // @ts-ignore
  Inertia[fn] = visitInModal;
}, { immediate: true });
</script>

<script lang="ts">
export default {
  name: 'InertiaModal',
};
</script>
