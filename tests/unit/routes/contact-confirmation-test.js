import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | contact-confirmation', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:contact-confirmation');
    assert.ok(route);
  });
});
