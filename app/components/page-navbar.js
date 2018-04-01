import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';

export default Component.extend({

  session: service('session'),

  userName: computed('firstName', 'lastName', function() {
    return this.get('session.data.authenticated.userName');
  }),

  actions: {
    invalidateSession() {
      this.get('session').invalidate();
    }
  }
});
