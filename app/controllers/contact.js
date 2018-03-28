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

  contactMessageSentSuccessfully: false,
  showDialog_ErrorMessage: false,
  errorTitle: '',
  errorMessage: '',

  actions: {
    submitContactMessage() {
      this.handleSubmitContactMessage();
    },
  },

  showContactFormIfItIsHidden() {

    if (this.get('contactMessageSentSuccessfully')) {
      this.set('contactMessageSentSuccessfully', false);
    }
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
        'contactMessageSentSuccessfully': true,
        'name': '',
        'email': '',
        'message': '',
      });
    }).catch(({ payload }) => {
      try {
        // only first error message is shown, multiple error messages not
        // expected often
        this.setProperties({
          'errorTitle': payload.errors[0].title,
          'errorMessage': payload.errors[0].detail,
        });
      } catch (e) {
        this.setProperties({
          'errorTitle': 'Contact Message Error',
          'errorMessage': 'The contact message cannot be sent.',
        });
      }
      this.set('showDialog_ErrorMessage', true);
    });
  },
});
