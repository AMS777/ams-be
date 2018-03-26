import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({

  session: service('session'),

  actions: {
    submitLoginForm() {
      this.authenticate();
    },
  },

  authenticate() {

    const email = this.get('model').get('email');
    const password = this.get('model').get('password');

    this.get('session').authenticate(
      'authenticator:oauth2', email, password
//      'authenticator:oauth2', email, password, [], { contentType: 'application/json; charset=utf-8' }
//      'authenticator:oauth2', email, password, { 'Content-Type': 'application/json; charset=utf-8' }
//      'authenticator:oauth2', email, password, '', { 'Content-Type': 'application/json' }
    ).catch((reason) => {
//      if (reason.error === 'invalid_request') {
//        this.set('showLoginDataEmptyDialog', true);
//      } else if (reason.error === 'invalid_grant' && reason.error_description === 'Email not found.') {
//        this.set('showRegisterDialog', true);
//      } else if (reason.error === 'invalid_grant' && reason.error_description === 'Password does not match email.') {
//        this.set('showLoginPasswordDoesNotMatchDialog', true);
//      } else {
//        this.set('showLoginErrorDialog', true);
//      }
    });
  },
});
