import { App } from 'vue';

import AirisBanner from './banner/Banner.vue';
import AirisDropdown from './dropdown/Dropdown.vue';
import AirisBaseModal from './modal/BaseModal.vue';
import AirisModalWrapper from './modal/ModalWrapper.vue';
import AirisStep from './stepper/Step.vue';
import AirisStepper from './stepper/Stepper.vue';
import AirisPhotoPicker from './photo-picker/PhotoPicker.vue';

interface AirisUiOptions {
  components?: ['banner' | 'dropdown' | 'modal' | 'stepper' | 'photo-picker'];
}

function install(app: App, { components }: AirisUiOptions): void {
  if (components && Array.isArray(components) && components.length > 0) {
    components.forEach((component) => {
      switch (component) {
        case 'banner':
          app.component('airis-banner', AirisBanner);
          break;
        case 'dropdown':
          app.component('airis-dropdown', AirisDropdown);
          break;
        case 'modal':
          app.component('airis-base-modal', AirisBaseModal);
          app.component('airis-modal-wrapper', AirisModalWrapper);
          break;
        case 'stepper':
          app.component('airis-step', AirisStep);
          app.component('airis-stepper', AirisStepper);
          break;
        case 'photo-picker':
          app.component('airis-photo-picker', AirisPhotoPicker);
          break;
      }
    });
  } else {
    app.component('airis-banner', AirisBanner);
    app.component('airis-dropdown', AirisDropdown);
    app.component('airis-base-modal', AirisBaseModal);
    app.component('airis-modal-wrapper', AirisModalWrapper);
    app.component('airis-step', AirisStep);
    app.component('airis-stepper', AirisStepper);
    app.component('airis-photo-picker', AirisPhotoPicker);
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
