import { Post } from "../entities/Post";
import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { MyContext } from "src/types";

@Resolver()
export class PostResolver {

        // Query para el Read
    @Query(() => [Post])                                            // setting the GraphQL type
    posts(@Ctx() {em}: MyContext): Promise<Post[]> {                // setting the TypeScript type
        return em.find(Post, {});
    }
        // Query para buscar por ID
    @Query(() => Post, { nullable: true })                      // graphql type retorna un post o null si no existe                   
    post(
        @Arg('id') _id: number,                      // 1er id cambia el nombre del parametro en el schema graphQL
        @Ctx() {em}: MyContext                                 
    ): Promise<Post | null> {                                   // TS type retorna un post o null si no existe
        return em.findOne(Post, { _id });
    }

    // Query para el create
    @Mutation(() => Post)                               // graphql type se infiere segun el TS type                   
    async createPost(
        @Arg('title') title: String,                      // paso parametros q necesito para crear un nuevo objeto
        @Ctx() {em}: MyContext                                 
    ): Promise<Post> {                                   // TS type
        const post = em.create(Post, { title });
        await em.persistAndFlush(post);
        return post;
    }
}