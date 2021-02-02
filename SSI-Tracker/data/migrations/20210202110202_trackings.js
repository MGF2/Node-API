
exports.up = function(knex) {
  knex.schema.createTable("trackings", tbl => {
    tbl.increments();
    tbl.text("task", 128).notNullable();
  });
};

exports.down = function(knex) {
  knex.schema.dropTableIfExists("trackings");
};
