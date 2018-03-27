import AjaxService from 'ember-ajax/services/ajax';
import ENV from '../config/environment';

export default AjaxService.extend({
  namespace: ENV.apiNamespace,
});
