<template>
  <template v-if="modal">
    <slot
        name="default"
        :loading="modal.loading"
        :component="modal.component"
        :page="modal.page"
        :content-ref="(elm) => telRef = elm"
        :close="close"
        :bind="modal.bind"
    />
    <Teleport
        v-if="modal.component && telRef"
        :to="telRef"
    >
      <Component
          is-modal
          :is="modal.component"
          v-bind="modal.page.props"
      />
    </Teleport>
  </template>
</template>

<script lang="ts" setup>
import { Inertia, VisitOptions } from '@inertiajs/inertia';
import Axios, { CancelTokenSource } from 'axios';
import Cancel from 'axios/lib/cancel/Cancel';
import {
  provide, Ref, ref, shallowRef, watch,
} from 'vue';
import { GlobalEventCallback } from '@inertiajs/inertia/types/types.d';
import uniqueId from './uniqueId';
import { injectIsModal, modalHeader } from './symbols';

const props = defineProps({
  component: String,
  componentAttrs: Object,
  modalKey: {
    type: String,
    default: '',
  },
});

interface VoidFunction {
  (): void;
}

interface ModalRef {
  loading: false,
  component: unknown,
  removeBeforeEventListener: VoidFunction,
  removeSuccessEventListener?: VoidFunction,
  interceptor: number,
  page: object,
  bind: object,
}

interface ModalRefLoading {
  cancelToken: Ref<CancelTokenSource | null>,
  loading: true,
}

const telRef = ref(null);
const modal = shallowRef<null | ModalRef | ModalRefLoading>(null);

provide(injectIsModal, true);

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
  options: VisitOptions & {redirectBack?: boolean | GlobalEventCallback<'success'>, modalProps?: object},
) => {
  const opts = {
    headers: {}, redirectBack: true, modalProps: {}, ...options,
  };

  const currentId = uniqueId();

  const interceptor = Axios.interceptors.response.use((response) => {
    if (response.headers[modalHeader.toLowerCase()] === currentId) {
      const page = response.data;
      // @ts-ignore
      Promise.resolve(Inertia.resolveComponent(page.component)).then((component) => {
        const clone = JSON.parse(JSON.stringify(page));
        // @ts-ignore
        Inertia.finishVisit(Inertia.activeVisit);
        let removeSuccessEventListener = null;
        const removeBeforeEventListener = Inertia.on('before', (event) => {
          // make sure the backend knows we're requesting from within a modal
          event.detail.visit.headers[modalHeader] = currentId;
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
          page: clone,
          bind: opts.modalProps,
        };
      });
      return Promise.reject(new Cancel());
    }
    return response;
  });
  const cancelToken = ref<CancelTokenSource | null>(null);
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
