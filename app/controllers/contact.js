import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({

  ajax: service(),

  name: '',
  email: '',
  message: '',

  contactMessageSentSuccessfully: false,
  showDialog_ContactMessageDataEmpty: false,
  showDialog_InvalidEmailAddress: false,
  showDialog_SendmailProcessError: false,
  showDialog_EmailSendError: false,
  showDialog_ContactMessageError: false,

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

    const jsonApi = JSON.stringify({ data: {
      type: 'contactMessage',
      attributes: {
        name: this.get('name'),
        email: this.get('email'),
        message: this.get('message'),
      }
    }});

    this.get('ajax').post('contact-message', { data: jsonApi }).then(() => {
      this.setProperties({
        'contactMessageSentSuccessfully': true,
        'name': '',
        'email': '',
        'message': '',
      });
    }).catch(({ payload }) => {

      let errorCode = '';
      try {
        errorCode = payload.errors[0].code;
      } catch (e) {
        // content on catch block to fix Ember.js build
      }

      if (errorCode === 'empty_data') {
        this.set('showDialog_ContactMessageDataEmpty', true);
      } else if (errorCode === 'invalid_email_address') {
        this.set('showDialog_InvalidEmailAddress', true);
      } else if (errorCode === 'sendmail_process_error') {
        this.set('showDialog_SendmailProcessError', true);
      } else if (errorCode === 'error_sending_email') {
        this.set('showDialog_EmailSendError', true);
      } else {
        this.set('showDialog_ContactMessageError', true);
      }
    });
  },
});
