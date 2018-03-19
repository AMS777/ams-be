import Component from '@ember/component';
import { equal } from '@ember/object/computed';

export default Component.extend({
  titleIcon: '',
  displayErrorIcon: equal('titleIcon', 'error'),
  displaySuccessIcon: equal('titleIcon', 'success'),
  displayQuestionIcon: equal('titleIcon', 'question'),
  displayInfoIcon: equal('titleIcon', 'info'),
});
