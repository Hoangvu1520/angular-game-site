const sha256 = require("../utils/sha256");

exports.seed = async function (knex) {
  // Deletes ALL existing entries
  // await knex("settings").del();
  // await knex("roles").del();
  // await knex("users").del();
  // await knex("user_role").del();
  // await knex("stores").del();

  // Inserts seed entries
  await knex("settings").insert([
    {
      key: "timeOpen",
      value: JSON.stringify({
        monday: ["09:00:00", "17:00:00"],
        tuesday: ["09:00:00", "17:00:00"],
        wednesday: ["09:00:00", "17:00:00"],
        thursday: ["09:00:00", "17:00:00"],
        friday: ["09:00:00", "17:00:00"],
        sunday: ["09:00:00", "17:00:00"],
        saturday: ["09:00:00", "17:00:00"],
      }),
    },
  ]);

  const rolesId = await knex("roles")
    .insert([
      { name: "admin", title: "Quản trị viên" },
      { name: "user", title: "Khách hàng" },
      { name: "sales", title: "Nhân viên bán hàng" },
    ])
    .returning("id");

  await knex("stores").insert({
    name: "Phòng giao dịch Vietagold",
    ext: JSON.stringify({
      address:
        "Phòng giao dịch Vietagold, Tầng 1 tòa CT1, Khu đô thị, Mễ Trì, Nam Từ Liêm, Hà Nội",
    }),
    publish: true,
  });

  const userId = await knex("users")
    .insert([
      {
        user_name: "Tekify Admin",
        email: "admin@tekify.vn",
        phone: "0392894660",
        password: sha256("password"),
        address: "Tòa nhà Sông Đà, 18 Phạm Hùng, Bắc Từ Niêm",
        ext: JSON.stringify({
          position: "Lập trình viên",
          accountBankNo: "21123456789",
          accountBankName: "Tekify Admin",
        }),
        internal: true,
      },
    ])
    .returning("id");

  await knex("user_role").insert(
    rolesId.map((role) => ({
      role_uuid: role.id,
      user_uuid: userId[0].id,
    }))
  );
};
