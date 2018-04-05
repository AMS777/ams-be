import { module, test } from 'qunit';
import { visit, currentURL, click } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import FakeServer, { stubRequest } from 'ember-cli-fake-server';
import ENV from '../../config/environment';
import { authenticateSession, currentSession } from 'ember-simple-auth/test-support';

module('Acceptance | delete account', function(hooks) {
  setupApplicationTest(hooks);

  const usersApiUrl = ENV.apiNamespace + '/users';
  const oldJwtToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC9sb2NhbGhvc3RcL2FwaVwvZ2V0LXRva2VuIiwiaWF0IjoxNTIyNDk3NTIzLCJleHAiOjE1MjI1MDExMjMsIm5iZiI6MTUyMjQ5NzUyMywianRpIjoidmdTNGZXU3hUR2FFem5LQyIsInN1YiI6MzI5LCJwcnYiOiI0MWRmODgzNGYxYjk4ZjcwZWZhNjBhYWVkZWY0MjM0MTM3MDA2OTBjIn0.1FeDFn03i4mmT7cRIU8jy8fylOtBbmfPdATgNq5piG0';
  const auth2Response = {
    access_token: oldJwtToken,
    userId: 1,
    userName: 'Test Name',
  };

  hooks.beforeEach(async function() {
    FakeServer.start();
    stubRequest('get', usersApiUrl + '/' + auth2Response.userId, (request) => {
      const jsonApiResponse = { data: {
        type: 'users',
        id: auth2Response.userId,
        attributes: {
          name: auth2Response.name,
        },
      }};
      request.ok(jsonApiResponse);
    });
    await authenticateSession(auth2Response);
  });

  hooks.afterEach(function() {
    FakeServer.stop();
  });

  test('Delete account option exists on settings page', async function(assert) {
    await visit('/settings');

    // "pts": "parent test selector"
    const pts = 'md-dialog '; // 'paper-dialog' element does not accept attributes ('[data-test...]')
    assert.dom('[data-test-delete-account-button]').exists('Button exists.');
    await click('[data-test-delete-account-button]');
    assert.dom(pts).exists('Delete account confirmation dialog opens.');
    assert.dom(pts + ' md-toolbar').includesText('Delete Account Confirmation', 'Dialog title.');
    assert.dom(pts + '[data-test-delete-account-confirmation-message]').exists('Confirmation message on dialog.');
    assert.dom(pts + '[data-test-delete-account-dialog-cancel-button]').exists('Cancel button exits on dialog.');
    assert.dom(pts + '[data-test-delete-account-dialog-ok-button]').exists('Ok button exits on dialog.');
    assert.dom(pts + '[data-test-delete-account-dialog-ok-button]').hasText('Delete account', 'Ok button caption.');
    await click(pts + '[data-test-delete-account-dialog-cancel-button]');
    assert.dom(pts).doesNotExist('Request reset password dialog closes.');
  });

  test('Delete account - Error', async function(assert) {
    await visit('/settings');

    // "pts": "parent test selector"
    const pts = 'md-dialog '; // 'paper-dialog' element does not accept attributes ('[data-test...]')

    stubRequest('delete', usersApiUrl + '/' + auth2Response.userId, (request) => {
      request.error({"errors":[{
        "source": {"parameter":"authorization"},
        "title": 'Authorization Error',
        "detail": 'User account cannot be deleted.'
      }],"jsonapi": {"version":"1.0"}});
    });
    await click('[data-test-delete-account-button]');
    await click(pts + '[data-test-delete-account-dialog-ok-button]');
    assert.equal(currentURL(), '/settings', 'Stay on settings page.');
    assert.dom(pts).exists('Error message dialog shown.');
    assert.dom(pts + ' md-toolbar').includesText('Authorization Error', 'Error message dialog title.');
    assert.dom(pts + ' md-dialog-content').includesText(
      'User account cannot be deleted.',
      'Error message dialog content.'
    );
    await click(pts + ' md-toolbar button');

    stubRequest('delete', usersApiUrl + '/' + auth2Response.userId, (request) => {
      request.error({ errors: {} });
    });
    await click('[data-test-delete-account-button]');
    await click(pts + '[data-test-delete-account-dialog-ok-button]');
    assert.dom(pts).exists('Generic error dialog shown.');
    assert.dom(pts + ' md-toolbar').includesText('Delete Account Error', 'Generic error dialog title.');
    assert.dom(pts + ' md-dialog-content').includesText(
      'The account cannot be deleted.',
      'Generic error dialog message.'
    );
    await click(pts + ' md-toolbar button');
  });

  test('Delete account - Success', async function(assert) {
    await visit('/settings');

    // "pts": "parent test selector"
    const pts = 'md-dialog '; // 'paper-dialog' element does not accept attributes ('[data-test...]')

    stubRequest('delete', usersApiUrl + '/' + auth2Response.userId, (request) => {
      request.noContent();
    });
    await click('[data-test-delete-account-button]');
    await click(pts + '[data-test-delete-account-dialog-ok-button]');
    assert.equal(currentURL(), '/delete-account-confirmation',
      'Redirection to delete account confirmation page.');
    assert.dom('[data-test-delete-account-confirmation-message]')
      .exists('There is a confirmation message on the delete account confirmation page.');
    assert.dom('[data-test-link-to-homepage-on-delete-account-confirmation-page]')
      .exists('There is a link to homepage on the delete account confirmation page.');
    await click('[data-test-link-to-homepage-on-delete-account-confirmation-page]');
    assert.equal(currentURL(), '/',
      'Redirection to homepage after clicking link to homepage on delete account confirmation page.');
  });
});
