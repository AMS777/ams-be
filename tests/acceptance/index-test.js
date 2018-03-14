import { module, test } from 'qunit';
import { visit, currentURL, find } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';

module('Acceptance | index', function(hooks) {
  setupApplicationTest(hooks);

  test('Visit homepage.', async function(assert) {
    assert.expect(2);

    await visit('/');

    assert.equal(currentURL(), '/');

    assert.notOk(find('#ember-welcome-page-id-selector'), 'Ember.js welcome page removed.');
  });

  test('Check header-body-footer page layout.', async function(assert) {
    assert.expect(4);

    await visit('/');

    assert.ok(find('#app-layout'), 'App layout exists.');
    assert.ok(find('#app-layout > header'), 'Header exists in app layout.');
    assert.ok(find('#app-layout > main'), 'Body exists in app layout.');
    assert.ok(find('#app-layout > footer'), 'Footer exists in app layout.');
  });

  test('Check page navbar.', async function(assert) {
    assert.expect(1);

    await visit('/');

    assert.ok(find('#app-layout > header md-toolbar'), 'Navbar exists on page header.');
  });
});
