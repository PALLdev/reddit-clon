"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRegister = void 0;
exports.validateRegister = (options) => {
    if (options.username.length <= 2) {
        return [
            {
                field: "username",
                message: "El username debe tener minimo 3 caracteres.",
            },
        ];
    }
    if (options.password.length <= 3) {
        return [
            {
                field: "password",
                message: "La contraseña debe tener minimo 4 caracteres.",
            },
        ];
    }
    if (options.username.includes("@")) {
        return [
            {
                field: "username",
                message: "El nombre de usuario no puede incluir un @.",
            },
        ];
    }
    if (!options.email.includes("@")) {
        return [
            {
                field: "email",
                message: "Debes ingresar un email valido.",
            },
        ];
    }
    return null;
};
//# sourceMappingURL=validateRegister.js.map