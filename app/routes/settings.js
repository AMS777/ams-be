import Route from '@ember/routing/route';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import { inject as service } from '@ember/service';

export default Route.extend(AuthenticatedRouteMixin, {

  session: service('session'),

  authenticationRoute: 'login',

  model() {
    const userId = this.get('session.data.authenticated.userId');
    // findRecord() always makes a call to the server, no matter if the record
    // is already loaded on the store
    if ( ! this.store.hasRecordForId('user', userId)) {
      return this.store.findRecord('user', userId);
    } else {
      return this.store.peekRecord('user', userId);
    }
  },

  afterModel(resolvedModel) {
    resolvedModel.set('routeName', 'settings');
  },
});
