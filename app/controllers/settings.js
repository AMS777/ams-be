import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({

  session: service('session'),

  showDialog_ErrorMessage: false,
  errorTitle: '',
  errorMessage: '',

  actions: {
    submitUserAccountForm() {
      this.handleSubmitUserAccountForm();
    },
  },

  handleSubmitUserAccountForm() {

    this.get('model').save().then(() => {
      this.set('session.data.authenticated.userName', this.get('model.name'));
    }).catch((reason) => {
      try {
        // only first error message is shown, multiple error messages not
        // expected often
        this.setProperties({
          'errorTitle': reason.errors[0].title,
          'errorMessage': reason.errors[0].detail,
        });
      } catch (e) {
        this.setProperties({
          'errorTitle': 'Register Error',
          'errorMessage': 'The user account cannot be registered.',
        });
      }
      this.set('showDialog_ErrorMessage', true);
    });
  },
});
