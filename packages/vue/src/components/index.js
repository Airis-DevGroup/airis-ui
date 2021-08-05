import AirisDropdown from './dropdown/Dropdown.vue';
import AirisBaseModal from './modal/BaseModal.vue';
import AirisModalWrapper from './modal/ModalWrapper.vue';
import AirisStep from './stepper/Step.vue';
import AirisStepper from './stepper/Stepper.vue';

function install(Vue, { components }) {
  if (components && Array.isArray(components) && components.length > 0) {
    components.forEach((component) => {
      switch (component) {
        case 'dropdown':
          Vue.component('airis-dropdown', AirisDropdown);
          break;
        case 'modal':
          Vue.component('airis-base-modal', AirisBaseModal);
          Vue.component('airis-modal-wrapper', AirisModalWrapper);
          break;
        case 'stepper':
          Vue.component('airis-step', AirisStep);
          Vue.component('airis-stepper', AirisStepper);
          break;
      }
    });
  } else {
    Vue.component('airis-dropdown', AirisDropdown);
    Vue.component('airis-base-modal', AirisBaseModal);
    Vue.component('airis-modal-wrapper', AirisModalWrapper);
    Vue.component('airis-step', AirisStep);
    Vue.component('airis-stepper', AirisStepper);
  }
}

export default { install };

export {
  AirisDropdown,
  AirisBaseModal,
  AirisModalWrapper,
  AirisStep,
  AirisStepper,
};
