<script lang="tsx">
import {
  computed,
  defineComponent,
  getCurrentInstance,
  inject,
  useCssModule,
  watchEffect,
  Transition,
} from 'vue';

export default defineComponent({
  name: 'AirisStep',
  components: {
    Transition,
  },
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    canAdvance: {
      type: Boolean,
      default: true,
    },
  },
  setup(_, { slots }) {
    const style = useCssModule();
    const instance = getCurrentInstance();
    const { steps, keepAlive, currentIndex } = inject('AirisStepper') || ({} as any);

    const index = computed(() => {
      return steps?.value.findIndex((step: { uid: number }) => step?.uid == instance?.uid);
    });

    const isCurrent = computed(() => {
      return index.value == currentIndex?.value;
    });

    watchEffect(() => {
      if (index.value === -1) steps?.value.push(instance);
    });

    return () => {
      if (keepAlive) {
        return (
          <Transition name="___airis-step">
            <div v-show={isCurrent.value} class={style.step}>
              {slots.default?.()}
            </div>
          </Transition>
        );
      } else {
        return (
          <Transition name="___airis-step">
            {isCurrent.value ? <div class={style.step}>{slots.default?.()}</div> : null}
          </Transition>
        );
      }
    };
  },
});
</script>

<style scoped>
.___airis-step-enter-active,
.___airis-step-leave-active {
  transition-property: all;
  transition-duration: 250ms;
}

.___airis-step-enter-from,
.___airis-step-leave-active {
  opacity: 0;
}

.___airis-step-enter-from {
  transform: translateX(var(--___airis-stepper-forward));
}
.___airis-step-leave-active {
  position: absolute;
  transform: translateX(var(--___airis-stepper-backward));
}
</style>

<style module>
.step {
  @apply h-full w-full;
}
</style>
