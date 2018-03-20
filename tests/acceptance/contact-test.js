import { module, test } from 'qunit';
import { visit, currentURL, click, fillIn } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import FakeServer, { stubRequest } from 'ember-cli-fake-server';

module('Acceptance | contact', function(hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(function() {
    FakeServer.start();
  });

  hooks.afterEach(function() {
    FakeServer.stop();
  });

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
    assert.dom(pts + '[data-test-email] input').isFocused('Validate email format.');
  });

  test('Submit contact form - Success', async function(assert) {
    await visit('/contact');

    // "pts": "parent test selector"
    const pts = '[data-test-contact-form] ';

    await fillIn(pts + '[data-test-name] input', 'Test Name');
    await fillIn(pts + '[data-test-email] input', 'valid@email.format');
    await fillIn(pts + '[data-test-message] textarea', 'Test message.');

    stubRequest('post', '/contact-message', (request) => {
      request.ok({user: {id: 1, name: 'the user'}});
    });

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

  test('Submit contact form - Error', async function(assert) {
    await visit('/contact');

    // "pts": "parent test selector"
    const pts = '[data-test-contact-form] ';
    const sDialog = 'md-dialog';
    const sDialogToolbar = sDialog + ' md-toolbar';
    const sDialogContent = sDialog + ' md-dialog-content';
    const sDialogCloseButton = sDialogToolbar + ' button';

    stubRequest('post', '/contact-message', (request) => {
      request.error({ errors: [{ 'code': 'empty_data' }]});
    });

    await fillIn(pts + '[data-test-name] input', 'Test Name');
    await fillIn(pts + '[data-test-email] input', 'valid@email.format');
    await fillIn(pts + '[data-test-message] textarea', 'Test message.');
    await click(pts + '[data-test-submit]');

    assert.dom(pts).exists('Contact form is not hidden.');
    assert.dom(pts + '[data-test-name] input').hasValue('Test Name', 'Name field is not empty.');
    assert.dom(pts + '[data-test-email] input').hasValue('valid@email.format', 'Email field is not empty.');
    assert.dom(pts + '[data-test-message] textarea').hasValue('Test message.', 'Message field is not empty.');

    assert.dom(sDialog).exists('Data empty dialog shown.');
    assert.dom(sDialogToolbar).includesText('Data empty', 'Data empty dialog title.');
    assert.dom(sDialogContent).includesText('Some data are empty.', 'Data empty message dialog.');
    await click(sDialogCloseButton);

    stubRequest('post', '/contact-message', (request) => {
      request.error({ errors: [{ 'code': 'invalid_email_address' }]});
    });
    await click(pts + '[data-test-submit]');
    assert.dom(sDialog).exists('Invalid email dialog shown.');
    assert.dom(sDialogToolbar).includesText('Invalid email address', 'Invalid email dialog title.');
    await click(sDialogCloseButton);

    stubRequest('post', '/contact-message', (request) => {
      request.error({ errors: [{ 'code': 'sendmail_process_error' }]});
    });
    await click(pts + '[data-test-submit]');
    assert.dom(sDialog).exists('Sendmail process error dialog shown.');
    assert.dom(sDialogToolbar).includesText('Sendmail process error', 'Sendmail process error dialog title.');
    await click(sDialogCloseButton);

    stubRequest('post', '/contact-message', (request) => {
      request.error({ errors: [{ 'code': 'error_sending_email' }]});
    });
    await click(pts + '[data-test-submit]');
    assert.dom(sDialog).exists('Error sending email dialog shown.');
    assert.dom(sDialogToolbar).includesText('Email send error', 'Error sending email dialog title.');
    await click(sDialogCloseButton);

    stubRequest('post', '/contact-message', (request) => {
      request.error();
    });
    await click(pts + '[data-test-submit]');
    assert.dom(sDialog).exists('Generic error dialog shown.');
    assert.dom(sDialogToolbar).includesText('Contact message error', 'Generic error dialog title.');
    await click(sDialogCloseButton);
  });
});
