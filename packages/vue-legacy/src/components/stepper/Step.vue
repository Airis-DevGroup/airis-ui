<script>
export default {
  name: 'AirisStep',
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
        <transition name="___airis-step">
          <div v-show={this.isCurrent} class={this.$style.step}>
            {this.$slots.default}
          </div>
        </transition>
      );
    } else {
      return (
        <transition name="___airis-step">
          {this.isCurrent ? <div class={this.$style.step}>{this.$slots.default}</div> : null}
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
.___airis-step-enter-active,
.___airis-step-leave-active {
  transition-property: all;
  transition-duration: 250ms;
}

.___airis-step-enter,
.___airis-step-leave-active {
  @apply opacity-0;
}

.___airis-step-enter {
  transform: translateX(var(--___airis-stepper-forward));
}
.___airis-step-leave-active {
  @apply absolute;
  transform: translateX(var(--___airis-stepper-backward));
}
</style>
