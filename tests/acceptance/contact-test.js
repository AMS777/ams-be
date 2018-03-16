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
    assert.expect(5);

    await visit('/contact');

    // "ts": "test selector"
    const tsContactForm = '[data-test-contact-form] ';
    assert.ok(find(tsContactForm), 'Contact form exists.');
    assert.ok(find(tsContactForm + '[data-test-name]'), 'Contact form has name field.');
    assert.ok(find(tsContactForm + '[data-test-email]'), 'Contact form has email field.');
    assert.ok(find(tsContactForm + '[data-test-message]'), 'Contact form has message field.');
    assert.ok(find(tsContactForm + '[data-test-submit]'), 'Contact form has submit button.');
  });

  test('Validate contact form', async function(assert) {
    await visit('/contact');

    // "ts": "test selector"
    const tsContactForm = '[data-test-contact-form] ';

    const requiredMessage = 'This is required.';
    await click(tsContactForm + '[data-test-submit]');
    assert.equal(find(tsContactForm + '[data-test-name] .paper-input-error').textContent.trim(),
      requiredMessage, 'Validate empty name.');
    assert.equal(find(tsContactForm + '[data-test-email] .paper-input-error').textContent.trim(),
      requiredMessage, 'Validate empty email.');
    assert.equal(find(tsContactForm + '[data-test-message] .paper-input-error').textContent.trim(),
      requiredMessage, 'Validate empty message.');

    await fillIn(tsContactForm + '[data-test-email] input', 'invalid-email-format');
    await click(tsContactForm + '[data-test-submit]');
    assert.ok(find(tsContactForm + '[data-test-email].md-focused'), 'Validate valid email format.');
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
