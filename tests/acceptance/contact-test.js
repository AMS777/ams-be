import { module, test } from 'qunit';
import { visit, currentURL, click, fillIn } from '@ember/test-helpers';
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

  test('Submit contact form', async function(assert) {
    await visit('/contact');

    // "pts": "parent test selector"
    const pts = '[data-test-contact-form] ';

    await fillIn(pts + '[data-test-name] input', 'Test Name');
    await fillIn(pts + '[data-test-email] input', 'valid@email.format');
    await fillIn(pts + '[data-test-message] textarea', 'Test message.');
    await click(pts + '[data-test-submit]');
    assert.dom(pts).doesNotExist('Contact form removed.');
    assert.dom('[data-test-confirmation-message]').includesText('success', 'Show confirmation message.');

    await visit('/');
    await visit('/contact');
    assert.dom(pts).exists('Contact form shows up when the page is entered again.');
    assert.dom(pts + '[data-test-name] input').hasNoValue('Name field is empty.');
    assert.dom(pts + '[data-test-email] input').hasNoValue('Email field is empty.');
    assert.dom(pts + '[data-test-message] textarea').hasNoValue('Message field is empty.');
  });
});
