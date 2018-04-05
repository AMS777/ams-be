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

  hooks.beforeEach(function() {
    FakeServer.start();
  });

  hooks.afterEach(function() {
    FakeServer.stop();
  });

  test('Delete account option exists on settings page', async function(assert) {
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
});
