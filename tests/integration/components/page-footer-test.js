import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, find } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import CONFIG from '../../../config/environment';

module('Integration | Component | page-footer', function(hooks) {
  setupRenderingTest(hooks);

  test('Check copyright.', async function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    await render(hbs`{{page-footer}}`);

    const copyrightText = new Date().getFullYear() + ' © ' + CONFIG.TEXTS.appName;
    assert.equal(find('[data-test-page-footer-copyright]').textContent.trim(), copyrightText, 'Footer has year, copyright and app name.');
  });
});
