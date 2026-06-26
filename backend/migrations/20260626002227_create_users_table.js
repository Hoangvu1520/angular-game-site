/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    table.uuid("id").primary().defaultTo(knex.fn.uuid());
    table.string("email").notNullable().unique();
    table.string("phone").nullable().unique();
    table.string("password").notNullable();
    table.string("user_name").notNullable();
    table.string("address").nullable();
    table.jsonb("ext").nullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
    table.timestamp("deleted_at").nullable();
    table.boolean("verify").nullable().defaultTo(false);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    await knex.schema.dropTable("users");
};
