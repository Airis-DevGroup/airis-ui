import type { App } from 'vue';

import AirisBanner from '~/components/banner/AirisBanner.vue';
import AirisDropdown from '~/components/dropdown/AirisDropdown.vue';
import AirisBaseModal from '~/components/modal/AirisBaseModal.vue';
import AirisModalWrapper from '~/components/modal/AirisModalWrapper.vue';
import AirisStep from '~/components/stepper/AirisStep.vue';
import AirisStepper from '~/components/stepper/AirisStepper.vue';

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
      }
    });
  } else {
    app.component('airis-banner', AirisBanner);
    app.component('airis-dropdown', AirisDropdown);
    app.component('airis-base-modal', AirisBaseModal);
    app.component('airis-modal-wrapper', AirisModalWrapper);
    app.component('airis-step', AirisStep);
    app.component('airis-stepper', AirisStepper);
  }
}

export default { install };

export { AirisBanner, AirisDropdown, AirisBaseModal, AirisModalWrapper, AirisStep, AirisStepper };
