
exports.up = function(knex) {
  return knex.schema.createTable('trackings', function(table) {
    table.increments();
    table.double('amount',10,2);
    table.string('description');
    table.date('created_at');
    table.string('issuer',36);
    table.string('beneficiary',36);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('trackings');
};
