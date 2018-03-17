import Controller from '@ember/controller';

export default Controller.extend({

  name: '',
  email: '',
  message: '',

  contactMessageSentSuccessfully: false,

  actions: {
    submitContactMessage() {
      this.set('contactMessageSentSuccessfully', true);
      this.set('name', '');
      this.set('email', '');
      this.set('message', '');
    },
  },

  showContactFormIfItIsHidden() {

    if (this.get('contactMessageSentSuccessfully')) {
      this.set('contactMessageSentSuccessfully', false);
    }
  },
});
