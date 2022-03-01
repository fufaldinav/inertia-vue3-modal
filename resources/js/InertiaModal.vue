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
          :is="modal.component"
          v-bind="modal.page.props"
      />
    </Teleport>
  </template>
</template>

<script lang="ts" setup>
import { Inertia } from '@inertiajs/inertia';
import Axios from 'axios';
import Cancel from 'axios/lib/cancel/Cancel';
import {ref, shallowRef, unref, watch} from 'vue';
import {uniqueId} from "./uniqueId";

const props = defineProps({
  component: String,
  componentAttrs: Object,
  modalKey: {
    type: String,
    default: '',
  }
});

interface ModalRef {
  component: any,
  removeBeforeEventListener: Function,
  interceptor: number,
  page: object,
  bind: object,
}

const telRef = ref(null);
const modal = shallowRef(null as ModalRef);

const close = () => {
  if (modal.value) {
    // remove the 'x-inertia-modal' and 'x-inertia-modal-redirect-back' headers for future requests
    unref(modal).removeBeforeEventListener();
    Axios.interceptors.response.eject(modal.value.interceptor);
    modal.value = null;
  }
};

const modalHeader = 'X-Inertia-Modal';
const visitInModal = (url, opts) => {
  opts = Object.assign({ headers: {}, redirectBack: true, modalProps: {} }, opts);

  const currentId = uniqueId();

  const interceptor = Axios.interceptors.response.use(function (response) {
    if (response.headers[modalHeader.toLowerCase()] === currentId) {
      const page = response.data;
      Inertia.resolveComponent(page.component).then((component) => {
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
    } else {
      return response;
    }
  });
  Inertia.visit(url, {
    ...opts,
    headers: { ...opts.headers, [modalHeader]: currentId },
  });
};


watch(() => props.modalKey, () => {
  const fn = 'visitInModal' + props.modalKey
  Inertia[fn] = visitInModal;
});
</script>
