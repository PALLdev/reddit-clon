import 'reflect-metadata';
import { MikroORM } from '@mikro-orm/core';
import { __prod__ } from './constants';
import  microConfig  from './mikro-orm.config';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { HelloResolver } from './resolvers/hello';
import { PostResolver } from './resolvers/post';

const main = async () => {
    const orm = await MikroORM.init(microConfig);                           // conect to a database
    await orm.getMigrator().up();                                           // run migrations automatically

    const app = express();
    const port = 4000;
    // app.get("/", (_, res) => {                           // rest endpoint solo para probar que el server funciona
    //     res.send("HOLA");
    // });

    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [HelloResolver, PostResolver],
            validate: false,                                 // turning off validation, that uses package Class validator(o algo asi)
        }),
        context: () => ({                                   // context is accesible from all resolvers
            em: orm.em                                      // em contains the data on my database instance
        }),
    });

    apolloServer.applyMiddleware({ app });                  // creating the graphQL endpoint on express

    app.listen(port, () => {
        console.log(`Server corriendo en localhost:${port}`)
    });

    // const post = orm.em.create(Post, {title: 'MI PRIMER POST'});            // run sql 
    // await orm.em.persistAndFlush(post);
};
    //ejecuto main y capturo los errores
main().catch((err) => {
   console.error(err); 
});