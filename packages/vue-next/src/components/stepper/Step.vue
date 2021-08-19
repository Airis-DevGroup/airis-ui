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
  name: 'Step',
  components: {
    Transition,
  },
  props: {
    canAdvance: {
      type: Boolean,
      default: true,
    },
  },
  setup(_, { slots }) {
    const style = useCssModule();
    const instance = getCurrentInstance();
    const { steps, keepAlive, currentIndex } = inject('StepperState') || {};

    const index = computed(() => {
      return steps?.value.findIndex(
        (step: { uid: number }) => step?.uid == instance?.uid,
      );
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
          <Transition name="___step">
            <div v-show={isCurrent.value} class={style.step}>
              {slots.default?.()}
            </div>
          </Transition>
        );
      } else {
        return (
          <Transition name="___step">
            {isCurrent.value ? (
              <div class={style.step}>{slots.default?.()}</div>
            ) : null}
          </Transition>
        );
      }
    };
  },
});
</script>

<style module>
.step {
  width: 100%;
  height: 100%;
}
</style>

<style scoped>
.___step-enter-active,
.___step-leave-active {
  transition-property: all;
  transition-duration: 250ms;
}

.___step-enter-from,
.___step-leave-active {
  opacity: 0;
}

.___step-enter-from {
  transform: translateX(var(--___stepper_forward));
}
.___step-leave-active {
  position: absolute;
  transform: translateX(var(--___stepper_backward));
}
</style>
