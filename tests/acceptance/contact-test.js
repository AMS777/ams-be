import { module, test, skip } from 'qunit';
import { visit, currentURL, find, click, fillIn } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';

module('Acceptance | contact', function(hooks) {
  setupApplicationTest(hooks);

  test('visiting /contact', async function(assert) {
    await visit('/contact');

    assert.equal(currentURL(), '/contact');
  });

  test('Contact form exists', async function(assert) {
    await visit('/contact');

    // "pts": "parent test selector"
    const pts = '[data-test-contact-form] ';

    assert.dom(pts).exists('Contact form exists.');
    assert.dom(pts + '[data-test-name]').exists('Contact form has name field.');
    assert.dom(pts + '[data-test-email]').exists('Contact form has email field.');
    assert.dom(pts + '[data-test-message]').exists('Contact form has message field.');
    assert.dom(pts + '[data-test-submit]').exists('Contact form has submit button.');
  });

  test('Validate contact form', async function(assert) {
    await visit('/contact');

    // "pts": "parent test selector"
    const pts = '[data-test-contact-form] ';

    const requiredMessage = 'This is required.';
    await click(pts + '[data-test-submit]');
    assert.dom(pts + '[data-test-name] .paper-input-error').hasText(requiredMessage, 'Validate empty name.');
    assert.dom(pts + '[data-test-email] .paper-input-error').hasText(requiredMessage, 'Validate empty email.');
    assert.dom(pts + '[data-test-message] .paper-input-error').hasText(requiredMessage, 'Validate empty message.');

    await fillIn(pts + '[data-test-email] input', 'invalid-email-format');
    await click(pts + '[data-test-submit]');
    assert.dom(pts + '[data-test-email] input').isFocused('Validate valid email format.');
  });

  skip('Submit contact form', async function(assert) {
    await visit('/contact');

    // "ts": "test selector"
    const tsContactForm = '[data-test-contact-form] ';

    await fillIn(tsContactForm + '[data-test-name] input', 'Test Name');
    await fillIn(tsContactForm + '[data-test-email] input', 'valid@email.format');
    await fillIn(tsContactForm + '[data-test-message] textarea', 'Test message.');
    await click(tsContactForm + '[data-test-submit]');
  });
});
