import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { validator, buildValidations } from 'ember-cp-validations';
import ENV from '../config/environment';

const Validations = buildValidations({
  password: [
    validator('presence', {
      presence: true,
      message: 'Password is required.',
    }),
    validator('length', {
      min: ENV.APP.PASSWORD_MIN_CHARACTERS,
      max: ENV.APP.PASSWORD_MAX_CHARACTERS,
      message(type) {
        if (type === 'tooShort') {
          return 'Minimum ' + ENV.APP.PASSWORD_MIN_CHARACTERS + ' characters.';
        }
        if (type === 'tooLong') {
          return 'Maximum ' + ENV.APP.PASSWORD_MAX_CHARACTERS + ' characters.';
        }
      },
      allowBlank: true,
    })
  ],
  repeatPassword: validator('confirmation', {
    on: 'password',
    message: 'Passwords do not match.',
  }),
});

export default Controller.extend(Validations, {

  ajax: service(),

  resetPasswordToken: '',
  password: '',
  repeatPassword: '',

  showDialog_Error: false,
  dialogTitle: '',
  dialogMessage: '',

  actions: {
    submitResetPasswordForm() {
      this.handleSubmitResetPasswordForm();
    },
  },

  handleSubmitResetPasswordForm() {

    const jsonApi = { data: {
      'type': 'resetPassword',
      'attributes': {
        'reset_password_token': this.get('resetPasswordToken'),
        'password': this.get('password'),
      }
    }};

    this.get('ajax').post('/reset-password', {
      data: jsonApi,
      dataType: 'json',
      contentType: 'application/json; charset=utf-8',
    }).then(() => {
      this.setProperties({
        'password': '',
        'repeatPassword': '',
      });
      this.transitionToRoute('reset-password-confirmation');
    }).catch(({ payload }) => {
      try {
        // only first error message is shown, multiple error messages not
        // expected often
        this.setProperties({
          'dialogTitle': payload.errors[0].title,
          'dialogMessage': payload.errors[0].detail,
        });
      } catch (e) {
        this.setProperties({
          'dialogTitle': 'Reset Password Error',
          'dialogMessage': 'The password cannot be reset.',
        });
      }
      this.set('showDialog_Error', true);
    });
  },
});
