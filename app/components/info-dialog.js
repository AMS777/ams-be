import Component from '@ember/component';

export default Component.extend({

  showDialog: false,
  closeButtonCaption: 'Close',
  titleIcon: '',

  actions: {
    closeDialog() {
      this.set('showDialog', false);
    }
  },
});
