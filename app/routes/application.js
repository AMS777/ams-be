import Route from '@ember/routing/route';
import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';
import { inject as service } from '@ember/service';
import Ember from 'ember';

export default Route.extend(ApplicationRouteMixin, {

  session: service('session'),

  routeAfterAuthentication: 'index',

  // overwrite ApplicationRouteMixin sessionInvalidated() method which always
  // redirects to index page after session invalidation
  sessionInvalidated() {
    const session = this.get('session');
    if (session.get('urlAfterSessionInvalidation') && ( ! Ember.testing)) {
      const routeAfterSessionInvalidation = session.get('urlAfterSessionInvalidation');
      session.set('urlAfterSessionInvalidation', '');
      window.location.replace(routeAfterSessionInvalidation);
    } else {
      this._super(...arguments);
    }
  },

  actions: {
    didTransition() {
      this._super(...arguments);
      window.scrollTo(0, 0);
    },
  },
});
