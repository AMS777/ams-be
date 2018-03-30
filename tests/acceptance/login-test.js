import { module, test } from 'qunit';
import { visit, currentURL, click, fillIn } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import FakeServer, { stubRequest } from 'ember-cli-fake-server';
import { currentSession } from 'ember-simple-auth/test-support';
import $ from 'jquery';
import ENV from '../../config/environment';

module('Acceptance | login', function(hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(function() {
    FakeServer.start();
  });

  hooks.afterEach(function() {
    FakeServer.stop();
  });

  const usersApiUrl = ENV.apiNamespace + '/users';
  const tokenApiUrl = ENV.apiNamespace + '/get-token';

  test('Link to login page on page navbar', async function(assert) {
    await visit('/');

    assert.dom('[data-test-page-navbar] [data-test-login-link]')
      .exists('Link to login page exists on page navbar.');
    await click('[data-test-page-navbar] [data-test-register-link]');
    assert.equal(currentURL(), '/register', 'Link to login page on page navbar redirects to login page.');
  });

  test('Form exists', async function(assert) {
    await visit('/login');

    // "pts": "parent test selector"
    const pts = '[data-test-login-form] ';

    assert.dom(pts).exists('Login form exists.');
    assert.dom(pts + '[data-test-email]').exists('Form has email field.');
    assert.dom(pts + '[data-test-password]').exists('Form has password field.');
    assert.dom(pts + '[data-test-submit]').exists('Form has submit button.');
  });

  test('Validate form', async function(assert) {
    await visit('/login');

    // "pts": "parent test selector"
    const pts = '[data-test-login-form] ';

    await click(pts + '[data-test-submit]');
    assert.dom(pts + '[data-test-email] .paper-input-error').hasText('Email is required.', 'Validate empty email.');
    assert.dom(pts + '[data-test-password] .paper-input-error').hasText('Password is required.', 'Validate empty password.');

    await fillIn(pts + '[data-test-email] input', 'invalid-email-format');
    assert.dom(pts + '[data-test-email] .paper-input-error').hasText('Invalid email.', 'Validate email format.');
    await click(pts + '[data-test-submit]');
    assert.dom(pts + '[data-test-email] input').isFocused('Validate email format.');
  });

  test('Submit form - Error', async function(assert) {
    await visit('/login');

    const data = {
      name: 'Test Name',
      email: 'valid@email.format',
      password: 'Password_$0123áÉíÖüñ',
    };

    // "pts": "parent test selector"
    const pts = '[data-test-login-form] ';
    const sDialog = 'md-dialog';
    const sDialogToolbar = sDialog + ' md-toolbar';
    const sDialogContent = sDialog + ' md-dialog-content';
    const sDialogCloseButton = sDialogToolbar + ' button';

    stubRequest('post', tokenApiUrl, (request) => {
      request.error({
        "error": "invalid_client",
        "error_title":'Email Error',
        "error_description":'The email "' + data.email + '" does not exist.'
      });
    });
    await fillIn(pts + '[data-test-email] input', data.email);
    await fillIn(pts + '[data-test-password] input', data.password);
    await click(pts + '[data-test-submit]');
    assert.dom(pts).exists('Form is not hidden when there is an error.');
    assert.dom(pts + '[data-test-email] input').hasValue(data.email, 'Email field is not empty.');
    assert.dom(pts + '[data-test-password] input').hasValue(data.password, 'Password field is not empty.');
    assert.dom(sDialog).exists('Error message dialog shown.');
    assert.dom(sDialogToolbar).includesText('Email Error', 'Error message dialog title.');
    assert.dom(sDialogContent).includesText(
      'The email "' + data.email + '" does not exist.',
      'Error message message dialog.'
    );
    await click(sDialogCloseButton);

    stubRequest('post', tokenApiUrl, (request) => {
      request.error({
        "error": "invalid_grant",
      });
    });
    await click(pts + '[data-test-submit]');
    assert.dom(sDialog).exists('Generic error dialog shown.');
    assert.dom(sDialogToolbar).includesText('Login Error', 'Generic error dialog title.');
    assert.dom(sDialogContent).includesText(
      'The user account cannot be logged in.',
      'Generic error dialog message.'
    );
    await click(sDialogCloseButton);
  });

  test('Submit form - Successful', async function(assert) {
    await visit('/login');

    const data = {
      name: 'Test Name',
      email: 'valid@email.format',
      password: 'Password_$0123áÉíÖüñ',
    };
    const accessToken = 'Example_token$';

    // "pts": "parent test selector"
    let pts = '[data-test-login-form] ';

    stubRequest('post', tokenApiUrl, (request) => {
      const requestData = request.json();
      if (requestData.username == data.email && requestData.password == data.password) {
        const response = {
          access_token: accessToken,
          name: data.name,
          email: data.email,
        };
        request.ok(response);
      } else {
        request.error();
      }
    });
    await fillIn(pts + '[data-test-email] input', data.email);
    await fillIn(pts + '[data-test-password] input', data.password);
    await click(pts + '[data-test-submit]');
    const session = currentSession();
    assert.notOk($.isEmptyObject(session.get('data.authenticated')), 'User authenticated.');
    assert.equal(session.get('data.authenticated.access_token'), accessToken, 'Access token stored in session.');
    assert.equal(session.get('data.authenticated.name'), data.name, 'User name stored in session.');
    assert.equal(session.get('data.authenticated.email'), data.email, 'User email stored in session.');
    assert.equal(currentURL(), '/', 'Index page after login.');

    pts = '[data-test-page-navbar] ';
    assert.dom(pts + '[data-test-login-link]').doesNotExist('Login link does not exist on page navbar.');
    assert.dom(pts + '[data-test-logout-link]').exists('Logout button exists on page navbar.');

    await click(pts + '[data-test-logout-link]');
    assert.equal(currentURL(), '/', 'Index page after logout.');
    assert.dom(pts + '[data-test-login-link]').exists('After logout: Login link exists on page navbar.');
    assert.dom(pts + '[data-test-logout-link]').doesNotExist('After logout: Logout button does not exist on page navbar.');
  });
});
