import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({

  session: service('session'),
  ajax: service(),

  showDialog_Error: false,
  showDialog_RequestResetPassword: false,
  dialogTitle: '',
  dialogMessage: '',

  actions: {
    submitLoginForm() {
      this.authenticate();
    },
    submitRegisterForm() {
      this.handleSubmitRegisterForm();
    },
    submitRequestResetPasswordForm() {
      this.handleSubmitRequestResetPasswordForm();
    },
    showRequestResetPasswordDialog() {
      this.set('showDialog_RequestResetPassword', true);
    },
    closeRequestResetPasswordDialog() {
      this.set('showDialog_RequestResetPassword', false);
    },
  },

  authenticate() {

    const email = this.get('model').get('email');
    const password = this.get('model').get('password');

    return this.get('session').authenticate('authenticator:oauth2', email, password).catch((reason) => {
      // "reason.errors[0]": JSON API error format
      try {
        // only first error message is shown, multiple error messages not
        // expected often
        this.setProperties({
          'dialogTitle': reason.errors[0].title,
          'dialogMessage': reason.errors[0].detail,
        });
      } catch (e) {
        // "reason.error_description": OAuth 2.0 error format
        if (reason.error_title) {
          this.set('dialogTitle', reason.error_title);
        } else {
          this.set('dialogTitle', 'Login Error');
        }
        if (reason.error_description) {
          this.set('dialogMessage', reason.error_description);
        } else {
          this.set('dialogMessage', 'The user account cannot be logged in.');
        }
      }
      this.set('showDialog_Error', true);
    });
  },

  handleSubmitRegisterForm() {
    
    this.get('model').save().then(() => {
      this.authenticate().then(() => {
        this.transitionToRoute('register-confirmation');
      }).catch((reason) => {
        try {
          // only first error message is shown, multiple error messages not
          // expected often
          this.setProperties({
            'dialogTitle': reason.errors[0].title,
            'dialogMessage': reason.errors[0].detail,
          });
        } catch (e) {
          this.setProperties({
            'dialogTitle': 'Login Error',
            'dialogMessage': 'The user account cannot be logged in after register.',
          });
        }
      });
    }).catch((reason) => {
      try {
        // only first error message is shown, multiple error messages not
        // expected often
        this.setProperties({
          'dialogTitle': reason.errors[0].title,
          'dialogMessage': reason.errors[0].detail,
        });
      } catch (e) {
        this.setProperties({
          'dialogTitle': 'Register Error',
          'dialogMessage': 'The user account cannot be registered.',
        });
      }
      this.set('showDialog_Error', true);
    });
  },

  handleSubmitRequestResetPasswordForm() {

    const jsonApi = { data: {
      type: 'users',
      attributes: {
        email: this.get('model.email'),
      }
    }};

    this.get('ajax').post('/request-reset-password', {
      data: jsonApi,
      dataType: 'json',
      contentType: 'application/json; charset=utf-8',
    }).then(() => {
      this.set('email', '');
      this.transitionToRoute('request-reset-password-confirmation');
    }).catch(({ payload }) => {
      this.set('showDialog_RequestResetPassword', false);
      try {
        // only first error message is shown, multiple error messages not
        // expected often
        this.setProperties({
          'dialogTitle': payload.errors[0].title,
          'dialogMessage': payload.errors[0].detail,
        });
      } catch (e) {
        this.setProperties({
          'dialogTitle': 'Request Reset Password Error',
          'dialogMessage': 'The request reset password cannot be processed.',
        });
      }
      this.set('showDialog_Error', true);
    });
  },
});
