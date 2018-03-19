import Component from '@ember/component';

export default Component.extend({
  showDialog: false,
  closeButtonCaption: 'Close',
  iconError: false,
  iconSuccess: false,
  actions: {
    closeDialog() {
      this.set('showDialog', false);
    }
  },
});
