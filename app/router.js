import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('contact');
  this.route('faq');
  this.route('privacy');
  this.route('terms');
  this.route('register');
  this.route('login');
});

export default Router;
