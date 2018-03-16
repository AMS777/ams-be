import { module, test, skip } from 'qunit';
import { visit, currentURL, find } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';

module('Acceptance | contact', function(hooks) {
  setupApplicationTest(hooks);

  test('visiting /contact', async function(assert) {
    await visit('/contact');

    assert.equal(currentURL(), '/contact');
  });

  test('Contact form exists', async function(assert) {
    assert.expect(5);

    await visit('/contact');

    // "ts": "test selector"
    const tsContactForm = '[data-test-contact-form] ';
    assert.ok(find(tsContactForm), 'Contact form exists.');
    assert.ok(find(tsContactForm + '[data-test-name]'), 'Contact form has name field.');
    assert.ok(find(tsContactForm + '[data-test-email]'), 'Contact form has email field.');
    assert.ok(find(tsContactForm + '[data-test-message]'), 'Contact form has message field.');
    assert.ok(find(tsContactForm + '[data-test-submit]'), 'Contact form has submit button.');
  });

  skip('Validate contact form', async function(assert) {
    await visit('/contact');

    assert.notOk(true);
  });

  skip('Submit contact form', async function(assert) {
    await visit('/contact');

    assert.notOk(true);
  });
});
