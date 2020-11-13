import { Post } from "../entities/Post";
import { Ctx, Query, Resolver } from "type-graphql";
import { MyContext } from "src/types";

@Resolver()
export class PostResolver {
    @Query(() => [Post])                                            // setting the GraphQL type
    posts(@Ctx() {em}: MyContext): Promise<Post[]> {                // setting the TypeScript type
        return em.find(Post, {});
    }
}