import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Controller | login-and-register', function(hooks) {
  setupTest(hooks);

  // Replace this with your real tests.
  test('it exists', function(assert) {
    let controller = this.owner.lookup('controller:login-and-register');
    assert.ok(controller);
  });
});
