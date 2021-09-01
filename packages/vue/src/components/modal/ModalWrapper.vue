<script>
export default {
  name: 'ModalWrapper',
  data() {
    return {
      ShowBody: false,
    };
  },
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
  methods: {
    CloseModal(action = 'close') {
      this.ShowBody = false;
      setTimeout(() => {
        this.$emit(action);
        this.$emit('hide');
      }, 75);
    },
  },
  watch: {
    show: {
      handler(value) {
        if (value) {
          this.$emit('show');
          setTimeout(() => {
            this.ShowBody = true;
          }, 75);
        }
      },
    },
  },
  render() {
    const slots = this.$scopedSlots;
    if (this.keepAlive)
      return (
        <transition name="fade">
          <div
            v-show={this.show}
            class={[
              this.$style.wrapper,
              this.$style.cover,
              !this.fullscreen && this.$style.padding,
              this.mobile && this.$style['mobile-enabled'],
              this.sheet && this.$style.sheet,
            ]}
          >
            {slots.overlay ? (
              slots.overlay({ CloseModal: this.CloseModal })
            ) : (
              <div
                class={[this.$style.cover, this.$style.overlay]}
                onClick={() => !this.actionRequired && this.CloseModal()}
              ></div>
            )}
            <transition
              name={this.sheet ? 'sheet' : this.mobile ? 'open-mobile' : 'open'}
            >
              <div
                v-show={this.ShowBody}
                class={this.$style.fullscreen}
                vOn:click_self={() => !this.actionRequired && this.CloseModal()}
              >
                {slots.default
                  ? slots.default({ CloseModal: this.CloseModal })
                  : null}
              </div>
            </transition>
          </div>
        </transition>
      );
    else {
      return (
        <transition name="fade">
          {this.show ? (
            <div
              class={[
                this.$style.wrapper,
                this.$style.cover,
                !this.fullscreen && this.$style.padding,
                this.mobile && this.$style['mobile-enabled'],
                this.sheet && this.$style.sheet,
              ]}
            >
              {slots.overlay ? (
                slots.overlay({ CloseModal: this.CloseModal })
              ) : (
                <div
                  class={[this.$style.cover, this.$style.overlay]}
                  onClick={() => !this.actionRequired && this.CloseModal()}
                ></div>
              )}
              <transition
                name={
                  this.sheet ? 'sheet' : this.mobile ? 'open-mobile' : 'open'
                }
              >
                {this.ShowBody ? (
                  <div
                    class={this.$style.fullscreen}
                    vOn:click_self={() =>
                      !this.actionRequired && this.CloseModal()
                    }
                  >
                    {slots.default
                      ? slots.default({ CloseModal: this.CloseModal })
                      : null}
                  </div>
                ) : null}
              </transition>
            </div>
          ) : null}
        </transition>
      );
    }
  },
};
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

.fade-enter,
.fade-leave-active,
.open-enter,
.open-leave-active,
.open-mobile-enter,
.open-mobile-leave-active,
.sheet-enter,
.sheet-leave-active {
  opacity: 0;
}

.sheet-enter,
.sheet-leave-active {
  transform: translateY(100%);
}

.open-enter,
.open-leave-active,
.open-mobile-enter,
.open-mobile-leave-active {
  scale: 0.9;
}

@media (max-width: 640px) {
  .open-mobile-enter,
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
