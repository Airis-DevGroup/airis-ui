<script>
export default {
  name: 'Step',
  props: {
    canAdvance: {
      type: Boolean,
      default: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    index() {
      return this.$parent.$children.findIndex((child) => child == this);
    },
    isCurrent() {
      return this.index == this.$parent.currentIndex;
    },
    keep() {
      return this.$parent.keepAlive;
    },
  },
  render() {
    if (this.keep) {
      return (
        <transition name="step">
          <div v-show={this.isCurrent} class={this.$style.step}>
            {this.$slots.default}
          </div>
        </transition>
      );
    } else {
      return (
        <transition name="step">
          {this.isCurrent ? (
            <div class={this.$style.step}>{this.$slots.default}</div>
          ) : null}
        </transition>
      );
    }
  },
};
</script>

<style module>
.step {
  width: 100%;
  height: 100%;
}
</style>

<style scoped>
.step-enter-active,
.step-leave-active {
  transition-property: all;
  transition-duration: 250ms;
}

.step-enter,
.step-leave-active {
  @apply opacity-0;
}

.step-enter {
  transform: translateX(var(--___stepper_forward));
}
.step-leave-active {
  @apply absolute;
  transform: translateX(var(--___stepper_backward));
}
</style>
