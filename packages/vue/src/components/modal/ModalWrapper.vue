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
  },
  methods: {
    CloseModal(action = 'close') {
      this.ShowBody = false;
      setTimeout(() => {
        this.$emit(action);
        this.$emit('hide');
      }, 50);
    },
  },
  watch: {
    show: {
      handler(value) {
        if (value) {
          this.$emit('show');
          setTimeout(() => {
            this.ShowBody = true;
          }, 50);
        }
      },
    },
  },
  render() {
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
            ]}
          >
            {this.$slots.overlay || (
              <div
                class={[this.$style.cover, this.$style.overlay]}
                onClick={() => this.CloseModal()}
              ></div>
            )}
            <transition
              v-show={this.ShowBody}
              name={this.mobile ? 'open-mobile' : 'open'}
            >
              {this.$slots.default}
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
              ]}
            >
              {this.$slots.overlay || (
                <div
                  class={[this.$style.cover, this.$style.overlay]}
                  onClick={() => this.CloseModal()}
                ></div>
              )}
              <transition name={this.mobile ? 'open-mobile' : 'open'}>
                {this.ShowBody ? this.$slots.default : null}
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
.open-mobile-leave-active {
  transition: all;
  transition-duration: 250ms;
}

.fade-enter,
.fade-leave-active,
.open-enter,
.open-leave-active,
.open-mobile-enter,
.open-mobile-leave-active {
  opacity: 0;
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
  z-index: -1;
}

.wrapper {
  @apply flex flex-col;
  @apply items-center justify-center;
  z-index: 99999;
}

.padding {
  @apply px-4 pb-4;
}

.overlay {
  @apply bg-black bg-opacity-75;
}

@media (max-width: 640px) {
  .mobile-enabled {
    @apply justify-end;
  }
}
</style>
