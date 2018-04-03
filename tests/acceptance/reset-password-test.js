import { module, test } from 'qunit';
import { visit, currentURL, click, fillIn } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import ENV from '../../config/environment';
import FakeServer, { stubRequest } from 'ember-cli-fake-server';

module('Acceptance | reset password', function(hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(function() {
    FakeServer.start();
  });

  hooks.afterEach(function() {
    FakeServer.stop();
  });

  const resetPasswordApiUrl = ENV.apiNamespace + '/request-reset-password';
  const data = {
    email: 'valid@email.format',
  };

  test('Reset password option exists', async function(assert) {
    await visit('/login');

    // "pts": "parent test selector"
    const pts = 'md-dialog '; // 'paper-dialog' element does not accept attributes ('[data-test...]')
    assert.dom('[data-test-reset-password-button]').exists('Button exists.');
    await click('[data-test-reset-password-button]');
    assert.dom(pts).exists('Reset password dialog opens.');
    assert.dom(pts + '[data-test-reset-password-email] input').exists('Email field exits on dialog.');
    assert.dom(pts + '[data-test-reset-password-dialog-cancel-button]').exists('Cancel button exits on dialog.');
    assert.dom(pts + '[data-test-reset-password-dialog-ok-button]').exists('Ok button exits on dialog.');
    await click(pts + '[data-test-reset-password-dialog-cancel-button]');
    assert.dom(pts).doesNotExist('Reset password dialog closes.');
  });

  test('Validate form', async function(assert) {
    await visit('/login');
    await click('[data-test-reset-password-button]');

    // "pts": "parent test selector"
    const pts = 'md-dialog '; // 'paper-dialog' element does not accept attributes ('[data-test...]')

    await click(pts + '[data-test-reset-password-dialog-ok-button]');
    assert.dom(pts + '[data-test-reset-password-email] .paper-input-error').hasText('Email is required.', 'Validate empty email.');

    await fillIn(pts + '[data-test-reset-password-email] input', 'invalid-email-format');
    assert.dom(pts + '[data-test-reset-password-email] .paper-input-error').hasText('Invalid email.', 'Validate email format.');
    await click(pts + '[data-test-reset-password-dialog-ok-button]');
  });

  test('Submit form - Error', async function(assert) {
    await visit('/login');
    await click('[data-test-reset-password-button]');

    // "pts": "parent test selector"
    const pts = 'md-dialog '; // 'paper-dialog' element does not accept attributes ('[data-test...]')

    stubRequest('post', resetPasswordApiUrl, (request) => {
      request.error({"errors":[{
        "source":{"parameter":"email"},
        "title":'Email Error',
        "detail":'The email "' + data.email + '" does not exist.'
      }],"jsonapi": {"version":"1.0"}});
    });
    await fillIn(pts + '[data-test-reset-password-email] input', data.email);
    await click(pts + '[data-test-reset-password-dialog-ok-button]');
    assert.dom(pts).exists('Error message dialog shown.');
    assert.dom(pts + ' md-toolbar').includesText('Email Error', 'Error message dialog title.');
    assert.dom(pts + ' md-dialog-content').includesText(
      'The email "' + data.email + '" does not exist.',
      'Error message message dialog.'
    );
    await click(pts + ' md-toolbar button');
  });

  test('Submit form - Success', async function(assert) {
    await visit('/login');
    await click('[data-test-reset-password-button]');

    // "pts": "parent test selector"
    const pts = 'md-dialog '; // 'paper-dialog' element does not accept attributes ('[data-test...]')

    stubRequest('post', resetPasswordApiUrl, (request) => {
      const requestData = request.json().data;
      if (requestData.type == 'users' && requestData.attributes.email == data.email) {
        request.noContent();
      } else {
        request.error();
      }
    });
    await fillIn(pts + '[data-test-reset-password-email] input', data.email);
    await click(pts + '[data-test-reset-password-dialog-ok-button]');
    assert.equal(currentURL(), '/request-reset-password-confirmation',
      'Redirection to email to request reset password confirmation page.');
    assert.dom('[data-test-request-reset-password-confirmation-message]')
      .exists('There is a confirmation message on the request reset password confirmation page.');
    assert.dom('[data-test-link-to-homepage-on-request-reset-password-confirmation-page]')
      .exists('There is a link to homepage on the request reset password confirmation page.');
    await click('[data-test-link-to-homepage-on-request-reset-password-confirmation-page]');
    assert.equal(currentURL(), '/',
      'Redirection to homepage after clicking link to homepage on request reset password confirmation page.');
  });
});
