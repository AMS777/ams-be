import { module, test } from 'qunit';
import { visit, currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';

module('Acceptance | login', function(hooks) {
  setupApplicationTest(hooks);

  test('visiting /login', async function(assert) {
    await visit('/login');

    assert.equal(currentURL(), '/login');
  });

  test('Link to login page exists on page navbar.', async function(assert) {
    await visit('/');

    assert.dom('[data-test-page-navbar] [data-test-login-link]').exists('Login link exists on page navbar.');
  });

  test('Login form exists on register page.', async function(assert) {
    await visit('/login');

    // "pts": "parent test selector"
    const pts = '[data-test-login-form] ';

    assert.dom(pts).exists('Login form exists.');
    assert.dom(pts + '[data-test-email]').exists('Login form has email field.');
    assert.dom(pts + '[data-test-password]').exists('Login form has password field.');
    assert.dom(pts + '[data-test-submit]').exists('Login form has submit button.');
  });
});
