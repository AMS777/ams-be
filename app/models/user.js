import DS from 'ember-data';
import { validator, buildValidations } from 'ember-cp-validations';
import ENV from '../config/environment';
import { computed } from '@ember/object';

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
      disabled: computed('model.routeName', function() {
        return this.get('model.routeName') == 'settings';
      }),
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
      },
      allowBlank: true,
    })
  ],
  repeatPassword: validator('confirmation', {
    on: 'password',
    message: 'Passwords do not match.',
  }),
});

export default DS.Model.extend(Validations, {
  name: DS.attr('string'),
  email: DS.attr('string'),
  password: DS.attr('string'),
});
