import Route from '@ember/routing/route';

export default Route.extend({

  model(params) {
    this.set('resetPasswordToken', params.resetPasswordToken);
  },
  
  setupController: function (controller) {
    this._super(...arguments);
    controller.set('resetPasswordToken', this.get('resetPasswordToken'));
  },
});
