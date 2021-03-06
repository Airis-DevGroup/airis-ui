<script lang="tsx">
import {
  defineComponent,
  ref,
  useCssModule,
  watchEffect,
  Transition,
  provide,
  withModifiers,
} from 'vue';

export default defineComponent({
  name: 'ModalWrapper',
  components: {
    Transition,
  },
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

    const ShowBody = ref(false);

    const CloseModal = (action: 'accept' | 'cancel' | 'close' = 'close') => {
      ShowBody.value = false;
      setTimeout(() => {
        emit(action);
        emit('hide');
      }, 75);
    };

    watchEffect(() => {
      if (props.show) {
        emit('show');
        setTimeout(() => {
          ShowBody.value = true;
        }, 75);
      }
    });

    provide('ModalWrapper', {
      CloseModal,
      ShowBody,
    });

    return () => {
      if (props.keepAlive)
        return (
          <Transition name="fade">
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
                slots.overlay({ CloseModal })
              ) : (
                <div
                  class={[style.cover, style.overlay]}
                  onClick={() => !props.actionRequired && CloseModal()}
                ></div>
              )}
              <Transition
                name={
                  props.sheet ? 'sheet' : props.mobile ? 'open-mobile' : 'open'
                }
              >
                <div
                  v-show={ShowBody.value}
                  class={style.fullscreen}
                  onClick={withModifiers(
                    () => !props.actionRequired && CloseModal(),
                    ['self'],
                  )}
                >
                  {slots.default ? slots.default({ CloseModal }) : null}
                </div>
              </Transition>
            </div>
          </Transition>
        );
      else {
        return (
          <Transition name="fade">
            {props.show ? (
              <div
                class={[
                  style.wrapper,
                  style.cover,
                  !props.fullscreen && style.padding,
                  props.mobile && style['mobile-enabled'],
                  props.sheet && style.sheet,
                ]}
              >
                {slots.overlay ? (
                  slots.overlay({ CloseModal })
                ) : (
                  <div
                    class={[style.cover, style.overlay]}
                    onClick={() => !props.actionRequired && CloseModal()}
                  ></div>
                )}
                <Transition
                  name={
                    props.sheet
                      ? 'sheet'
                      : props.mobile
                      ? 'open-mobile'
                      : 'open'
                  }
                >
                  {ShowBody.value ? (
                    <div
                      class={style.fullscreen}
                      onClick={withModifiers(
                        () => !props.actionRequired && CloseModal(),
                        ['self'],
                      )}
                    >
                      {slots.default ? slots.default({ CloseModal }) : null}
                    </div>
                  ) : null}
                </Transition>
              </div>
            ) : null}
          </Transition>
        );
      }
    };
  },
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active,
.open-enter-active,
.open-leave-active,
.open-mobile-enter-active,
.open-mobile-leave-active,
.sheet-enter-active,
.sheet-leave-active {
  transition: all;
  transition-duration: 250ms;
}

.fade-enter-from,
.fade-leave-active,
.open-enter-from,
.open-leave-active,
.open-mobile-enter-from,
.open-mobile-leave-active,
.sheet-enter-from,
.sheet-leave-active {
  opacity: 0;
}

.sheet-enter-from,
.sheet-leave-active {
  transform: translateY(100%);
}

.open-enter-from,
.open-leave-active,
.open-mobile-enter-from,
.open-mobile-leave-active {
  scale: 0.9;
}

@media (max-width: 640px) {
  .open-mobile-enter-from,
  .open-mobile-leave-active {
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
