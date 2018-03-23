import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({

  ajax: service(),

  name: '',
  email: '',
  message: '',
  errorMessage: '',

  contactMessageSentSuccessfully: false,
  showDialog_ErrorMessage: false,

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

    this.get('ajax').post('contact-message', {
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
        this.set('errorMessage', payload.errors[0].title);
      } catch (e) {
        this.set('errorMessage', 'The contact message cannot be sent.');
      }
      this.set('showDialog_ErrorMessage', true);
    });
  },
});
