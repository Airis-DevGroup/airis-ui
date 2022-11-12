<script setup lang="ts">
import { AirisStep, AirisStepper } from '@airis-ui/vue';
import '@airis-ui/vue/styles';
</script>

<template>
  <main>
    <AirisStepper>
      <AirisStep>
        <div>Step 1</div>
      </AirisStep>
      <AirisStep>
        <div>Step 2</div>
      </AirisStep>
      <AirisStep>
        <div>Step 3</div>
      </AirisStep>
      <AirisStep>
        <div>Step 4</div>
      </AirisStep>
    </AirisStepper>
  </main>
</template>
