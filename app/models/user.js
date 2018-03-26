import DS from 'ember-data';

export default DS.Model.extend({
//  name: DS.attr('string', { defaultValue: '' }),
//  email: DS.attr('string', { defaultValue: '' }),
//  password: DS.attr('string', { defaultValue: '' }),
  name: DS.attr('string'),
  email: DS.attr('string'),
  password: DS.attr('string'),
});
