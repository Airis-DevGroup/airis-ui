<script lang="tsx">
import {
  defineComponent,
  provide,
  ref,
  Transition,
  useCssModule,
  watchEffect,
  withModifiers,
} from 'vue';

export default defineComponent({
  name: 'AirisModalWrapper',
  components: { Transition },
  emits: ['accept', 'cancel', 'close', 'hide', 'show'],
  props: {
    show: {
      type: Boolean,
      required: true,
    },
    fullscreen: {
      type: Boolean,
      default: false,
    },
    keepAlive: {
      type: Boolean,
      default: false,
    },
    mobile: {
      type: Boolean,
      default: false,
    },
    sheet: {
      type: Boolean,
      default: false,
    },
    actionRequired: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit, slots }) {
    const style = useCssModule();

    const showBody = ref(false);

    const closeModal = (action: 'accept' | 'cancel' | 'close' = 'close') => {
      showBody.value = false;
      setTimeout(() => {
        emit(action);
        emit('hide');
      }, 75);
    };

    watchEffect(() => {
      if (props.show) {
        emit('show');
        setTimeout(() => {
          showBody.value = true;
        }, 75);
      }
    });

    provide('ModalWrapper', {
      closeModal,
      showBody,
    });

    return () => {
      return (
        <Transition name="___airis-fade">
          <div
            v-show={props.show}
            class={[
              style.wrapper,
              style.cover,
              !props.fullscreen && style.padding,
              props.mobile && style['mobile-enabled'],
              props.sheet && style.sheet,
            ]}
          >
            {slots.overlay ? (
              slots.overlay({ closeModal })
            ) : (
              <div
                class={[style.cover, style.overlay]}
                onClick={() => !props.actionRequired && closeModal()}
              ></div>
            )}
            <Transition
              name={
                props.sheet
                  ? '___airis-sheet'
                  : props.mobile
                  ? '___airis-open-mobile'
                  : '___airis-open'
              }
            >
              {props.keepAlive ? (
                <div
                  v-show={showBody.value}
                  class={style.fullscreen}
                  onClick={withModifiers(() => !props.actionRequired && closeModal(), ['self'])}
                >
                  {slots.default ? slots.default({ closeModal }) : null}
                </div>
              ) : showBody.value ? (
                <div
                  class={style.fullscreen}
                  onClick={withModifiers(() => !props.actionRequired && closeModal(), ['self'])}
                >
                  {slots.default ? slots.default({ closeModal }) : null}
                </div>
              ) : null}
            </Transition>
          </div>
        </Transition>
      );
    };
  },
});
</script>

<style scoped>
.___airis-fade-enter-active,
.___airis-fade-leave-active,
.___airis-open-enter-active,
.___airis-open-leave-active,
.___airis-open-mobile-enter-active,
.___airis-open-mobile-leave-active,
.___airis-sheet-enter-active,
.___airis-sheet-leave-active {
  transition: all;
  transition-duration: 250ms;
}

.___airis-fade-enter-from,
.___airis-fade-leave-active,
.___airis-open-enter-from,
.___airis-open-leave-active,
.___airis-open-mobile-enter-from,
.___airis-open-mobile-leave-active,
.___airis-sheet-enter-from,
.___airis-sheet-leave-active {
  opacity: 0;
}

.___airis-sheet-enter-from,
.___airis-sheet-leave-active {
  transform: translateY(100%);
}

.___airis-open-enter-from,
.___airis-open-leave-active,
.___airis-open-mobile-enter-from,
.___airis-open-mobile-leave-active {
  scale: 0.9;
}

@media (max-width: 640px) {
  .___airis-open-mobile-enter-from,
  .___airis-open-mobile-leave-active {
    scale: 1;
    transform: translateY(2rem);
  }
}
</style>

<style module>
.cover {
  @apply fixed inset-0;
  z-index: 99999;
}

.wrapper {
  @apply w-full h-full;
  @apply flex flex-col;
  @apply items-center justify-center;
}

.padding {
  @apply px-4 pb-4;
}

.overlay {
  @apply bg-black bg-opacity-75;
  z-index: -1;
}

.fullscreen {
  @apply w-full;
  @apply flex flex-col;
  @apply items-center justify-center;
}
.sheet {
  @apply pb-0;
  @apply justify-end;
}

@media (max-width: 640px) {
  .mobile-enabled {
    @apply justify-end;
  }
}
</style>
