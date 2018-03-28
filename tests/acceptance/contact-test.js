import { module, test } from 'qunit';
import { visit, currentURL, click, fillIn } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import FakeServer, { stubRequest } from 'ember-cli-fake-server';
import ENV from '../../config/environment';

module('Acceptance | contact', function(hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(function() {
    FakeServer.start();
  });

  hooks.afterEach(function() {
    FakeServer.stop();
  });

  const contactMessageApiUrl = ENV.apiNamespace + '/contact-message';

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

    await click(pts + '[data-test-submit]');
    assert.dom(pts + '[data-test-name] .paper-input-error').hasText('Name is required.', 'Validate empty name.');
    assert.dom(pts + '[data-test-email] .paper-input-error').hasText('Email is required.', 'Validate empty email.');
    assert.dom(pts + '[data-test-message] .paper-input-error').hasText('Message is required.', 'Validate empty message.');

    await fillIn(pts + '[data-test-email] input', 'invalid-email-format');
    assert.dom(pts + '[data-test-email] .paper-input-error').hasText('Invalid email.', 'Validate email format.');
    await click(pts + '[data-test-submit]');
    assert.dom(pts + '[data-test-email] input').isFocused('Validate email format.');
  });

  test('Submit contact form - Error', async function(assert) {
    await visit('/contact');

    const data = {
      name: 'Test Name',
      email: 'valid@email.format',
      message: 'Test message.',
    };

    // "pts": "parent test selector"
    const pts = '[data-test-contact-form] ';
    const sDialog = 'md-dialog';
    const sDialogToolbar = sDialog + ' md-toolbar';
    const sDialogContent = sDialog + ' md-dialog-content';
    const sDialogCloseButton = sDialogToolbar + ' button';

    stubRequest('post', contactMessageApiUrl, (request) => {
      request.error({"errors":[{
        "source":{"parameter":"email"},
        "title":"Email Error",
        "detail":"Address in mailbox given [invalid-email] does not comply with RFC 2822, 3.6.2."
      }],"jsonapi":{"version":"1.0"}});
    });

    await fillIn(pts + '[data-test-name] input', data.name);
    await fillIn(pts + '[data-test-email] input', data.email);
    await fillIn(pts + '[data-test-message] textarea', data.message);
    await click(pts + '[data-test-submit]');

    assert.dom(pts).exists('Contact form is not hidden when there is an error.');
    assert.dom(pts + '[data-test-name] input').hasValue(data.name, 'Name field is not empty.');
    assert.dom(pts + '[data-test-email] input').hasValue(data.email, 'Email field is not empty.');
    assert.dom(pts + '[data-test-message] textarea').hasValue(data.message, 'Message field is not empty.');

    assert.dom(sDialog).exists('Error message dialog shown.');
    assert.dom(sDialogToolbar).includesText('Email Error', 'Error message dialog title.');
    assert.dom(sDialogContent).includesText(
      'Address in mailbox given [invalid-email] does not comply with RFC 2822, 3.6.2.',
      'Error message message dialog.'
    );
    await click(sDialogCloseButton);

    stubRequest('post', contactMessageApiUrl, (request) => {
      request.error({"errors":[
        {"source":{"parameter":"name"},"title":"Name Error","detail":"The name field is required."},
        {"source":{"parameter":"email"},"title":"Email Error","detail":"The email field is required."},
        {"source":{"parameter":"password"},"title":"Message Error","detail":"The message field is required."}
      ],"jsonapi":{"version":"1.0"}});
    });
    await click(pts + '[data-test-submit]');
    assert.dom(sDialog).exists('Error message dialog shown when multiple errors returned.');
    assert.dom(sDialogToolbar).includesText(
      'Name Error',
      'Show first error title when there are multiple errors.'
    );
    assert.dom(sDialogContent).includesText(
      'The name field is required.',
      'Show first error message when there are multiple errors.'
    );
    await click(sDialogCloseButton);

    stubRequest('post', contactMessageApiUrl, (request) => {
      request.error();
    });
    await click(pts + '[data-test-submit]');
    assert.dom(sDialog).exists('Generic error dialog shown.');
    assert.dom(sDialogToolbar).includesText('Contact Message Error', 'Generic error dialog title.');
    assert.dom(sDialogContent).includesText(
      'The contact message cannot be sent.',
      'Generic error dialog message.'
    );
    await click(sDialogCloseButton);
  });

  test('Submit contact form - Success', async function(assert) {
    await visit('/contact');

    // "pts": "parent test selector"
    const pts = '[data-test-contact-form] ';

    await fillIn(pts + '[data-test-name] input', 'Test Name');
    await fillIn(pts + '[data-test-email] input', 'valid@email.format');
    await fillIn(pts + '[data-test-message] textarea', 'Test message.');

    stubRequest('post', contactMessageApiUrl, (request) => {
      const data = request.json().data;
      if (data.type == 'contactMessage' && data.attributes.name == 'Test Name'
        && data.attributes.email == 'valid@email.format' && data.attributes.message == 'Test message.'
      ) {
        request.ok();
      } else {
        request.error();
      }
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
});
