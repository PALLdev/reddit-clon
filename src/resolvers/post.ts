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
    @Mutation(() => Post)                               // graphql type se infiere segun el TS type    (retorno un post)               
    async createPost(
        @Arg('title') title: String,                      // paso parametros q necesito para crear un nuevo post
        @Ctx() {em}: MyContext                                 
    ): Promise<Post> {                                   // TS type
        const post = em.create(Post, { title });
        await em.persistAndFlush(post);
        return post;
    }

    // Query para el update (update title by ID)
    @Mutation(() => Post, { nullable: true })                               // graphql type (retorno un post o null)               
    async updatePost(
        @Arg('id') _id: number,                                             // paso parametros (argumentos) necesarios para editar un post
        @Arg('title', () => String, { nullable: true } ) title: string,
        @Ctx() {em}: MyContext                                 
    ): Promise<Post | null> {                                               // TS type
        const post = await em.findOne(Post, {_id});                         // fetch the post (obtengo un post segun su id para editar)
        if(!post){                                                          // valido por si no puedo encontrar el post
            return null;
        }
        if(typeof title !== 'undefined') {                                  // valido que me entreguen un input valido (que no este en blanco por ej)
            post.title = title;                                             // update el nuevo title
            await em.persistAndFlush(post);
        }
        return post;
    }

    // Query para el delete
    @Mutation(() => Boolean)                               // retorno un boolean ya que no necesito ver info del post despues de borrado                  
    async deletePost(
        @Arg('id') _id: number,                      // paso parametros q necesito para crear un nuevo post
        @Ctx() {em}: MyContext                                 
    ): Promise<boolean> {                                   // TS type
        await em.nativeDelete(Post, { _id });
        return true;
    }

}