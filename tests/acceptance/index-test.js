import { module, test } from 'qunit';
import { visit, currentURL, find } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';

module('Acceptance | index', function(hooks) {
  setupApplicationTest(hooks);

  test('visiting /', async function(assert) {
    assert.expect(6);

    await visit('/');

    assert.equal(currentURL(), '/');

    assert.notOk(find('#ember-welcome-page-id-selector'), 'Ember.js welcome page removed.');
    
    assert.ok(find('#app-layout'), 'App layout exists.');
    assert.ok(find('#app-layout > header'), 'Header exists in app layout.');
    assert.ok(find('#app-layout > main'), 'Body exists in app layout.');
    assert.ok(find('#app-layout > footer'), 'Footer exists in app layout.');
  });
});
