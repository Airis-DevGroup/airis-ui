<template>
  <AirisStepper keep-alive>
    <AirisStep>A</AirisStep>
    <AirisStep disabled>B</AirisStep>
    <AirisStep>C</AirisStep>
    <AirisStep disabled>D</AirisStep>
    <AirisStep>F</AirisStep>
  </AirisStepper>
</template>

<script>
import '@airis-ui/vue-legacy/styles';
import { AirisStep, AirisStepper } from '@airis-ui/vue-legacy';
export default {
  components: { AirisStep, AirisStepper },
};
</script>
