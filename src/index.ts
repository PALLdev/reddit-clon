import { MikroORM } from '@mikro-orm/core';
import { __prod__ } from './constants';
import { Post } from './entities/Post';
import  microConfig  from './mikro-orm.config';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { HelloResolver } from './resolvers/hello';

const main = async () => {
    const orm = await MikroORM.init(microConfig);                           // conect to a database
    await orm.getMigrator().up();                                           // run migrations automatically

    const app = express();

    // app.get("/", (_, res) => {                           // rest endpoint solo para probar que el server funciona
    //     res.send("HOLA");
    // });

    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [HelloResolver],
            validate: false                                 // turning off validation, that uses package Class validator(o algo asi)
        }),
    });

    apolloServer.applyMiddleware({ app });                  // creating the graphQL endpoint on express

    app.listen(4000, () => {
        console.log('Server corriendo en localhost:4000')
    });

    // const post = orm.em.create(Post, {title: 'MI PRIMER POST'});            // run sql 
    // await orm.em.persistAndFlush(post);
};
    //ejecuto main y capturo los errores
main().catch((err) => {
   console.error(err); 
});