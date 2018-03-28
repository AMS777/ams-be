import DS from 'ember-data';
import { validator, buildValidations } from 'ember-cp-validations';
import ENV from '../config/environment';

const Validations = buildValidations({
  name: validator('presence', {
    presence: true,
    ignoreBlank: true,
    message: 'Name is required.',
  }),
  email: [
    validator('presence', {
      presence: true,
      ignoreBlank: true,
      message: 'Email is required.',
    }),
    validator('format', {
      type: 'email',
      message: 'Invalid email.',
    })
  ],
  password: [
    validator('presence', {
      presence: true,
      ignoreBlank: true,
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
      }
    })
  ],
  repeatPassword: validator('confirmation', {
    on: 'password',
    message: 'Passwords do not match.'
  }),
});

export default DS.Model.extend(Validations, {
  name: DS.attr('string'),
  email: DS.attr('string'),
  password: DS.attr('string'),
});
