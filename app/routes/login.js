import Route from '@ember/routing/route';
import UnauthenticatedRouteMixin from 'ember-simple-auth/mixins/unauthenticated-route-mixin';

export default Route.extend(UnauthenticatedRouteMixin, {

  routeIfAlreadyAuthenticated: 'index',

  init() {
    this._super(...arguments);
    this.controllerName = 'login-and-register';
  },

  model() {

    return this.store.createRecord('user');
  },

  afterModel(resolvedModel) {
    resolvedModel.set('routeName', 'login');
  },

  actions: {
    willTransition() {
      this._super(...arguments);
      this.store.unloadAll('user');
    },
  },
});
