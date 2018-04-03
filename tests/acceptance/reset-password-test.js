import { module, test } from 'qunit';
import { visit, currentURL, click, focus, fillIn, pauseTest } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';

module('Acceptance | reset password', function(hooks) {
  setupApplicationTest(hooks);

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

    // "pts": "parent test selector"
    const pts = 'md-dialog '; // 'paper-dialog' element does not accept attributes ('[data-test...]')

    await click('[data-test-reset-password-button]');
    await click(pts + '[data-test-reset-password-dialog-ok-button]');
    assert.dom(pts + '[data-test-reset-password-email] .paper-input-error').hasText('Email is required.', 'Validate empty email.');

    await fillIn(pts + '[data-test-reset-password-email] input', 'invalid-email-format');
    assert.dom(pts + '[data-test-reset-password-email] .paper-input-error').hasText('Invalid email.', 'Validate email format.');
    await click(pts + '[data-test-reset-password-dialog-ok-button]');
  });
});
