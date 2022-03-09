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
import { fireErrorEvent, fireSuccessEvent } from './events';
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

  const hrefToUrl = (href: string|URL): URL => new URL(href.toString(), window.location.toString());

  const currentId = uniqueId();
  let lastPage: Page | undefined;
  let lastVisit = null;

  const interceptor = Axios.interceptors.response.use((response) => {
    if (response.headers[modalHeader.toLowerCase()] === currentId) {
      const page = response.data;
      page.url = hrefToUrl(page.url);
      if (lastVisit?.only && lastPage.component === page.component) {
        page.props = { ...lastPage.props, ...page.props };
      }

      // @ts-ignore Protected but we have to use it, no other way
      Promise.resolve(Inertia.resolveComponent(page.component)).then((component) => {
        const errors = page.props.errors || {};
        if (Object.keys(errors).length > 0) {
          const scopedErrors = opts.errorBag ? errors[opts.errorBag] || {} : errors;
          fireErrorEvent(scopedErrors);
          if (opts.onError) opts.onError(scopedErrors);
        } else {
          fireSuccessEvent(page);
          if (opts.onSuccess) opts.onSuccess(page);
        }
        return component;
      }).then((component) => {
        // @ts-ignore Protected but we have to use it, no other way
        Inertia.finishVisit(Inertia.activeVisit);
        let removeSuccessEventListener;
        if (modal.value.removeBeforeEventListener) {
          modal.value.removeBeforeEventListener();
        }
        const removeBeforeEventListener = Inertia.on('before', (event) => {
          // Subsequent visit of the modal url will stay in the modal
          if (event.detail.visit.url === page.url) {
            // make sure the backend knows we're requesting from within a modal
            event.detail.visit.headers[modalHeader] = currentId;
            lastVisit = event.detail.visit;
            lastPage = page;
            const reqInterceptor = Axios.interceptors.request.use((config) => {
              if (config.headers[modalHeader] === currentId) {
                Axios.interceptors.request.eject(reqInterceptor);
                config.headers['X-Inertia-Partial-Component'] = page.component;
              }
              return config;
            });
          } else if (opts.redirectBack) {
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
