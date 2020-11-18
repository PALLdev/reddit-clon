import { User } from "../entities/User";
import { MyContext } from "src/types";
import { Arg, Ctx, Field, InputType, Mutation, ObjectType, Resolver } from "type-graphql";
import argon2 from "argon2";

@InputType()
class UsernamePasswordInput {
    @Field()
    username: string

    @Field()
    password: string
}

@ObjectType()
class FieldError { 

    @Field()
    field: string       // catches if there's an error with a particular field
    @Field()
    message: string     // error message (user friendly)
}

@ObjectType()
class UserResponse {                                      // retorna un user si funciono bien o retorna errores si es que los hay
    @Field(() => [FieldError], { nullable: true })       // paso el type explicitamente ya que quiero trabajar con nulls
    errors?: FieldError[]

    @Field(() => User, { nullable: true } )
    user?: User
}


@Resolver()
export class UserResolver {
        // Registrar user
    @Mutation(() => UserResponse)
    async register(
        @Arg('options') options: UsernamePasswordInput,
        @Ctx() {em}: MyContext 
    ): Promise<UserResponse> {
        if(options.username.length <= 2) {                                      // algunas validaciones para inputs
            return {
                errors: [
                    {
                    field: 'username',
                    message: 'El username debe tener minimo 3 caracteres.'
                    },
                ],
            };
        }

        if(options.password.length <= 3){
            return {
                errors: [
                    {
                    field: 'password',
                    message: 'La contraseña debe tener minimo 4 caracteres.'
                    },
                ],
            };
        }

        const hashedPassword = await argon2.hash(options.password);     // modificando password a hash para seguridad en la DB
        const user = em.create(User, {
            username: options.username,                                 // objeto que vamos a enviar a la DB
            password: hashedPassword
         });
        await em.persistAndFlush(user)
        return {user};                                               // Userresponse retorna un objeto
    }

        // Login User
    @Mutation(() => UserResponse)
    async login(
        @Arg('options') options: UsernamePasswordInput,
        @Ctx() {em}: MyContext 
    ): Promise<UserResponse> {
        const user = await em.findOne(User, { username: options.username });

        if(!user) {         // error expectected if we cant get a user from the DB
            return {
                errors: [
                    {
                    field: 'username',
                    message: 'Este username no existe'
                    },
                ],
            };
        }

        const validPassword = await argon2.verify(user.password, options.password);         // valido la pass con el hash
        if(!validPassword) {
            return {
                errors: [
                    {
                    field: 'password',
                    message: 'La contraseña no coincide, verifique'
                    },
                ],
            };
        }
            return {                // si ambos datos son validos retorno el user
                user,
            }
        }
    }