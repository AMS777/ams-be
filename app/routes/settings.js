import Route from '@ember/routing/route';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import { inject as service } from '@ember/service';

export default Route.extend(AuthenticatedRouteMixin, {

  session: service('session'),

  authenticationRoute: 'login',

  model() {
    // findRecord() always makes a call to the server, no matter if the record
    // is already loaded on the store
    if ( ! this.store.hasRecordForId('user', this.get('session.data.authenticated.userId'))) {
      return this.store.findRecord('user', this.get('session.data.authenticated.userId'));
    }
  },
});
