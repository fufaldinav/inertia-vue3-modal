<template>
  <slot name="background" :active="modals.size > 0" />
  <template v-for="[id, modal] in modals" :key="id" >
    <InertiaModalWrapper :modal="modal.value">
      <slot name="default" :loading="modal.value.loading" :component="modal.value.component"
        :page="modal.value.page" :close="modal.value.close" :props="modal.value.props" />
      <template #component>
        <Component is-modal :is="modal.value.component"
          v-bind="{ ...modal.value.page.props, ...modal.value.pageProps }" />
      </template>
    </InertiaModalWrapper>
  </template>
</template>

<script setup lang="ts">
import {
  Inertia, Page, Visit,
} from '@inertiajs/inertia';
import Axios, { CancelTokenSource } from 'axios';
import {
  shallowRef, watch, ShallowRef, shallowReactive,
} from 'vue';
import { fireErrorEvent, fireSuccessEvent } from './events';
import {
  Id, ModalItem, VisitInModalFn, VisitModalOptions,
} from './types';
import { modalHeader, modalHeaderPartial } from './symbols';
import uniqueId from './uniqueId';
import InertiaModalWrapper from './InertiaModalWrapper.vue';

const props = defineProps({
  component: String,
  componentAttrs: Object,
  modalKey: {
    type: String,
    default: '',
  },
});

const modals = shallowReactive<Map<Id, ShallowRef<ModalItem | null>>>(new Map());

const close = (modal: ShallowRef<ModalItem | null>) => {
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

    modals.delete(modal.value.id);
  }
  document.dispatchEvent(new CustomEvent('inertia:modal-closed', { detail: modal.value }));
};

const visitInModal = (
  url: string,
  options: VisitModalOptions = {},
  // parentId?: string,
) => {
  const currentId = uniqueId();
  let lastPage: Page | undefined;
  let lastVisit: Visit | null = null;

  const modal = shallowRef<ModalItem | null>(null);
  modals.set(currentId, modal);

  const closeSelf = () => close(modal);

  const opts = {
    headers: {},
    redirectBack: true,
    modalProps: {},
    pageProps: {},
    ...options,
  };

  const cancelToken = shallowRef<CancelTokenSource | null>(null);

  const hrefToUrl = (href: string|URL): URL => new URL(href.toString(), window.location.toString());

  const interceptor = Axios.interceptors.response.use((response) => {
    if (response.headers[modalHeader.toLowerCase()] === currentId) {
      const page = response.data;
      const { config } = response;
      page.url = hrefToUrl(page.url);

      if (config.headers[modalHeaderPartial] && config.headers[modalHeaderPartial] !== page.component) {
        return Promise.reject(new Axios.Cancel())
          .finally(() => document.dispatchEvent(new CustomEvent('inertia:modal-redirected', { detail: modal.value })));
      }

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
                config.headers[modalHeaderPartial] = page.component;
              }
              return config;
            });
          } else if (opts.redirectBack) {
            event.detail.visit.headers[
              'X-Inertia-Modal-Redirect-Back'
            ] = 'true';
          }

          if (typeof opts.redirectBack === 'function') {
            removeSuccessEventListener = Inertia.on('modal-redirected', opts.redirectBack);
          }
        });
        modal.value = {
          id: currentId,
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
          close: () => closeSelf(),
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
  modal.value = {
    id: currentId, loading: true, cancelToken, close: () => closeSelf(),
  };
};

watch(() => props.modalKey, (key) => {
  const fn: VisitInModalFn = `visitInModal${key}`;
  Inertia[fn] = visitInModal;
}, { immediate: true });
</script>

<script lang="ts">
export default {
  name: 'InertiaModal',
};
</script>
