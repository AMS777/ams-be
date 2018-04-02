import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({

  session: service('session'),

  showDialog_Success: false,
  showDialog_Error: false,
  showDialog_Info: false,
  dialogTitle: '',
  dialogMessage: '',

  actions: {
    submitUserAccountForm() {
      this.handleSubmitUserAccountForm();
    },
  },

  handleSubmitUserAccountForm() {

    if ( ! this.get('model.hasDirtyAttributes')) {
      this.setProperties({
        'dialogTitle': 'No Changes',
        'dialogMessage': 'There are no changes in the account.',
        'showDialog_Info': true,
      });
    } else {
      this.get('model').save().then(() => {
        this.setProperties({
          'dialogTitle': 'Update Successful',
          'dialogMessage': 'The account has been updated successfully.',
          'showDialog_Success': true,
        });
        this.set('session.data.authenticated.userName', this.get('model.name'));
        this.setProperties({
          'model.password': '',
          'model.repeatPassword': '',
        });
      }).catch((reason) => {
        try {
          // only first error message is shown, multiple error messages not
          // expected often
          this.setProperties({
            'dialogTitle': reason.errors[0].title,
            'dialogMessage': reason.errors[0].detail,
          });
        } catch (e) {
          this.setProperties({
            'dialogTitle': 'Update Error',
            'dialogMessage': 'The user account cannot be updated.',
          });
        }
        this.set('showDialog_Error', true);
      });
    }
  },
});
