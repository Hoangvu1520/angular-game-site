const sha256 = require("../../utils/sha256");
const { generateToken } = require("../../utils/jwt");
const UserModel = require("../../models/Users.model");
const templateRespone = require("../../utils/templateRespone");
const { SendMail, SendSMS } = require("../../services");
const { MailTokenTemplate } = require("../../templates");

const register = async (req, res) => {
    if (req.method === "POST") {
        try {
            const form = req.body;
            // Kiểm tra tính hợp lệ của các trường
            if (!form.email || !form.password || !form.user_name) {
                return res.status(400).send({ error: "Invalid request parameters" });
            }
            // Băm mật khẩu
            const passwordHash = sha256(form.password);

            // Tạo người dùng mới
            const [createUser] = await UserModel.CreateUser({
                email: form.email,
                phone: form.phone ? form.phone : null,
                password: passwordHash,
                user_name: form.user_name,
                ext: form?.ext,
                sale_id: form?.sale_id,
                internal: form?.internal,
            });
            // Kiểm tra vai trò và gán vai trò cho người dùng
            const roleIDs = await UserModel.GetRoleIdsByName(
                !(!form.role || form.role.length === 0) ? form.role : ["user"]
            );

            if (roleIDs.length > 0) {
                const userRoles = roleIDs.map((item) => ({
                    user_uuid: createUser.id,
                    role_uuid: item.id,
                }));

                await UserModel.AssignRolesToUser(userRoles);
                return res.status(200).send(createUser);
            } else {
                return res.status(400).send({ error: "Invalid roles" });
            }
        } catch (error) {
            console.log("register error", error);
            return res
                .status(error.code ?? 500)
                .send({ error: `Server error: ${error.message ?? error}` });
        }
    } else {
        return res.status(405).send({ error: "Method Not Allowed" });
    }
};

const registerAccumulate = async (req, res) => {
    if (req.method === "POST") {
        try {
            const form = req.body;
            // Kiểm tra tính hợp lệ của các trường
            if (!form.email || !form.password || !form.user_name) {
                return res.status(400).send({ error: "Invalid request parameters" });
            }
            // Băm mật khẩu
            const passwordHash = sha256(form.password);
            // Tạo người dùng mới
            const [createUser] = await UserModel.CreateUser({
                email: form.email,
                phone: form.phone ? form.phone : null,
                password: passwordHash,
                user_name: form.user_name,
            });
            const [roleIDs] = await UserModel.GetRoleIdsByName(["user"]);
            await UserModel.AssignRolesToUser([
                {
                    user_uuid: createUser.id,
                    role_uuid: roleIDs.id,
                },
            ]);
            const [token] = await UserModel.CreateToken(createUser.id, 1);
            try {
                form.phone
                    ? await SendSMS(form.phone, token.code)
                    : await SendMail(
                        createUser.email,
                        "VietAGold xác thực tạo tài khoản",
                        MailTokenTemplate(
                            createUser.user_name,
                            token.code,
                            token.expired_at
                        )
                    );
            } catch (error) {
                console.log("register error", error);
                return res.status(500).send(
                    templateRespone(500, {
                        error: error,
                    })
                );
            }

            return res.status(200).send(
                templateRespone(200, {
                    user: {
                        id: createUser.id,
                        email: createUser.email,
                        phone: createUser.phone,
                    },
                })
            );
        } catch (error) {
            console.log("register error", error);
            return res
                .status(error.code ?? 500)
                .send(
                    templateRespone(error.code ?? 500, { error: error.message ?? error })
                );
        }
    } else {
        return res.status(405).send({ error: "Method Not Allowed" });
    }
};

const verifyAccount = async (req, res) => {
    if (req.method === "POST") {
        try {
            const now = new Date();
            const form = req.body;
            // Kiểm tra tính hợp lệ của các trường
            if (!form.code) {
                return res.status(400).send({ error: "Invalid request parameters" });
            }
            const token = await UserModel.CheckToken(
                form.userId,
                form.code,
                1,
                form.email
            );
            if (token && token.expired_at >= now) {
                const [verifyUserSuccess] = await UserModel.VerifyUserSuccess(
                    token.user_id,
                    token.code
                );
                return verifyUserSuccess
                    ? res.status(200).send(
                        templateRespone(200, {
                            user: {
                                id: verifyUserSuccess.id,
                                email: verifyUserSuccess.email,
                                phone: verifyUserSuccess.phone,
                            },
                            message: "Verification successful",
                        })
                    )
                    : res.status(500).send(
                        templateRespone(500, {
                            user: {},
                            message: "Account verification failed, please try again later",
                        })
                    );
            }
            return res.status(400).send(
                templateRespone(400, {
                    user: {},
                    message: "Code is incorrect or has expired, please try again later",
                })
            );
        } catch (error) {
            return res.status(500).send(
                templateRespone(500, {
                    error: error,
                })
            );
        }
    } else {
        return res.status(405).send({ error: "Method Not Allowed" });
    }
};

const login = async (req, res) => {
    if (req.method === "POST") {
        try {
            const { phone, email, password } = req.body;
            const user = await UserModel.GetUserByEmailOrPhone(
                email,
                phone,
                sha256(password)
            );
            if (!user) {
                return res.status(400).send({ error: "Sai tài khoản hoặc mật khẩu" });
            } else if (
                req.headers.origin == process.env.CMS_ORIGIN &&
                !user?.internal
            ) {
                return res
                    .status(400)
                    .send({ error: "Tài khoản không có quyền truy cập vào trang này" });
            } else if (
                (req.headers.origin == process.env.IOS_ORIGIN ||
                    req.headers.origin == process.env.MOBILE_ORIGIN) &&
                !user?.verify
            ) {
                const [token] = await UserModel.CreateToken(user.id, 1);
                user.phone
                    ? await SendSMS(user.phone, token.code)
                    : await SendMail(
                        user.email,
                        "VietAGold xác thực tạo tài khoản",
                        MailTokenTemplate(user.user_name, token.code, token.expired_at)
                    );
                return res.status(400).send({
                    error: "Tài khoản chưa xác thực",
                    verify: false,
                    otpSend: user.phone ? user.phone : user.email,
                });
            }
            if (user.deleted_at != null) {
                return res
                    .status(401)
                    .send({ message: "Tài khoản đã bị vô hiệu hóa !!" });
            } else {
                const tokenPayload = {
                    id: user.id,
                    user_name: user.user_name,
                    email: user.email,
                    phone: user.phone,
                    roles: user.roles,
                    gold: user.gold,
                    permission: user.permissions,
                    internal: user.internal,
                    token_created_at: Date(),
                    verify: user.verify,
                    kyc: user.kyc,
                };
                // Generate JWT token
                const accessToken = generateToken(tokenPayload);
                //local
                process.env.ENV == "dev"
                    ? res.setCookie("Access_token", accessToken, {
                        path: "/",
                        maxAge: 21600, // 6 hours
                        httpOnly: true,
                        sameSite: "Lax",
                    })
                    : res.setCookie("Access_token", accessToken, {
                        domain: ".vietagold.com.vn",
                        path: "/",
                        maxAge: 21600, // 6 hours
                        httpOnly: true,
                        sameSite: "None",
                        secure: true, // Chỉ thiết lập secure nếu đang ở môi trường production
                    });
                return res
                    .header("Authorization", `Bearer ${accessToken}`)
                    .status(200)
                    .send({
                        accessToken,
                        user: {
                            user_name: user.user_name,
                            email: user.email,
                            phone: user.phone,
                            cash: user.cash,
                            gold: user.gold,
                            kyc: user.kyc,
                        },
                    });
            }
        } catch (error) {
            console.error("login error", error);
            return res.status(500).send({ error: `${error}` });
        }
    } else {
        return res.status(405).send({ error: "Method Not Allowed" });
    }
};

const logout = async (req, res) => {
    //local
    process.env.ENV == "dev"
        ? res.setCookie("Access_token", "/", {
            path: "/",
            maxAge: 0, // 6 hours
            httpOnly: true,
            sameSite: "Lax",
        })
        : res.setCookie("Access_token", "/", {
            domain: ".vietagold.com.vn",
            path: "/",
            maxAge: 0, // 6 hours
            httpOnly: true,
            sameSite: "None",
            secure: true, // Chỉ thiết lập secure nếu đang ở môi trường production
        });
    return res.status(200).send({ message: "Logout success" });
};
const checkAuth = async (req, reply) => {
    reply.status(200).send({ message: "Authenticated", user: req.user });
};
const changePassword = async (req, res) => {
    if (req.method === "POST") {
        try {
            const { oldPassword, newPassword, confirmPassword } = req.body;
            if (!req?.user) {
                return res.status(401).send(
                    templateRespone(200, {
                        message: "User is not logging in!",
                    })
                );
            }
            if (!oldPassword || !newPassword || !confirmPassword) {
                return res
                    .status(400)
                    .send({ error: "Không được bỏ trống bất kỳ trường nào !!" });
            }
            if (newPassword != confirmPassword) {
                return res
                    .status(400)
                    .send({ error: "Nhập lại mật khẩu không khớp !!" });
            }
            if (newPassword.length < 9) {
                return res.status(400).send({ error: "Mật khẩu tối thiểu 9 ký tự" });
            }

            const user = await UserModel.ChangePassword(
                req.user.id,
                sha256(oldPassword),
                sha256(newPassword)
            );
            if (user.length <= 0) {
                return res.status(400).send({ error: "Mật khẩu cũ không đúng !!" });
            } else {
                //local
                process.env.ENV == "dev"
                    ? res.setCookie("Access_token", "/", {
                        // domain: ".vietagold.com.vn",
                        path: "/",
                        maxAge: 21600, // 6 hours
                        httpOnly: true,
                        sameSite: "Lax",
                        // secure: true, // Chỉ thiết lập secure nếu đang ở môi trường production
                    })
                    : res.setCookie("Access_token", "/", {
                        domain: ".vietagold.com.vn",
                        path: "/",
                        maxAge: 21600, // 6 hours
                        httpOnly: true,
                        sameSite: "None",
                        secure: true, // Chỉ thiết lập secure nếu đang ở môi trường production
                    });
                return res
                    .status(200)
                    .send({ message: "Đổi mật khẩu thành công, vui lòng đăng nhập lại" });
            }
        } catch (error) {
            console.error("change password", error);
            return res.status(500).send({ error: `${error}` });
        }
    } else {
        return res.status(405).send({ error: "Method Not Allowed" });
    }
};

const refreshUserData = async (req, res) => {
    if (req.method === "GET") {
        try {
            const user = await UserModel.GetUserData(req.user.id);
            if (user) {
                return res.status(200).send(
                    templateRespone(200, {
                        user: {
                            id: user.id,
                            email: user.email,
                            phone: user.phone,
                            user_name: user.user_name,
                            gold: user.gold,
                            cash: user.cash,
                            ext: user.ext,
                            kyc: user.kyc ? user.kyc : 3,
                        },
                    })
                );
            }
            return res
                .status(500)
                .send(templateRespone(500, { message: "Not found user" }));
        } catch (error) {
            console.error("change password", error);
            return res.status(500).send(
                templateRespone(500, {
                    error: error,
                })
            );
        }
    } else {
        return res.status(405).send({ error: "Method Not Allowed" });
    }
};
const UpdateUserData = async (req, res) => {
    if (req.method === "POST") {
        try {
            const { user_name, email, phone, dateOfBirth, address, password } =
                req.body;
            if (!user_name || !email) {
                return res
                    .status(400)
                    .send({ error: "Name, email and phone must not be empty !!" });
            }
            const [user] = await UserModel.UpdateUserData(
                req.user.id,
                {
                    user_name,
                    email,
                    phone: phone ? phone : null,
                    dateOfBirth,
                    address,
                },
                sha256(password)
            );
            return res.status(200).send(
                templateRespone(200, {
                    user: {
                        id: user.id,
                        email: user.email,
                        phone: user.phone,
                        user_name: user.user_name,
                        gold: user.gold,
                        cash: user.cash,
                        ext: user.ext,
                    },
                })
            );
        } catch (error) {
            console.error("update user data", error);
            return res.status(500).send(
                templateRespone(500, {
                    error: error,
                })
            );
        }
    } else {
        return res.status(405).send({ error: "Method Not Allowed" });
    }
};
const ForgotPasswordOtp = async (req, res) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+?\d{9,15}$/; // Hỗ trợ cả số có dấu + đầu, 9-15 chữ số
    if (req.method === "GET") {
        try {
            const { email } = req.params;
            if (!email) {
                return res
                    .status(400)
                    .send({ error: "Email or Phone must not be empty !!" });
            }
            const { user, token } = await UserModel.CheckEmalForgotPassword(email);
            if (user && token) {
                if (emailRegex.test(email)) {
                    await SendMail(
                        user.email,
                        "Xác thực yêu cầu đặt lại mật khẩu tài khoản VAG",
                        MailTokenTemplate(user.user_name, token.code, token.expired_at)
                    );
                } else if (phoneRegex.test(email)) {
                    await SendSMS(email, token.code);
                }
            }
            return res.status(200).send(
                templateRespone(200, {
                    user: {
                        email: user.email,
                        phone: user.phone,
                    },
                    message: "OTP send success",
                })
            );
        } catch (error) {
            console.error("reset password", error);
            return res.status(500).send(
                templateRespone(500, {
                    error: error,
                })
            );
        }
    } else {
        return res.status(405).send({ error: "Method Not Allowed" });
    }
};
const ForgotPasswordCheckOtp = async (req, res) => {
    if (req.method === "POST") {
        try {
            const { otp, email, phone } = req.body;
            if (!otp || !(email || phone)) {
                return res
                    .status(400)
                    .send({ error: "OTP and Email must not be empty !!" });
            }
            const token = await UserModel.CheckOTP(null, otp, 2, email, phone);
            const now = new Date();
            if (token && token.expired_at >= now) {
                return res.status(token ? 200 : 400).send(
                    templateRespone(token ? 200 : 400, {
                        result: !!token,
                    })
                );
            }
            return res.status(400).send(
                templateRespone(400, {
                    message: "OTP is incorrect or has expired, please try again later",
                })
            );
        } catch (error) {
            console.error("reset password", error);
            return res.status(500).send(
                templateRespone(500, {
                    error: error,
                })
            );
        }
    } else {
        return res.status(405).send({ error: "Method Not Allowed" });
    }
};
const ForgotPassword = async (req, res) => {
    if (req.method === "POST") {
        try {
            const { phone, email, newPassword, confirmPassword, otp } = req.body;
            if (!newPassword || !confirmPassword || !otp || (!phone && !email)) {
                return res
                    .status(400)
                    .send({ error: "All fields must not be empty !!" });
            }
            if (newPassword != confirmPassword) {
                return res
                    .status(400)
                    .send({ error: "New password and confirm password are different" });
            }
            const token = await UserModel.CheckToken(null, otp, 2, email, phone);
            const now = new Date();
            if (token && token.expired_at >= now) {
                const passwordHash = sha256(newPassword);
                const [verifyUserSuccess] = await UserModel.ResetPassword(
                    email,
                    phone,
                    passwordHash
                );
                return verifyUserSuccess
                    ? res.status(200).send(
                        templateRespone(200, {
                            user: {
                                email: verifyUserSuccess.email,
                            },
                            message: "Reset password successful",
                        })
                    )
                    : res.status(500).send(
                        templateRespone(500, {
                            user: {},
                            message: "Reset password failed, please try again later",
                        })
                    );
            }
            return res.status(400).send(
                templateRespone(400, {
                    user: {},
                    message: "OTP is incorrect or has expired, please try again later",
                })
            );
        } catch (error) {
            console.error("reset password", error);
            return res.status(500).send(
                templateRespone(500, {
                    error: error,
                })
            );
        }
    } else {
        return res.status(405).send({ error: "Method Not Allowed" });
    }
};
const DeleteAccount = async (req, res) => {
    if (req.method === "POST") {
        try {
            const { otp } = req.body;
            if (!otp) {
                return res.status(400).send({ error: "OTP must not be empty !!" });
            }
            const token = await UserModel.CheckToken(req.user.id, otp, 8, null);
            const now = new Date();
            if (token && token.expired_at >= now) {
                const deleteUser = await UserModel.DeleteAccount(req.user.id);
                if (deleteUser) {
                    process.env.ENV == "dev"
                        ? res.setCookie("Access_token", "/", {
                            path: "/",
                            maxAge: 21600, // 6 hours
                            httpOnly: true,
                            sameSite: "Lax",
                        })
                        : res.setCookie("Access_token", "/", {
                            domain: ".vietagold.com.vn",
                            path: "/",
                            maxAge: 21600, // 6 hours
                            httpOnly: true,
                            sameSite: "None",
                            secure: true, // Chỉ thiết lập secure nếu đang ở môi trường production
                        });
                    return res.status(200).send(
                        templateRespone(200, {
                            user: {
                                email: deleteUser.email,
                            },
                            message: "Delete account successful",
                        })
                    );
                }
                return res.status(500).send(
                    templateRespone(500, {
                        user: {},
                        message: "Delete account failed, please try again later",
                    })
                );
            }
            return res.status(400).send(
                templateRespone(400, {
                    user: {},
                    message: "OTP is incorrect or has expired, please try again later",
                })
            );
        } catch (error) {
            console.error("delete account", error);
            return res.status(500).send(
                templateRespone(500, {
                    error: error,
                })
            );
        }
    } else {
        return res.status(405).send({ error: "Method Not Allowed" });
    }
};

const CheckPassword = async (req, res) => {
    if (req.method === "POST") {
        try {
            const { password } = req.body;
            if (password) {
                return res.status(400).send({ error: "Do not leave any empty fields" });
            }
            const respone = await UserModel.ChangePassword(
                req.user.id,
                sha256(password)
            );
            return res.status(200).send(
                templateRespone(200, {
                    password: respone,
                })
            );
        } catch (error) {
            console.error("CheckPassword", error);
            return res.status(500).send(
                templateRespone(500, {
                    error: error,
                })
            );
        }
    } else {
        return res.status(405).send({ error: "Method Not Allowed" });
    }
};

module.exports = {
    register,
    login,
    checkAuth,
    logout,
    changePassword,
    registerAccumulate,
    verifyAccount,
    refreshUserData,
    UpdateUserData,
    ForgotPassword,
    ForgotPasswordOtp,
    ForgotPasswordCheckOtp,
    DeleteAccount,
    CheckPassword,
};