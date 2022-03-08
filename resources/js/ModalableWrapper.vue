<template>
  <slot v-if="!inModal">
    <ModalSlot/>
  </slot>
  <slot v-else name="modal-only">
    <ModalSlot/>
  </slot>
  <Teleport v-if="telRef" :to="telRef">
    <slot name="modal" />
  </Teleport>
</template>

<script setup lang="ts">
import isModal from './isModal';
import ModalSlot from './ModalSlot.vue';
import { provider } from './useModalSlot';

const telRef = provider();

const inModal = isModal();
</script>

<script lang="ts">
export default {
  name: 'ModalableWrapper',
};
</script>
