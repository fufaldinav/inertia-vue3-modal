<template>
  <div :ref="ref"></div>
</template>

<script setup lang="ts">
import { inject } from 'vue';

const ref = inject('ModalSlotRef');
</script>
