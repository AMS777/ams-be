import { module, test } from 'qunit';
import { visit, currentURL, click, fillIn } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import FakeServer, { stubRequest } from 'ember-cli-fake-server';
import { currentSession } from 'ember-simple-auth/test-support';
import Ember from 'ember';

module('Acceptance | register', function(hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(function() {
    FakeServer.start();
  });

  hooks.afterEach(function() {
    FakeServer.stop();
  });

  test('visiting /register', async function(assert) {
    await visit('/register');

    assert.equal(currentURL(), '/register');
  });

  test('Link to register page exists on page navbar.', async function(assert) {
    await visit('/');

    assert.dom('[data-test-page-navbar] [data-test-register-link]').exists('Register link exists on page navbar.');
  });

  test('Register form exists on register page.', async function(assert) {
    await visit('/register');

    // "pts": "parent test selector"
    const pts = '[data-test-register-form] ';

    assert.dom(pts).exists('Register form exists.');
    assert.dom(pts + '[data-test-name]').exists('Register form has name field.');
    assert.dom(pts + '[data-test-email]').exists('Register form has email field.');
    assert.dom(pts + '[data-test-password]').exists('Register form has password field.');
    assert.dom(pts + '[data-test-repeat-password]').exists('Register form has repeat password field.');
    assert.dom(pts + '[data-test-submit]').exists('Register form has submit button.');
  });

  test('Submit register form - Success', async function(assert) {
    await visit('/register');

    const data = {
      name: 'Test Name',
      email: 'valid@email.format',
      password: 'Password_$0123áÉíÖüñ',
    };
    const accessToken = 'ABCD';

    // "pts": "parent test selector"
    const pts = '[data-test-register-form] ';

    stubRequest('post', '/api/users', (request) => {
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
    assert.notOk(Ember.$.isEmptyObject(session.get('data.authenticated')), 'User authenticated.');
    assert.equal(session.get('data.authenticated.access_token'), accessToken, 'Access token stored in session.');
    assert.equal(session.get('data.authenticated.name'), data.name, 'User name stored in session.');
    assert.equal(session.get('data.authenticated.email'), data.email, 'User email stored in session.');
    assert.equal(currentURL(), '/register-confirmation');

    assert.dom('[data-test-homepage-link-on-register-confirmation-page]')
      .exists('There is a link to the homepage on the register confirmation page.');
    await click('[data-test-homepage-link-on-register-confirmation-page]');
    assert.equal(currentURL(), '/');

    await visit('/register');
    assert.equal(currentURL(), '/', 'Register page not available when user is logged in. Redirection to index.');
  });
});
