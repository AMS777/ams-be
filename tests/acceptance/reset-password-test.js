import { module, test } from 'qunit';
import { visit, currentURL, click, fillIn } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import ENV from '../../config/environment';
import FakeServer, { stubRequest } from 'ember-cli-fake-server';

module('Acceptance | reset password', function(hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(function() {
    FakeServer.start();
  });

  hooks.afterEach(function() {
    FakeServer.stop();
  });

  const requestResetPasswordApiUrl = ENV.apiNamespace + '/request-reset-password';
  const resetPasswordApiUrl = ENV.apiNamespace + '/reset-password';
  const data = {
    email: 'valid@email.format',
    password: 'Password_$0123áÉíÖüñ',
  };
  const resetPasswordToken = 'hY5zg8567VQyXg3FNd5AgjXomiT2Di0PQ8kfLDZ91Vvsg35EVDg8RfaL9hub7DPGv2DrfvcIG9fYimbSWmSwMIMGfVFP9xRcqo8b';

  test('Request reset password option exists on login page', async function(assert) {
    await visit('/login');

    // "pts": "parent test selector"
    const pts = 'md-dialog '; // 'paper-dialog' element does not accept attributes ('[data-test...]')
    assert.dom('[data-test-request-reset-password-button]').exists('Button exists.');
    await click('[data-test-request-reset-password-button]');
    assert.dom(pts).exists('Request reset password dialog opens.');
    assert.dom(pts + ' md-toolbar').includesText('Request Reset Password', 'Dialog title.');
    assert.dom(pts + '[data-test-request-reset-password-email] input').exists('Email field exists on dialog.');
    assert.dom(pts + '[data-test-request-reset-password-dialog-cancel-button]').exists('Cancel button exists on dialog.');
    assert.dom(pts + '[data-test-request-reset-password-dialog-ok-button]').exists('Ok button exists on dialog.');
    await click(pts + '[data-test-request-reset-password-dialog-cancel-button]');
    assert.dom(pts).doesNotExist('Request reset password dialog closes.');
  });

  test('Validate request form', async function(assert) {
    await visit('/login');
    await click('[data-test-request-reset-password-button]');

    // "pts": "parent test selector"
    const pts = 'md-dialog '; // 'paper-dialog' element does not accept attributes ('[data-test...]')

    await click(pts + '[data-test-request-reset-password-dialog-ok-button]');
    assert.dom(pts + '[data-test-request-reset-password-email] .paper-input-error').hasText('Email is required.', 'Validate empty email.');

    await fillIn(pts + '[data-test-request-reset-password-email] input', 'invalid-email-format');
    assert.dom(pts + '[data-test-request-reset-password-email] .paper-input-error').hasText('Invalid email.', 'Validate email format.');
    await click(pts + '[data-test-request-reset-password-dialog-ok-button]');
  });

  test('Submit request form - Error', async function(assert) {
    await visit('/login');
    await click('[data-test-request-reset-password-button]');

    // "pts": "parent test selector"
    const pts = 'md-dialog '; // 'paper-dialog' element does not accept attributes ('[data-test...]')

    stubRequest('post', requestResetPasswordApiUrl, (request) => {
      request.error({"errors":[{
        "source":{"parameter":"email"},
        "title":'Email Error',
        "detail":'The email "' + data.email + '" does not exist.'
      }],"jsonapi": {"version":"1.0"}});
    });
    await fillIn(pts + '[data-test-request-reset-password-email] input', data.email);
    await click(pts + '[data-test-request-reset-password-dialog-ok-button]');
    assert.equal(currentURL(), '/login', 'Stay on login page.');
    assert.dom(pts).exists('Error message dialog shown.');
    assert.dom(pts + ' md-toolbar').includesText('Email Error', 'Error message dialog title.');
    assert.dom(pts + ' md-dialog-content').includesText(
      'The email "' + data.email + '" does not exist.',
      'Error message dialog content.'
    );
    await click(pts + ' md-toolbar button');
  });

  test('Submit request form - Success', async function(assert) {
    await visit('/login');
    await click('[data-test-request-reset-password-button]');

    // "pts": "parent test selector"
    const pts = 'md-dialog '; // 'paper-dialog' element does not accept attributes ('[data-test...]')

    stubRequest('post', requestResetPasswordApiUrl, (request) => {
      const requestData = request.json().data;
      if (requestData.type == 'users' && requestData.attributes.email == data.email) {
        request.noContent();
      } else {
        request.error();
      }
    });
    await fillIn(pts + '[data-test-request-reset-password-email] input', data.email);
    await click(pts + '[data-test-request-reset-password-dialog-ok-button]');
    assert.equal(currentURL(), '/request-reset-password-confirmation',
      'Redirection to request reset password confirmation page.');
    assert.dom('[data-test-request-reset-password-confirmation-message]')
      .exists('There is a confirmation message on the request reset password confirmation page.');
    assert.dom('[data-test-link-to-homepage-on-request-reset-password-confirmation-page]')
      .exists('There is a link to homepage on the request reset password confirmation page.');
    await click('[data-test-link-to-homepage-on-request-reset-password-confirmation-page]');
    assert.equal(currentURL(), '/',
      'Redirection to homepage after clicking link to homepage on request reset password confirmation page.');
  });

  test('Visit reset password page - Success', async function(assert) {
    await visit('/reset-password/' + resetPasswordToken);

    assert.equal(currentURL(), '/reset-password/' + resetPasswordToken);
  });

  test('Reset password form exists on reset password page', async function(assert) {
    await visit('/reset-password/' + resetPasswordToken);

    // "pts": "parent test selector"
    const pts = '[data-test-reset-password-form] ';

    assert.dom(pts).exists('Reset password form exists.');
    assert.dom(pts + '[data-test-password]').exists('Form has password field.');
    assert.dom(pts + '[data-test-repeat-password]').exists('Form has repeat password field.');
    assert.dom(pts + '[data-test-submit]').exists('Form has submit button.');
    assert.dom(pts + '[data-test-submit]').hasText('Reset password', 'Submit button caption.');
  });

  test('Validate reset form', async function(assert) {
    await visit('/reset-password/' + resetPasswordToken);

    // "pts": "parent test selector"
    const pts = '[data-test-reset-password-form] ';

    await click(pts + '[data-test-submit]');
    assert.dom(pts + '[data-test-password] .paper-input-error').hasText('Password is required.', 'Validate empty password.');

    await fillIn(pts + '[data-test-password] input', data.password);
    await fillIn(pts + '[data-test-repeat-password] input', 'Different-Password');
    assert.dom(pts + '[data-test-repeat-password] .paper-input-error')
      .hasText('Passwords do not match.', 'Validate repeat password equal to password.');
  });

  test('Submit reset form - Error', async function(assert) {
    await visit('/reset-password/' + resetPasswordToken);

    // "pts": "parent test selector"
    const pts = '[data-test-reset-password-form] ';
    const sDialog = 'md-dialog';
    const sDialogToolbar = sDialog + ' md-toolbar';
    const sDialogContent = sDialog + ' md-dialog-content';
    const sDialogCloseButton = sDialogToolbar + ' button';

    stubRequest('post', resetPasswordApiUrl, (request) => {
      request.error({"errors":[{
        "source": {"parameter":"token"},
        "title": 'Reset Password Token Error',
        "detail": 'The reset password token is invalid.'
      }],"jsonapi": {"version":"1.0"}});
    });
    await fillIn(pts + '[data-test-password] input', data.password);
    await fillIn(pts + '[data-test-repeat-password] input', data.password);
    await click(pts + '[data-test-submit]');
    assert.dom(sDialog).exists('Error message dialog shown.');
    assert.dom(sDialogToolbar).includesText('Reset Password Token Error', 'Error message dialog title.');
    assert.dom(sDialogContent).includesText(
      'The reset password token is invalid.',
      'Error message dialog content.'
    );
    await click(sDialogCloseButton);

    stubRequest('post', resetPasswordApiUrl, (request) => {
      request.error({"errors":[
        {"source":{"parameter":"password"},"title":"Password Error","detail":"The password field is required."},
        {"source":{"parameter":"name"},"title":"Token Error","detail":"The reset password token is not valid."}
      ],"jsonapi":{"version":"1.0"}});
    });
    await click(pts + '[data-test-submit]');
    assert.dom(sDialog).exists('Error message dialog shown when multiple errors returned.');
    assert.dom(sDialogToolbar).includesText(
      'Password Error',
      'Show first error title when there are multiple errors.'
    );
    assert.dom(sDialogContent).includesText(
      'The password field is required.',
      'Show first error message when there are multiple errors.'
    );
    await click(sDialogCloseButton);

    stubRequest('post', resetPasswordApiUrl, (request) => {
      request.error({ errors: {} });
    });
    await click(pts + '[data-test-submit]');
    assert.dom(sDialog).exists('Generic error dialog shown.');
    assert.dom(sDialogToolbar).includesText('Reset Password Error', 'Generic error dialog title.');
    assert.dom(sDialogContent).includesText(
      'The password cannot be reset.',
      'Generic error dialog message.'
    );
    await click(sDialogCloseButton);
  });

  test('Submit reset form - Success', async function(assert) {
    await visit('/reset-password/' + resetPasswordToken);

    // "pts": "parent test selector"
    const pts = '[data-test-reset-password-form] ';

    stubRequest('post', resetPasswordApiUrl, (request) => {
      const requestData = request.json().data;
      if (requestData.attributes.reset_password_token == resetPasswordToken
        && requestData.attributes.password == data.password
      ) {
        request.noContent();
      } else {
        request.error();
      }
    });
    await fillIn(pts + '[data-test-password] input', data.password);
    await fillIn(pts + '[data-test-repeat-password] input', data.password);
    await click(pts + '[data-test-submit]');
    assert.equal(currentURL(), '/reset-password-confirmation',
      'Redirection to reset password confirmation page.');
    assert.dom('[data-test-reset-password-confirmation-message]')
      .exists('There is a confirmation message on the reset password confirmation page.');
    assert.dom('[data-test-link-to-homepage-on-reset-password-confirmation-page]')
      .exists('There is a link to homepage on the reset password confirmation page.');
    assert.dom('[data-test-link-to-login-on-reset-password-confirmation-page]')
      .exists('There is a link to login on the reset password confirmation page.');
    await click('[data-test-link-to-homepage-on-reset-password-confirmation-page]');
    assert.equal(currentURL(), '/',
      'Redirection to homepage after clicking link to homepage on reset password confirmation page.');
  });
});
