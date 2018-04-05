import { module, test } from 'qunit';
import { visit, currentURL, click } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import FakeServer, { stubRequest } from 'ember-cli-fake-server';
import ENV from '../../config/environment';

module('Acceptance | verify email', function(hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(function() {
    FakeServer.start();
  });

  hooks.afterEach(function() {
    FakeServer.stop();
  });

  const verifyEmailApiUrl = ENV.apiNamespace + '/verify-email';
  const verifyEmailToken = 'hY5zg8567VQyXg3FNd5AgjXomiT2Di0PQ8kfLDZ91Vvsg35EVDg8RfaL9hub7DPGv2DrfvcIG9fYimbSWmSwMIMGfVFP9xRcqo8b';

  test('Visit verify email page - Error', async function(assert) {

    stubRequest('post', verifyEmailApiUrl, (request) => {
      request.error();
    });
    await visit('/verify-email/' + verifyEmailToken);
    assert.equal(currentURL(), '/verify-email/' + verifyEmailToken);
    assert.dom('[data-test-verify-email-error-message]')
      .exists('There is an error message on the verify email page.');
    assert.dom('[data-test-link-to-homepage-on-verify-email-page]')
      .exists('There is a link to homepage on the verify email page.');
    await click('[data-test-link-to-homepage-on-verify-email-page]');
    assert.equal(currentURL(), '/',
      'Redirection to homepage after clicking link to homepage on verify email page.');
  });

  test('Visit verify email page - Success', async function(assert) {

    stubRequest('post', verifyEmailApiUrl, (request) => {
      const requestData = request.json().data;
      if (requestData.attributes.verify_email_token == verifyEmailToken) {
        request.noContent();
      } else {
        request.error();
      }
    });
    await visit('/verify-email/' + verifyEmailToken);
    assert.equal(currentURL(), '/verify-email/' + verifyEmailToken);
    assert.dom('[data-test-verify-email-confirmation-message]')
      .exists('There is a message on the verify email page.');
    assert.dom('[data-test-link-to-homepage-on-verify-email-page]')
      .exists('There is a link to homepage on the verify email page.');
    await click('[data-test-link-to-homepage-on-verify-email-page]');
    assert.equal(currentURL(), '/',
      'Redirection to homepage after clicking link to homepage on verify email page.');
  });
});
