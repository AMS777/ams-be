import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({

  ajax: service(),

  name: '',
  email: '',
  message: '',

  contactMessageSentSuccessfully: false,

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

    const jsonApi = {data: {'data': {
      'type': 'contactMessage',
      'attributes': {
        'name': this.get('name'),
        'email': this.get('email'),
        'message': this.get('message'),
      }
    }}};

    this.get('ajax').post('contact-message', jsonApi).then(() => {
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
    });
  },
});
