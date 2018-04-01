import { module, test } from 'qunit';
import { visit, currentURL, click, fillIn } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import FakeServer, { stubRequest } from 'ember-cli-fake-server';
import ENV from '../../config/environment';
import { authenticateSession } from 'ember-simple-auth/test-support';

module('Acceptance | settings', function(hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(function() {
    FakeServer.start();
  });

  hooks.afterEach(function() {
    FakeServer.stop();
  });

  const data = {
    name: 'Test Name',
    email: 'valid@email.format',
    password: 'Password_$0123áÉíÖüñ',
  };
  const oldJwtToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC9sb2NhbGhvc3RcL2FwaVwvZ2V0LXRva2VuIiwiaWF0IjoxNTIyNDk3NTIzLCJleHAiOjE1MjI1MDExMjMsIm5iZiI6MTUyMjQ5NzUyMywianRpIjoidmdTNGZXU3hUR2FFem5LQyIsInN1YiI6MzI5LCJwcnYiOiI0MWRmODgzNGYxYjk4ZjcwZWZhNjBhYWVkZWY0MjM0MTM3MDA2OTBjIn0.1FeDFn03i4mmT7cRIU8jy8fylOtBbmfPdATgNq5piG0';
  const authResponse = {
    access_token: oldJwtToken,
    name: data.name,
    email: data.email,
  };

  test('Settings page not available if not logged in', async function(assert) {
    await visit('/settings');

    assert.equal(currentURL(), '/login', 'Visit settings page logged out redirects to login page.');
  });

  test('User name on page navbar links to settings page after login', async function(assert) {

    await authenticateSession(authResponse);

    await visit('/');
    const pts = '[data-test-page-navbar] ';
    assert.dom(pts + '[data-test-settings-link]').exists('Link to settings page exists on page navbar.');
    assert.dom(pts + '[data-test-settings-link]')
      .hasText(data.name, 'Link to settings page on page navbar has user name.');
    await click(pts + '[data-test-settings-link]');
    assert.equal(currentURL(), '/settings', 'Link to settings page on page navbar redirects to settings page.');
  });

  test('User name shown on settings page', async function(assert) {
    await authenticateSession(authResponse);

    await visit('/settings');
    assert.equal(currentURL(), '/settings', 'Visit settings page logged in redirects to login page.');
  });
});
