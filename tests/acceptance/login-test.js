import { module, test } from 'qunit';
import { visit, currentURL, click, fillIn } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import FakeServer, { stubRequest } from 'ember-cli-fake-server';
import { currentSession } from 'ember-simple-auth/test-support';
import $ from 'jquery';

module('Acceptance | login', function(hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(function() {
    FakeServer.start();
  });

  hooks.afterEach(function() {
    FakeServer.stop();
  });

  test('Link to login page exists on page navbar.', async function(assert) {
    await visit('/');

    assert.dom('[data-test-page-navbar] [data-test-login-link]').exists('Login link exists on page navbar.');
  });

  test('Login form exists on login page.', async function(assert) {
    await visit('/login');

    // "pts": "parent test selector"
    const pts = '[data-test-login-form] ';

    assert.dom(pts).exists('Login form exists.');
    assert.dom(pts + '[data-test-email]').exists('Login form has email field.');
    assert.dom(pts + '[data-test-password]').exists('Login form has password field.');
    assert.dom(pts + '[data-test-submit-login]').exists('Login form has submit button.');
  });

  test('User login - successful.', async function(assert) {
    await visit('/');
    await click('[data-test-page-navbar] [data-test-login-link]');
    assert.equal(currentURL(), '/login', 'Page navbar login link works. Only available when user is not logged in.');

    const data = {
      name: 'Test Name',
      email: 'valid@email.format',
      password: 'Password_$0123áÉíÖüñ',
    };
    const accessToken = 'Example_token$';

    // "pts": "parent test selector"
    const pts = '[data-test-login-form] ';

    stubRequest('get', '/api/users', (request) => {
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
    stubRequest('post', '/api/token', (request) => {
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
    await click(pts + '[data-test-submit-login]');
    const session = currentSession();
    assert.notOk($.isEmptyObject(session.get('data.authenticated')), 'User authenticated.');
    assert.equal(session.get('data.authenticated.access_token'), accessToken, 'Access token stored in session.');
    assert.equal(session.get('data.authenticated.name'), data.name, 'User name stored in session.');
    assert.equal(session.get('data.authenticated.email'), data.email, 'User email stored in session.');
    assert.equal(currentURL(), '/', 'Index page after login.');
  });
});
