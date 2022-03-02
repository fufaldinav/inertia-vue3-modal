<template>
  <template v-if="modal">
    <slot
        name="default"
        :component="modal.component"
        :props="modal.page.props"
        :content-ref="(elm) => telRef = elm"
        :close="close"
        :bind="modal.bind"
    />
    <Teleport
        v-if="telRef"
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
import Axios from 'axios';
import Cancel from 'axios/lib/cancel/Cancel';
import {
  provide, ref, shallowRef, watch,
} from 'vue';
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
  component: unknown,
  removeBeforeEventListener: VoidFunction,
  interceptor: number,
  page: object,
  bind: object,
}

const telRef = ref(null);
const modal = shallowRef<null | ModalRef>(null);

provide(injectIsModal, true);

const close = () => {
  if (modal.value) {
    // remove the 'x-inertia-modal' and 'x-inertia-modal-redirect-back' headers for future requests
    modal.value.removeBeforeEventListener();
    Axios.interceptors.response.eject(modal.value.interceptor);
    modal.value = null;
  }
};

const visitInModal = (url: string, options: VisitOptions & {redirectBack?: boolean, modalProps?: object}) => {
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
        const removeBeforeEventListener = Inertia.on('before', (event) => {
          // make sure the backend knows we're requesting from within a modal
          event.detail.visit.headers[modalHeader] = currentId;
          if (opts.redirectBack) {
            event.detail.visit.headers[
              'X-Inertia-Modal-Redirect-Back'
            ] = 'true';
          }
        });
        modal.value = {
          component,
          removeBeforeEventListener,
          interceptor,
          page: clone,
          bind: opts.modalProps,
        };
      });
      return Promise.reject(new Cancel());
    }
    return response;
  });
  Inertia.visit(url, {
    ...opts,
    headers: { ...opts.headers, [modalHeader]: currentId },
  });
};

watch(() => props.modalKey, (key) => {
  const fn = `visitInModal${key}`;
  // @ts-ignore
  Inertia[fn] = visitInModal;
}, { immediate: true });
</script>
