import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | info-dialog', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {

    const sDialog = 'md-dialog';

    await render(hbs`{{info-dialog}}`);
    assert.dom(sDialog).doesNotExist('There is no dialog.');

    this.set('testShowDialog', false);
    await render(hbs`
      {{#info-dialog showDialog=testShowDialog dialogTitle="Test title"}}
        Test dialog content.
      {{/info-dialog}}
    `);
    assert.dom(sDialog).doesNotExist('There is no dialog.');

    this.set('testShowDialog', true);
    assert.dom(sDialog).exists('There is  dialog.');
    assert.dom(sDialog + ' md-dialog-content').hasText('Test dialog content.', 'Test dialog content.');
  });
});
