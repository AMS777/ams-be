import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({

  session: service('session'),

  showDialog_ErrorMessage: false,
  errorTitle: '',
  errorMessage: '',

  actions: {
    submitRegisterForm() {
      this.handleSubmitRegisterForm();
    },
  },

  handleSubmitRegisterForm() {

    this.get('model').save().then(() => {
      this.authenticate();
    }).catch((reason) => {
      try {
        // only first error message is shown, multiple error messages not
        // expected often
        this.setProperties({
          'errorTitle': reason.errors[0].title,
          'errorMessage': reason.errors[0].detail,
        });
      } catch (e) {
        this.setProperties({
          'errorTitle': 'Register Error',
          'errorMessage': 'The user account cannot be registered.',
        });
      }
      this.set('showDialog_ErrorMessage', true);
    });
  },

  authenticate() {

    const email = this.get('model').get('email');
    const password = this.get('model').get('password');

    this.get('session').authenticate('authenticator:oauth2', email, password).then(() => {

      this.transitionToRoute('register-confirmation');
    }).catch((reason) => {
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
