
exports.up = function(knex) {
  return knex.schema.createTable('trackings', function(table) {
    table.increments();
    table.double('amount',10,2);
    table.string('description').nullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.string('issuer',36);
    table.string('beneficiary',36);
    table.string('ethereum_id',70);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('trackings');
};
