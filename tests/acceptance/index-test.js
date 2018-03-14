import { module, test } from 'qunit';
import { visit, currentURL, find } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';

module('Acceptance | index', function(hooks) {
  setupApplicationTest(hooks);

  test('visiting /', async function(assert) {
    assert.expect(2);

    await visit('/');

    assert.equal(currentURL(), '/');
    assert.notOk(find('#ember-welcome-page-id-selector'), 'Ember.js welcome page removed.');
  });
});
