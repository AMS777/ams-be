import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | page-navbar', function(hooks) {
  setupRenderingTest(hooks);

  test('Check navbar logo.', async function(assert) {

    await render(hbs`{{page-navbar}}`);

    const navbarLogoSelector = '[data-test-page-navbar] [data-test-page-navbar-logo] ';
    assert.dom(navbarLogoSelector).exists('Logo exists on page navbar.');
    assert.dom(navbarLogoSelector + 'img').exists('Logo has an image inside.');
  });
});
