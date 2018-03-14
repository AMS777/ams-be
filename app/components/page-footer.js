import Component from '@ember/component';
import { computed } from '@ember/object';
import CONFIG from '../config/environment';

export default Component.extend({

  copyrightText: computed(function () {

    return new Date().getFullYear() + ' © ' + CONFIG.TEXTS.appName;
  }),
});
