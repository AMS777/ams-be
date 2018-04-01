import { module, test } from 'qunit';
import { visit, currentURL, click, fillIn } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import FakeServer, { stubRequest } from 'ember-cli-fake-server';
import ENV from '../../config/environment';
import { authenticateSession } from 'ember-simple-auth/test-support';

module('Acceptance | settings', function(hooks) {
  setupApplicationTest(hooks);

  const usersApiUrl = ENV.apiNamespace + '/users';
  const data = {
    name: 'Test Name',
    email: 'valid@email.format',
    password: 'Password_$0123áÉíÖüñ',
  };
  const oldJwtToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC9sb2NhbGhvc3RcL2FwaVwvZ2V0LXRva2VuIiwiaWF0IjoxNTIyNDk3NTIzLCJleHAiOjE1MjI1MDExMjMsIm5iZiI6MTUyMjQ5NzUyMywianRpIjoidmdTNGZXU3hUR2FFem5LQyIsInN1YiI6MzI5LCJwcnYiOiI0MWRmODgzNGYxYjk4ZjcwZWZhNjBhYWVkZWY0MjM0MTM3MDA2OTBjIn0.1FeDFn03i4mmT7cRIU8jy8fylOtBbmfPdATgNq5piG0';
  const auth2Response = {
    access_token: oldJwtToken,
    userId: 1,
    userName: data.name,
  };

  hooks.beforeEach(function() {
    FakeServer.start();

    stubRequest('get', usersApiUrl + '/' + auth2Response.userId, (request) => {
      const jsonApiResponse = { data: {
        type: 'users',
        id: 1,
        attributes: {
          name: data.name,
          email: data.email,
        },
      }};
      request.ok(jsonApiResponse);
    });
  });

  hooks.afterEach(function() {
    FakeServer.stop();
  });

  test('Settings page not available if not logged in', async function(assert) {
    await visit('/settings');

    assert.equal(currentURL(), '/login', 'Visit settings page logged out redirects to login page.');
  });

  test('User name on page navbar links to settings page after login', async function(assert) {
    await authenticateSession(auth2Response);
    await visit('/');

    const pts = '[data-test-page-navbar] ';
    assert.dom(pts + '[data-test-settings-link]').exists('Link to settings page exists on page navbar.');
    assert.dom(pts + '[data-test-settings-link]')
      .hasText(data.name, 'Link to settings page on page navbar has user name.');
    await click(pts + '[data-test-settings-link]');
    assert.equal(currentURL(), '/settings', 'Link to settings page on page navbar redirects to settings page.');
  });

  test('User account form exists on settings page', async function(assert) {
    await authenticateSession(auth2Response);
    await visit('/settings');

    // "pts": "parent test selector"
    const pts = '[data-test-user-account-form] ';

    assert.dom(pts).exists('User account form exists.');
    assert.dom(pts + '[data-test-name]').exists('Form has name field.');
    assert.dom(pts + '[data-test-email]').exists('Form has email field.');
    assert.dom(pts + '[data-test-password]').exists('Form has password field.');
    assert.dom(pts + '[data-test-repeat-password]').exists('Form has repeat password field.');
    assert.dom(pts + '[data-test-submit]').exists('Form has submit button.');
    assert.dom(pts + '[data-test-submit]').hasText('Update', 'Submit button caption.');
  });

  test('User account form has user data loaded', async function(assert) {
    await authenticateSession(auth2Response);
    await visit('/settings');

    // "pts": "parent test selector"
    const pts = '[data-test-user-account-form] ';

    assert.dom(pts + '[data-test-name] input').hasValue(data.name, 'Name field has user name.');
    assert.dom(pts + '[data-test-email] input').hasValue(data.email, 'Email field has user email.');
    assert.dom(pts + '[data-test-password] input').hasNoValue('Password field is empty.');
    assert.dom(pts + '[data-test-repeat-password] input').hasNoValue('Repeat password field is empty.');
  });
});
