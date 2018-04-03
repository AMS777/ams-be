import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { validator, buildValidations } from 'ember-cp-validations';

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
  message: [
    validator('presence', {
      presence: true,
      ignoreBlank: true,
      message: 'Message is required.',
    }),
  ],
});

export default Controller.extend(Validations, {

  ajax: service(),

  name: '',
  email: '',
  message: '',

  showDialog_Error: false,
  dialogTitle: '',
  dialogMessage: '',

  actions: {
    submitContactMessage() {
      this.handleSubmitContactMessage();
    },
  },

  handleSubmitContactMessage() {

    const jsonApi = { data: {
      type: 'contactMessage',
      attributes: {
        name: this.get('name'),
        email: this.get('email'),
        message: this.get('message'),
      }
    }};

    this.get('ajax').post('/contact-message', {
      data: jsonApi,
      dataType: 'json',
      contentType: 'application/json; charset=utf-8',
    }).then(() => {
      this.setProperties({
        'name': '',
        'email': '',
        'message': '',
      });
      this.transitionToRoute('contact-confirmation');
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
          'dialogTitle': 'Contact Message Error',
          'dialogMessage': 'The contact message cannot be sent.',
        });
      }
      this.set('showDialog_Error', true);
    });
  },
});
