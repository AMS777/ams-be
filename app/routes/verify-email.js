import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({

  ajax: service(),

  emailVerified: false,

  model(params) {

    const jsonApi = { data: {
      'type': 'resetPassword',
      'attributes': {
        'verify_email_token': params.verify_email_token,
        'password': this.get('password'),
      }
    }};

    return this.get('ajax').post('/verify-email', {
      data: jsonApi,
      dataType: 'json',
      contentType: 'application/json; charset=utf-8',
    }).then(() => {
      this.set('emailVerified', true);
    }).catch(() => {
      this.set('emailVerified', false);
    });
  },

  setupController: function (controller) {
    this._super(...arguments);
    controller.set('emailVerified', this.get('emailVerified'));
  },
});
