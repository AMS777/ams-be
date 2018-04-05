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
  this.route('register-confirmation');
  this.route('contact-confirmation');
  this.route('settings');
  this.route('request-reset-password-confirmation');
  this.route('reset-password', { path: '/reset-password/:reset_password_token' });
  this.route('reset-password-confirmation');
  this.route('verify-email', { path: '/verify-email/:verify_email_token' });
  this.route('delete-account-confirmation');
});

export default Router;
