const knex = require("../utils/connection");

const CreateUser = async (userData) => {
    try {
        const userEmail = await knex("users")
            .where("email", userData.email)
            .first();
        const getUserDataIntro =
            userData.sale &&
            (await knex("users")
                .where("email", userData.sale.split(" / ")[1])
                .first());
        const userPhone =
            userData?.phone &&
            (await knex("users").where("phone", userData?.phone).first());
        if (userEmail) {
            throw { code: 409, message: "Email already exists" };
        }
        if (userPhone) {
            throw { code: 409, message: "Phone number already exists" };
        }
        const newUser = await knex("users").insert(userData).returning("*");
        if (getUserDataIntro) {
            await knex("introductions")
                .where("user_id", newUser[0].id)
                .whereNull("deleted_at")
                .update("deleted_at", new Date());
            await knex("introductions").insert({
                user_id: newUser[0].id,
                introduction_id: getUserDataIntro.id,
            });
        }
        return newUser;
    } catch (error) {
        console.log(error);
        throw error;
    }
};
const GetRoleIdsByName = async (roleNames) => {
    return await knex("roles").whereIn("name", roleNames).select("id");
};

const AssignRolesToUser = async (userRoles) => {
    return await knex("user_role").insert(userRoles);
};

const CreateToken = async (userId, type) => {
    try {
        const now = new Date();
        const respone = await knex("tokens")
            .insert({
                code: Math.floor(100000 + Math.random() * 900000).toString(),
                user_id: userId,
                type: type,
                expired_at: new Date(now.getTime() + 5 * 60000),
            })
            .returning(["user_id", "code", "expired_at"]);
        return respone;
    } catch (error) {
        throw error;
    }
};
const ResendToken = async (email, type, phone) => {
    const now = new Date();
    const user = email && (await knex("users").where("email", email).first());
    const userPhone =
        phone && (await knex("users").where("phone", phone).first());
    if (user || userPhone) {
        return await knex("tokens")
            .insert({
                code: Math.floor(100000 + Math.random() * 900000).toString(),
                user_id: user.id || userPhone.id,
                type: type,
                expired_at: new Date(now.getTime() + 5 * 60000),
            })
            .returning(["user_id", "code", "expired_at"]);
    }
    throw "Can not find user";
};

const CheckToken = async (userId, token, type, email, phone) => {
    const checkToken = knex("tokens").where("code", token).where("type", type);
    const user = email && (await knex("users").where("email", email).first());
    const userPhone =
        phone && (await knex("users").where("phone", phone).first());
    userId && checkToken.where("user_id", userId);
    email && user && checkToken.where("user_id", user.id);
    phone && userPhone && checkToken.where("user_id", userPhone.id);
    const result = await checkToken.first();
    if (result) {
        await knex("tokens")
            .where("user_id", result.user_id)
            .where("type", result.type)
            .where("expired_at", "<", knex.fn.now())
            .update({ expired_at: knex.fn.now() })
            .returning("*");
        return result;
    }
    throw "Invalid OTP code.";
};
const CheckOTP = async (userId, token, type, email, phone) => {
    const checkToken = knex("tokens").where("code", token).where("type", type);
    const user = email && (await knex("users").where("email", email).first());
    const userPhone =
        phone && (await knex("users").where("phone", phone).first());
    userId && checkToken.where("user_id", userId);
    email && user && checkToken.where("user_id", user.id);
    phone && userPhone && checkToken.where("user_id", userPhone.id);
    const result = await checkToken.first();
    if (result) {
        return result;
    }
    throw "Invalid OTP code.";
};
const VerifyUserSuccess = async (userId) => {
    return await knex("users")
        .where("id", userId)
        .update({ verify: true })
        .returning("*");
};

const GetUserRoles = async (user_id) => {
    const subquery = await knex("user_role")
        .select("role_uuid")
        .where("user_uuid", user_id);

    const roles = await knex("roles")
        .select("name")
        .whereIn(
            "id",
            subquery.map((item) => item.role_uuid)
        );

    return roles.map((item) => item.name);
};

const GetUserByEmailOrPhone = async (email, phone, password) => {
    const account = email != null ? email : phone;
    const user = await knex("users")
        .select("*")
        .where(email != null ? "email" : "phone", account)
        .andWhere("password", password)
        .first();
    if (user) {
        const profile = await knex("profiles")
            .select("process")
            .where("user_id", user.id)
            .first();
        const roles = await knex("roles")
            .select("roles.name", "roles.id")
            .join("user_role", "roles.id", "user_role.role_uuid")
            .where("user_role.user_uuid", user.id);
        const permissions = await knex("permissions")
            .select("permissions.key")
            .whereIn("id", function () {
                this.select("permission_id")
                    .from("role_permissions")
                    .whereIn(
                        "role_id",
                        roles.map((role) => role.id)
                    );
            });
        user.permissions = permissions.map((permission) => permission.key);
        user.roles = roles.map((role) => role.name);
        user.kyc = !profile ? 3 : profile;
    }
    return user;
};

const UpdateRole = async (UpdateRoleProps) => {
    const role = await knex("roles").select("*");
    var deleteFunc;
    var updateFunc;
    if (UpdateRoleProps.deleteRole && UpdateRoleProps.deleteRole.length > 0) {
        const deleteRole = UpdateRoleProps.deleteRole;
        deleteFunc = knex("user_role")
            .whereIn("uuid", [deleteRole.map((item) => item.uuid)])
            .del();
    }
    if (UpdateRoleProps.updateRole && UpdateRoleProps.updateRole.length > 0) {
        const updateRole = UpdateRoleProps.updateRole;
        updateFunc = knex("user_role")
            .insert(
                updateRole.map((item) => ({
                    user_uuid: UpdateRoleProps.userId,
                    role_uuid: role.find((el) => el.name == item)?.id,
                }))
            )
            .returning("*");
    }

    return await Promise.all([await deleteFunc, await updateFunc])
        .then((res) => {
            return res;
        })
        .catch((err) => {
            throw err;
        });
};

const ChangePassword = async (id, oldPassword, newPassword) => {
    const changePassword = knex("users")
        .where("id", id)
        .andWhere("password", oldPassword)
        .update({ password: newPassword })
        .returning("*");

    return await changePassword; // Add return statement here
};

const GetUserData = async (userId) => {
    const getUserData = await knex("users").where("id", userId).first();
    if (getUserData) {
        const profile = await knex("profiles")
            .select("process")
            .where("user_id", userId)
            .first();
        getUserData.kyc = !profile ? 3 : profile;
    }
    return getUserData;
};

const UpdateUserData = async (userId, updates, password) => {
    const getUserData = await knex("users").where("id", userId).first();
    if (password !== getUserData.password) {
        throw "Incorrect password";
    }
    if (updates.email !== getUserData.email) {
        const userEmail = await knex("users").where("email", updates.email).first();

        if (userEmail) {
            throw "Email already exists";
        }
    }
    if (updates.phone !== getUserData.phone) {
        const userPhone =
            updates?.phone &&
            (await knex("users").where("phone", updates?.phone).first());
        if (userPhone) {
            throw "Phone number already exists";
        }
    }

    const UpdateUserData = knex("users")
        .where("id", userId)
        .update({
            user_name: updates.user_name,
            email: updates.email,
            phone: updates.phone,
            ext: {
                ...getUserData.ext,
                dateOfBirth: updates.dateOfBirth,
                address: updates.address,
            },
        })
        .returning("*");

    return await UpdateUserData;
};
const CheckPassword = async (userId, updates, password) => {
    const getUserData = await knex("users").where("id", userId).first();
    if (password !== getUserData.password) {
        throw "Incorrect password";
    }

    return true;
};

module.exports = {
  CreateUser,
  GetRoleIdsByName,
  AssignRolesToUser,
  GetUserRoles,
  GetUserByEmailOrPhone,
  UpdateRole,
  ChangePassword,
  CreateToken,
  CheckToken,
  VerifyUserSuccess,
  GetUserData,
  UpdateUserData,
  CheckOTP,
  ResendToken,
  CheckPassword,
};