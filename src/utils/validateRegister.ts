import { UsernamePasswordInput } from "./UsernamePasswordInput";

// validateRegister returns an array of errors (doesnt care about the shape of the response)
export const validateRegister = (options: UsernamePasswordInput) => {
  if (options.username.length <= 2) {
    // validacion para el largo minimo del nombre de usuario
    return [
      {
        field: "username",
        message: "El username debe tener minimo 3 caracteres.",
      },
    ];
  }
  // validacion para el largo minimo del password
  if (options.password.length <= 3) {
    return [
      {
        field: "password",
        message: "La contraseña debe tener minimo 4 caracteres.",
      },
    ];
  }
  // validacion adicional para el username
  if (options.username.includes("@")) {
    return [
      {
        field: "username",
        message: "El nombre de usuario no puede incluir un @.",
      },
    ];
  }
  // validacion email
  if (!options.email.includes("@")) {
    return [
      {
        field: "email",
        message: "Debes ingresar un email valido.",
      },
    ];
  }
  return null; // retorno null si ningun error fue encontrado
};
