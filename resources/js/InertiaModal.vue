<template>
  <slot name="background" :active="modals.size > 0" />
  <template v-for="[id, modal] in modals" :key="id" >
    <InertiaModalWrapper v-if="modal.value" :modal="modal.value">
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
  Inertia, Visit,
} from '@inertiajs/inertia';
import Axios, { CancelTokenSource } from 'axios';
import {
  shallowRef, watch, ShallowRef, shallowReactive, ref,
} from 'vue';
import { fireErrorEvent, fireSuccessEvent } from './events';
import {
  Id, ModalItem, VisitInModalFn, VisitModalOptions, LastPage,
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
const topLevelModalId = ref<string|null>(null);
const checkModalIsActive = (id: string) => topLevelModalId.value === id;

const close = (modal: ShallowRef<ModalItem | null>) => {
  if (modal.value) {
    topLevelModalId.value = modal.value.parentId;

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
  parentId = topLevelModalId.value,
) => {
  const currentId = uniqueId();
  let isRedirect = false;
  let lastPage: LastPage | undefined;
  let lastVisit: Visit | null = null;

  const modal = shallowRef<ModalItem | null>(null);
  modals.set(currentId, modal);

  const closeSelf = () => close(modal);

  const opts = {
    headers: {},
    modalProps: {},
    pageProps: {},
    closeOnSave: true,
    ...options,
  };

  const cancelToken = shallowRef<CancelTokenSource | null>(null);

  const hrefToUrl = (href: string|URL): URL => new URL(href.toString(), window.location.toString());

  const interceptor = Axios.interceptors.response.use((response) => {
    if (response.headers[modalHeader.toLowerCase()] === currentId) {
      const page = response.data;
      page.url = hrefToUrl(page.url);

      isRedirect = !!lastPage && lastPage?.url?.pathname !== page.url.pathname;

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

        if (modal.value && 'removeBeforeEventListener' in modal.value) {
          modal.value.removeBeforeEventListener();
        }

        const removeSuccessEventListener = Inertia.on('success', (event) => {
          if (isRedirect && checkModalIsActive(currentId)) {
            isRedirect = false;

            if (opts.closeOnSave) {
              modal.value?.close();
            }

            if (typeof opts.onRedirect === 'function') {
              opts.onRedirect(event);
            }
          }
        });

        const removeBeforeEventListener = Inertia.on('before', (event) => {
          if (!checkModalIsActive(currentId)) {
            return;
          }

          // Subsequent visit of the modal url will stay in the modal
          if (event.detail.visit.url.pathname === page.url.pathname) {
            // make sure the backend knows we're requesting from within a modal
            event.detail.visit.headers[modalHeader] = currentId;
            lastVisit = event.detail.visit;
            lastPage = page;
            const reqInterceptor = Axios.interceptors.request.use((config) => {
              if (config.headers && config.headers[modalHeader] === currentId) {
                Axios.interceptors.request.eject(reqInterceptor);
                config.headers[modalHeaderPartial] = page.component;
              }
              return config;
            });
          } else if (opts.onRedirect) {
            event.detail.visit.headers[
              'X-Inertia-Modal-Redirect-Back'
            ] = 'true';
          }
        });
        modal.value = {
          id: currentId,
          parentId,
          url,
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
        topLevelModalId.value = currentId;
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
    id: currentId, parentId, url, loading: true, cancelToken, close: () => closeSelf(),
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
