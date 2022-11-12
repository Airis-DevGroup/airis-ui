<script>
export default {
  name: 'AirisModalWrapper',
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
        <transition name="___airis-fade">
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
              name={
                this.sheet
                  ? '___airis-sheet'
                  : this.mobile
                  ? '___airis-open-mobile'
                  : '___airis-open'
              }
            >
              <div
                v-show={this.ShowBody}
                class={this.$style.fullscreen}
                vOn:click_self={() => !this.actionRequired && this.CloseModal()}
              >
                {slots.default ? slots.default({ CloseModal: this.CloseModal }) : null}
              </div>
            </transition>
          </div>
        </transition>
      );
    else {
      return (
        <transition name="___airis-fade">
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
                  this.sheet
                    ? '___airis-sheet'
                    : this.mobile
                    ? '___airis-open-mobile'
                    : '___airis-open'
                }
              >
                {this.ShowBody ? (
                  <div
                    class={this.$style.fullscreen}
                    vOn:click_self={() => !this.actionRequired && this.CloseModal()}
                  >
                    {slots.default ? slots.default({ CloseModal: this.CloseModal }) : null}
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

.___airis-fade-enter,
.___airis-fade-leave-active,
.___airis-open-enter,
.___airis-open-leave-active,
.___airis-open-mobile-enter,
.___airis-open-mobile-leave-active,
.___airis-sheet-enter,
.___airis-sheet-leave-active {
  opacity: 0;
}

.___airis-sheet-enter,
.___airis-sheet-leave-active {
  transform: translateY(100%);
}

.___airis-open-enter,
.___airis-open-leave-active,
.___airis-open-mobile-enter,
.___airis-open-mobile-leave-active {
  scale: 0.9;
}

@media (max-width: 640px) {
  .___airis-open-mobile-enter,
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
