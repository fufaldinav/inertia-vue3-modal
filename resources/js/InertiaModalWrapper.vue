<template>
  <template v-if="modal">
    <slot name="default" />
    <Teleport v-if="modal.component && telRef" :to="telRef">
      <slot name="component" />
    </Teleport>
  </template>
</template>

<script setup lang="ts">
import { provide } from 'vue';
import { provider } from './useModalSlot';
import { injectIsModal } from './symbols';
import { ModalItem } from './types';

const props = defineProps<{ modal: ModalItem }>();

const telRef = provider();

provide(injectIsModal, props.modal);
</script>

<style scoped>

</style>
