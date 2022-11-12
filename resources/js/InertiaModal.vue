<template>
  <template v-if="modal">
    <slot
        name="default"
        :loading="modal.loading"
        :component="modal.component"
        :page="modal.page"
        :close="modal.close"
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

<script setup lang="ts">
import {
  Inertia, Page, Visit, VisitOptions,
} from '@inertiajs/inertia';
import Axios, { CancelTokenSource } from 'axios';
import {
  provide, shallowRef, watch,
} from 'vue';
import {
  GlobalEvent,
  GlobalEventResult,
} from '@inertiajs/inertia/types/types.d';
import { fireErrorEvent, fireSuccessEvent } from './events';
import {
  ModalRef, ModalLoading, ModalObj,
} from './types';
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
  if (modal.value) {
    if (!modal.value.loading) {
      // remove the 'x-inertia-modal' and 'x-inertia-modal-redirect-back' headers for future requests
      modal.value.removeBeforeEventListener();
      if (modal.value.removeSuccessEventListener) {
        modal.value.removeSuccessEventListener();
      }
      Axios.interceptors.response.eject(modal.value.interceptor);
    }
    if (modal.value.cancelToken.value) {
      modal.value.cancelToken.value.cancel('Modal closed');
    }
    if ('onClose' in modal.value && modal.value.onClose) {
      modal.value.onClose(modal.value);
    }
  }
  document.dispatchEvent(new CustomEvent('inertia:modal-closed', { detail: modal.value }));
  modal.value = null;
};

const visitInModal = (
  url: string,
  options: VisitOptions & {
    redirectBack?: boolean | ((event: GlobalEvent<'success'>) => GlobalEventResult<'success'>),
    modalProps?: object,
    pageProps?: object,
    onClose?: (details: ModalObj) => void,
  } = {},
) => {
  const opts = {
    headers: {}, redirectBack: true, modalProps: {}, pageProps: {}, ...options,
  };

  const cancelToken = shallowRef<CancelTokenSource | null>(null);

  const hrefToUrl = (href: string|URL): URL => new URL(href.toString(), window.location.toString());

  const currentId = uniqueId();
  let lastPage: Page | undefined;
  let lastVisit: Visit | null = null;

  opts.modalProps = {id: currentId, ...opts.modalProps};


  const interceptor = Axios.interceptors.response.use((response) => {
    if (response.headers[modalHeader.toLowerCase()] === currentId) {
      const page = response.data;
      page.url = hrefToUrl(page.url);
      if (lastVisit?.only && lastPage && lastPage.component === page.component) {
        page.props = { ...lastPage.props, ...page.props };
      }
      // @ts-ignore Protected but we have to use it, no other way
      const { onError, onSuccess, errorBag } = lastVisit ? Inertia.activeVisit : opts;

      // @ts-ignore Protected but we have to use it, no other way
      Promise.resolve(Inertia.resolveComponent(page.component)).then((component) => {
        const errors = page.props.errors || {};

        if (Object.keys(errors).length > 0) {
          const scopedErrors = errorBag ? errors[errorBag] || {} : errors;
          fireErrorEvent(scopedErrors);
          if (onError) onError(scopedErrors);
        } else {
          fireSuccessEvent(page);
          if (onSuccess) onSuccess(page);
        }
        return component;
      }).then((component) => {
        // @ts-ignore Protected but we have to use it, no other way
        Inertia.finishVisit(Inertia.activeVisit);
        let removeSuccessEventListener;
        if (modal.value && 'removeBeforeEventListener' in modal.value) {
          modal.value.removeBeforeEventListener();
        }
        const removeBeforeEventListener = Inertia.on('before', (event) => {
          // Subsequent visit of the modal url will stay in the modal
          if (event.detail.visit.url.pathname === page.url.pathname) {
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
          cancelToken,
          onClose: opts.onClose,
          props: opts.modalProps,
          pageProps: opts.pageProps,
          close,
          };
      });
      return Promise.reject(new Axios.Cancel());
    }
    return response;
  });
  Inertia.visit(url, {
    ...opts,
    onCancelToken: (token) => {
      cancelToken.value = token as CancelTokenSource;
    },
    headers: { ...opts.headers, [modalHeader]: currentId },
  });
  modal.value = { loading: true, cancelToken, close } as ModalLoading;
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
