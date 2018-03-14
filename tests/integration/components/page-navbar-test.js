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

    assert.ok(find('.page-navbar .logo'), 'Logo exists on page navbar.');
  });
});
