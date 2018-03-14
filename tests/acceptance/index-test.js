import { module, test } from 'qunit';
import { visit, currentURL, find, click } from '@ember/test-helpers';
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

  test('Check page header.', async function(assert) {
    assert.expect(2);

    await visit('/');

    assert.ok(find('#app-layout > header .page-navbar'), 'Navbar exists on page header.');

    await click('#app-layout > header .page-navbar a.logo');
    assert.equal(currentURL(), '/', 'Click the navbar logo goes to homepage.');
  });

  test('Check page footer.', async function(assert) {
    assert.expect(1);

    await visit('/');

    await click('#app-layout > footer a');
    assert.equal(currentURL(), '/', 'Click the app name goes to homepage.');
  });
});
