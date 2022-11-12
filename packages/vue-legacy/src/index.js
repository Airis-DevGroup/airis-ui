import AirisBanner from '@/components/banner/Banner.vue';
import AirisDropdown from '@/components/dropdown/Dropdown.vue';
import AirisBaseModal from '@/components/modal/BaseModal.vue';
import AirisModalWrapper from '@/components/modal/ModalWrapper.vue';
import AirisStep from '@/components/stepper/Step.vue';
import AirisStepper from '@/components/stepper/Stepper.vue';

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
      }
    });
  } else {
    Vue.component('airis-banner', AirisBanner);
    Vue.component('airis-dropdown', AirisDropdown);
    Vue.component('airis-base-modal', AirisBaseModal);
    Vue.component('airis-modal-wrapper', AirisModalWrapper);
    Vue.component('airis-step', AirisStep);
    Vue.component('airis-stepper', AirisStepper);
  }
}

export default { install };

export { AirisBanner, AirisDropdown, AirisBaseModal, AirisModalWrapper, AirisStep, AirisStepper };
