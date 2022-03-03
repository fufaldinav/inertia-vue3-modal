<template>
  <template v-if="!inModal">
  <slot></slot>
  <Teleport :to="teleportRef">
    <slot name="modal" />
  </Teleport>
  </template>
  <slot v-else name="toModal" />
</template>

<script setup lang="ts">
import { provide, shallowRef } from 'vue';
import isModal from './isModal';

const teleportRef = shallowRef<Element | null>(null);

provide('ModalSlotRef', (el: Element) => {
  teleportRef.value = el;
});

const inModal = isModal();
</script>
