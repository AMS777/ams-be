import Route from '@ember/routing/route';
import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';

export default Route.extend(ApplicationRouteMixin, {

  routeAfterAuthentication: 'index',

  actions: {
    didTransition() {
      this._super(...arguments);
      window.scrollTo(0, 0);
    },
  },
});
