<template>
  <div :ref="ref"></div>
</template>

<script setup lang="ts">
import { injector } from './useModalSlot';

const ref = injector();
</script>

<script lang="ts">
export default {
  name: 'ModalSlot',
};
</script>
