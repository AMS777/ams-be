import DS from 'ember-data';
import ENV from '../config/environment';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

export default DS.JSONAPIAdapter.extend({

  session: service('session'),

  namespace: ENV.apiNamespace,

  headers: computed('session.data.authenticated', function() {
    return {
      'Authorization': 'Bearer ' + this.get('session.data.authenticated.access_token'),
    };
  }),
});
