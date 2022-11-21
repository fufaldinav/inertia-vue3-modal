<template>
  <slot name="background" :active="modals.size > 0" />
  <InertiaModalWrapper v-for="[id, modal] in modals" :key="id" :modal="modal">
    <slot name="default" :loading="modal.loading" :component="modal.component"
      :page="modal.page" :close="modal.close" :props="modal.props" />
    <template #component>
      <Component v-if="!modal.loading && modal.component" is-modal :is="modal.component"
        v-bind="{ ...modal.page.props, ...modal.pageProps }" />
    </template>
  </InertiaModalWrapper>
</template>

<script setup lang="ts">
import {
  Inertia, Page, Visit,
} from '@inertiajs/inertia';
import Axios, { CancelTokenSource } from 'axios';
import {
  ref, shallowReactive, shallowRef, watch,
} from 'vue';
import { fireErrorEvent, fireSuccessEvent } from './events';
import {
  Id, ModalItem, ModalLoading, ModalObj, VisitInModalFn, VisitModalOptions,
} from './types';
import { modalHeader } from './symbols';
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

const modals = shallowReactive<Map<Id, ModalItem>>(new Map());

const close = (id: Id) => {
  const modal = modals.get(id) ?? null;

  if (modal) {
    if (!modal.loading) {
      // remove the 'x-inertia-modal' and 'x-inertia-modal-redirect-back' headers for future requests
      modal.removeBeforeEventListener();
      if (modal.removeSuccessEventListener) {
        modal.removeSuccessEventListener();
      }
      Axios.interceptors.response.eject(modal.interceptor);
    }
    if (modal.cancelToken.value) {
      modal.cancelToken.value.cancel('Modal closed');
    }
    if ('onClose' in modal && modal.onClose) {
      modal.onClose(modal);
    }
  }
  document.dispatchEvent(new CustomEvent('inertia:modal-closed', { detail: modal }));
  modals.delete(id);
};

const lastPage = ref<Page | undefined>(undefined);
const lastVisit = ref<Visit | null>(null);

const visitInModal = (
  url: string,
  options: VisitModalOptions = {},
) => {
  const opts = {
    headers: {}, redirectBack: true, modalProps: {}, pageProps: {}, ...options,
  };

  const cancelToken = shallowRef<CancelTokenSource | null>(null);

  const hrefToUrl = (href: string|URL): URL => new URL(href.toString(), window.location.toString());

  const currentId = uniqueId();
  const closeSelf = () => close(currentId);

  const interceptor = Axios.interceptors.response.use((response) => {
    if (response.headers[modalHeader.toLowerCase()] === currentId) {
      const page = response.data;
      page.url = hrefToUrl(page.url);
      if (lastVisit.value?.only && lastPage.value && lastPage.value.component === page.component) {
        page.props = { ...lastPage.value.props, ...page.props };
      }
      // @ts-ignore Protected but we have to use it, no other way
      const { onError, onSuccess, errorBag } = lastVisit.value ? Inertia.activeVisit : opts;

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

        const currentModal = modals.get(currentId) ?? null;
        if (currentModal && 'removeBeforeEventListener' in currentModal) {
          currentModal.removeBeforeEventListener();
        }
        const removeBeforeEventListener = Inertia.on('before', (event) => {
          // Subsequent visit of the modal url will stay in the modal
          if (event.detail.visit.url.pathname === page.url.pathname) {
            // delete event.detail.visit.headers[
            //   'X-Inertia-Modal-Redirect-Back'
            // ];
            // make sure the backend knows we're requesting from within a modal
            event.detail.visit.headers[modalHeader] = currentId;
            lastVisit.value = event.detail.visit;
            lastPage.value = page;
            const reqInterceptor = Axios.interceptors.request.use((config) => {
              if (config?.headers?.[modalHeader] === currentId) {
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
              removeSuccessEventListener = Inertia.on('success', (event) => {
                if (event.detail.page.props.modalId === currentId) {
                  (opts.redirectBack as any)()
                }
              });
            }
          }
        });
        const modal: ModalObj = {
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
          close: closeSelf,
        };
        modals.set(currentId, modal);
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
  const modal: ModalLoading = { loading: true, cancelToken, close: closeSelf };
  modals.set(currentId, modal);
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
