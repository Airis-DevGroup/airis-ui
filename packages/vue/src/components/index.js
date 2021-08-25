import AirisBanner from './banner/Banner.vue';
import AirisDropdown from './dropdown/Dropdown.vue';
import AirisBaseModal from './modal/BaseModal.vue';
import AirisModalWrapper from './modal/ModalWrapper.vue';
import AirisStep from './stepper/Step.vue';
import AirisStepper from './stepper/Stepper.vue';
import AirisPhotoPicker from './photo-picker/PhotoPicker.vue';

function install(Vue, { components }) {
  if (components && Array.isArray(components) && components.length > 0) {
    components.forEach((component) => {
      switch (component) {
        case 'banner':
          Vue.component('airis-banner', AirisBanner);
          break;
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
        case 'photo-picker':
          Vue.component('airis-photo-picker', AirisPhotoPicker);
          break;
      }
    });
  } else {
    Vue.component('airis-banner', AirisBanner);
    Vue.component('airis-dropdown', AirisDropdown);
    Vue.component('airis-base-modal', AirisBaseModal);
    Vue.component('airis-modal-wrapper', AirisModalWrapper);
    Vue.component('airis-step', AirisStep);
    Vue.component('airis-stepper', AirisStepper);
    Vue.component('airis-photo-picker', AirisPhotoPicker);
  }
}

export default { install };

export {
  AirisBanner,
  AirisDropdown,
  AirisBaseModal,
  AirisModalWrapper,
  AirisStep,
  AirisStepper,
  AirisPhotoPicker,
};
