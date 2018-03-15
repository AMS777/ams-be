import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, find } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | page-navbar', function(hooks) {
  setupRenderingTest(hooks);

  test('Component renders.', async function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    await render(hbs`{{page-navbar}}`);

    assert.equal(this.element.textContent.trim(), '');
  });

  test('Check navbar logo.', async function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    await render(hbs`{{page-navbar}}`);

    const navbarLogoSelector = '[data-test-page-navbar] [data-test-page-navbar-logo] ';
    assert.ok(find(navbarLogoSelector), 'Logo exists on page navbar.');
    assert.ok(find(navbarLogoSelector + 'img'), 'Logo has an image inside.');
  });
});
