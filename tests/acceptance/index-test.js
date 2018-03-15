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

    const appLayoutSelector = '[data-test-app-layout] ';
    assert.ok(find(appLayoutSelector), 'App layout exists.');
    assert.ok(find(appLayoutSelector + ' > [data-test-app-layout-header]'), 'Header exists in app layout.');
    assert.ok(find(appLayoutSelector + ' > [data-test-app-layout-body]'), 'Body exists in app layout.');
    assert.ok(find(appLayoutSelector + ' > [data-test-app-layout-footer]'), 'Footer exists in app layout.');
  });

  test('Check page header.', async function(assert) {
    assert.expect(2);

    await visit('/');

    const headerNavbarSelector = '[data-test-app-layout-header] [data-test-page-navbar] ';
    assert.ok(find(headerNavbarSelector), 'Navbar exists on page header.');

    await click(headerNavbarSelector + '[data-test-page-navbar-logo]');
    assert.equal(currentURL(), '/', 'Click the navbar logo goes to homepage.');
  });

  test('Check page footer.', async function(assert) {
    assert.expect(2);

    await visit('/');

    const pageFooterSelector = '[data-test-app-layout-footer] ';
    await click(pageFooterSelector + '[data-test-page-footer-contact]');
    assert.equal(currentURL(), '/contact', 'Click the contact link goes to the contact page.');
    await click(pageFooterSelector + '[data-test-page-footer-copyright]');
    assert.equal(currentURL(), '/', 'Click the app name goes to homepage.');
  });
});
