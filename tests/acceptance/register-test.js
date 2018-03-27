import { module, test } from 'qunit';
import { visit, currentURL, click, fillIn } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import FakeServer, { stubRequest } from 'ember-cli-fake-server';
import { currentSession } from 'ember-simple-auth/test-support';
import $ from 'jquery';
import ENV from '../../config/environment';

module('Acceptance | register', function(hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(function() {
    FakeServer.start();
  });

  hooks.afterEach(function() {
    FakeServer.stop();
  });

  const usersApiUrl = ENV.apiNamespace + '/users';
  const tokenApiUrl = ENV.apiNamespace + '/token';

  test('Link to register page on page navbar', async function(assert) {
    await visit('/');

    assert.dom('[data-test-page-navbar] [data-test-register-link]')
      .exists('Link to register page exists on page navbar.');
    await click('[data-test-page-navbar] [data-test-register-link]');
    assert.equal(currentURL(), '/register', 'Link to register page on page navbar redirects to register page.');
  });

  test('Form exists', async function(assert) {
    await visit('/register');

    // "pts": "parent test selector"
    const pts = '[data-test-register-form] ';

    assert.dom(pts).exists('Register form exists.');
    assert.dom(pts + '[data-test-name]').exists('Form has name field.');
    assert.dom(pts + '[data-test-email]').exists('Form has email field.');
    assert.dom(pts + '[data-test-password]').exists('Form has password field.');
    assert.dom(pts + '[data-test-repeat-password]').exists('Form has repeat password field.');
    assert.dom(pts + '[data-test-submit]').exists('Form has submit button.');
  });

  test('Validate form', async function(assert) {
    await visit('/register');

    // "pts": "parent test selector"
    const pts = '[data-test-register-form] ';

    const requiredMessage = 'This is required.';
    await click(pts + '[data-test-submit]');
    assert.dom(pts + '[data-test-name] .paper-input-error').hasText(requiredMessage, 'Validate empty name.');
    assert.dom(pts + '[data-test-email] .paper-input-error').hasText(requiredMessage, 'Validate empty email.');
    assert.dom(pts + '[data-test-password] .paper-input-error').hasText(requiredMessage, 'Validate empty password.');
    assert.dom(pts + '[data-test-repeat-password] .paper-input-error').hasText(requiredMessage, 'Validate empty repeat password.');

    await fillIn(pts + '[data-test-email] input', 'invalid-email-format');
    await click(pts + '[data-test-submit]');
    assert.dom(pts + '[data-test-email] input').isFocused('Validate email format.');
  });

  test('Submit form - Error', async function(assert) {
    await visit('/register');

    const data = {
      name: 'Test Name',
      email: 'valid@email.format',
      password: 'Password_$0123áÉíÖüñ',
    };

    // "pts": "parent test selector"
    const pts = '[data-test-register-form] ';
    const sDialog = 'md-dialog';
    const sDialogToolbar = sDialog + ' md-toolbar';
    const sDialogContent = sDialog + ' md-dialog-content';
    const sDialogCloseButton = sDialogToolbar + ' button';

    stubRequest('post', usersApiUrl, (request) => {
      request.error({"errors":[{
        "source":{"parameter":"email"},
        "title":'Email Error',
        "detail":'The email "' + data.email + '" is already used.'
      }],"jsonapi":{"version":"1.0"}});
    });

    await fillIn(pts + '[data-test-name] input', data.name);
    await fillIn(pts + '[data-test-email] input', data.email);
    await fillIn(pts + '[data-test-password] input', data.password);
    await fillIn(pts + '[data-test-repeat-password] input', data.password);
    await click(pts + '[data-test-submit]');

    assert.dom(pts).exists('Form is not hidden when there is an error.');
    assert.dom(pts + '[data-test-name] input').hasValue(data.name, 'Name field is not empty.');
    assert.dom(pts + '[data-test-email] input').hasValue(data.email, 'Email field is not empty.');
    assert.dom(pts + '[data-test-password] input').hasValue(data.password, 'Password field is not empty.');
    assert.dom(pts + '[data-test-repeat-password] input').hasValue(data.password, 'Repeat password field is not empty.');

    assert.dom(sDialog).exists('Error message dialog shown.');
    assert.dom(sDialogToolbar).includesText('Email Error', 'Error message dialog title.');
    assert.dom(sDialogContent).includesText(
      'The email "' + data.email + '" is already used.',
      'Error message message dialog.'
    );
    await click(sDialogCloseButton);

    stubRequest('post', usersApiUrl, (request) => {
      request.error({"errors":[
        {"source":{"parameter":"name"},"title":"Name Error","detail":"The name field is required."},
        {"source":{"parameter":"email"},"title":"Email Error","detail":"The email field is required."},
        {"source":{"parameter":"password"},"title":"Password Error","detail":"The password field is required."}
      ],"jsonapi":{"version":"1.0"}});
    });
    await click(pts + '[data-test-submit]');
    assert.dom(sDialog).exists('Error message dialog shown when multiple errors returned.');
    assert.dom(sDialogToolbar).includesText(
      'Name Error',
      'Show first error title when there are multiple errors.'
    );
    assert.dom(sDialogContent).includesText(
      'The name field is required.',
      'Show first error message when there are multiple errors.'
    );
    await click(sDialogCloseButton);

    stubRequest('post', usersApiUrl, (request) => {
      request.error();
    });
    await click(pts + '[data-test-submit]');
    assert.dom(sDialog).exists('Adapter error dialog shown.');
    assert.dom(sDialogToolbar).includesText('Adapter Error', 'Adapter error dialog title.');
    assert.dom(sDialogContent).includesText(
      'The adapter rejected the commit because it was invalid',
      'Adapter error dialog message.'
    );
    await click(sDialogCloseButton);

    stubRequest('post', usersApiUrl, (request) => {
      request.error({ errors });
    });
    await click(pts + '[data-test-submit]');
    assert.dom(sDialog).exists('Generic error dialog shown.');
    assert.dom(sDialogToolbar).includesText('Register Error', 'Generic error dialog title.');
    assert.dom(sDialogContent).includesText(
      'The user account cannot be registered.',
      'Generic error dialog message.'
    );
    await click(sDialogCloseButton);
  });

  test('Submit form - Success', async function(assert) {
    await visit('/register');

    const data = {
      name: 'Test Name',
      email: 'valid@email.format',
      password: 'Password_$0123áÉíÖüñ',
    };
    const accessToken = 'Example_token$';

    // "pts": "parent test selector"
    const pts = '[data-test-register-form] ';

    stubRequest('post', usersApiUrl, (request) => {
      const requestData = request.json().data;
      if (requestData.type == 'users' && requestData.attributes.name == data.name
        && requestData.attributes.email == data.email && requestData.attributes.password == data.password
      ) {
        const jsonApiResponse = { data: {
          type: 'users',
          id: 1,
          attributes: {
            name: data.name,
            email: data.email,
          },
        }};
        request.ok(jsonApiResponse);
      } else {
        request.error();
      }
    });
    stubRequest('post', tokenApiUrl, (request) => {
      const response = {
        access_token: accessToken,
        name: data.name,
        email: data.email,
      };
      request.ok(response);
    });

    await fillIn(pts + '[data-test-name] input', data.name);
    await fillIn(pts + '[data-test-email] input', data.email);
    await fillIn(pts + '[data-test-password] input', data.password);
    await fillIn(pts + '[data-test-repeat-password] input', data.password);
    await click(pts + '[data-test-submit]');
    const session = currentSession();
    assert.notOk($.isEmptyObject(session.get('data.authenticated')), 'User authenticated.');
    assert.equal(session.get('data.authenticated.access_token'), accessToken, 'Access token stored in session.');
    assert.equal(session.get('data.authenticated.name'), data.name, 'User name stored in session.');
    assert.equal(session.get('data.authenticated.email'), data.email, 'User email stored in session.');
    assert.equal(currentURL(), '/register-confirmation', 'Redirection to register confirmation page after register.');

    assert.dom('[data-test-link-to-homepage-on-register-confirmation-page]')
      .exists('There is a link to homepage on the register confirmation page.');
    await click('[data-test-link-to-homepage-on-register-confirmation-page]');
    assert.equal(currentURL(), '/', 'Redirection to homepage after clicking link to homepage on register confirmation page.');
    assert.dom('[data-test-page-navbar] [data-test-register-link]')
      .doesNotExist('Register link does not exist on page navbar.');

    await visit('/register');
    assert.equal(currentURL(), '/', 'Register page not available when user is logged in. Redirection to index.');
  });
});
