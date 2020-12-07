import { User } from "../entities/User";
import { MyContext } from "src/types";
import {
  Arg,
  Ctx,
  Field,
  InputType,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";
import argon2 from "argon2";
import { COOKIE_NAME } from "../constants";

@InputType()
class UsernamePasswordInput {
  @Field()
  username: string;

  @Field()
  password: string;
}

@ObjectType()
class FieldError {
  @Field()
  field: string; // catches if there's an error with a particular field
  @Field()
  message: string; // error message (user friendly)
}

@ObjectType()
class UserResponse {
  // retorna un user si funciono bien o retorna errores si es que los hay
  @Field(() => [FieldError], { nullable: true }) // paso el type explicitamente ya que quiero trabajar con nulls
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}

@Resolver()
export class UserResolver {
  // QUIEN SOY (SESION)
  @Query(() => User, { nullable: true })
  async me(@Ctx() { req, em }: MyContext) {
    // you are not logged in (si no hay userId en la sesion)
    if (!req.session.userId) {
      return null;
    }
    const user = await em.findOne(User, { id: req.session.userId });
    return user;
  }

  // REGISTRAR user
  @Mutation(() => UserResponse)
  async register(
    @Arg("options") options: UsernamePasswordInput,
    @Ctx() { em, req }: MyContext
  ): Promise<UserResponse> {
    if (options.username.length <= 2) {
      // algunas validaciones para inputs
      return {
        errors: [
          {
            field: "username",
            message: "El username debe tener minimo 3 caracteres.",
          },
        ],
      };
    }

    if (options.password.length <= 3) {
      return {
        errors: [
          {
            field: "password",
            message: "La contraseña debe tener minimo 4 caracteres.",
          },
        ],
      };
    }

    const hashedPassword = await argon2.hash(options.password); // modificando password a hash para seguridad en la DB
    const user = em.create(User, {
      username: options.username, // objeto que vamos a enviar a la DB
      password: hashedPassword,
    });

    try {
      await em.persistAndFlush(user); // username is unique in my DB, so i need to validate the duplicate error
    } catch (err) {
      if (err.code === "23505") {
        // duplicate username error code
        return {
          errors: [
            {
              field: "username",
              message: "Este username ya existe, prueba con otro.",
            },
          ],
        };
      }
    }
    // store user id session
    // this will set a cookie on the user
    // keep them logged in
    req.session.userId = user.id;
    req.session.keyFrase = "Funciona pasar datos!!";

    return { user }; // Userresponse retorna un objeto
  }

  // LOGIN User
  @Mutation(() => UserResponse)
  async login(
    @Arg("options") options: UsernamePasswordInput,
    @Ctx() { em, req }: MyContext
  ): Promise<UserResponse> {
    const user = await em.findOne(User, { username: options.username });
    if (!user) {
      return {
        // error expectected if we cant get a user from the DB (so its not registered)
        errors: [
          {
            field: "username",
            message: "Este username no existe",
          },
        ],
      };
    }

    const validPassword = await argon2.verify(user.password, options.password); // verifico la pass con el hash
    if (!validPassword) {
      // en que guardamos la password
      return {
        errors: [
          {
            field: "password",
            message: "La contraseña no coincide, verifique",
          },
        ],
      };
    }

    req.session.userId = user.id;

    return {
      // si ambos datos son validos retorno el user
      user,
    };
  }

  @Mutation(() => Boolean)
  logout(@Ctx() { req, res }: MyContext) {
    return new Promise((resolve) =>
      req.session.destroy((err: any) => {
        if (err) {
          console.log(err);
          resolve(false);
          return;
        }
        res.clearCookie(COOKIE_NAME);
        resolve(true);
      })
    );
  }
}
