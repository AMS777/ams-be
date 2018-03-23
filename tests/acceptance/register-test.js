import { module, test } from 'qunit';
import { visit, currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';

module('Acceptance | register', function(hooks) {
  setupApplicationTest(hooks);

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
});
