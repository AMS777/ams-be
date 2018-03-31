import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({

  session: service('session'),

  showDialog_ErrorMessage: false,
  errorTitle: '',
  errorMessage: '',

  actions: {
    submitLoginForm() {
      this.authenticate();
    },
    submitRegisterForm() {
      this.handleSubmitRegisterForm();
    },
  },

  handleSubmitRegisterForm() {

    this.get('model').save().then(() => {
      this.authenticate().then(() => {
        this.transitionToRoute('register-confirmation');
      });
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

    return this.get('session').authenticate('authenticator:oauth2', email, password).catch((reason) => {
      if (reason.error_description) {
        // "reason.error_description": OAuth 2.0 error format
        this.set('errorMessage', reason.error_description);
        if (reason.error_title) {
          this.set('errorTitle', reason.error_title);
        } else {
          this.set('errorTitle', 'Login Error');
        }
      } else {
        // "reason.errors[0]": JSON API error format
        try {
          // only first error message is shown, multiple error messages not
          // expected often
          this.setProperties({
            'errorTitle': reason.errors[0].title,
            'errorMessage': reason.errors[0].detail,
          });
        } catch (e) {
          this.setProperties({
            'errorTitle': 'Login Error',
            'errorMessage': 'The user account cannot be logged in.',
          });
        }
      }
      this.set('showDialog_ErrorMessage', true);
    });
  },
});
