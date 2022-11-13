<template>
  <slot name="default" />
  <Teleport v-if="telRef" :to="telRef">
    <slot name="component"/>
  </Teleport>
</template>

<script setup lang="ts">
import { provider } from './useModalSlot';

const telRef = provider();
</script>

<style scoped>

</style>
