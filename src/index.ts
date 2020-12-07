import "reflect-metadata";
import { MikroORM } from "@mikro-orm/core";
import { COOKIE_NAME, __prod__ } from "./constants";
import microConfig from "./mikro-orm.config";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";
import { MyContext } from "./types";
import session from "express-session";
import redis from "redis";
import conectRedis from "connect-redis";
import cors from "cors";

const main = async () => {
  const orm = await MikroORM.init(microConfig); // conect to a database
  await orm.getMigrator().up(); // run migrations automatically

  const app = express();
  const port = 4000;

  const RedisStore = conectRedis(session);
  const redisClient = redis.createClient();

  // app.get("/", (_, res) => {                           // rest endpoint solo para probar que el server funciona
  //     res.send("HOLA");
  // });

  // cors middleware para aplicarlos globalmente (in all routes)
  app.use(
    cors({
      origin: "http://localhost:3000",
      credentials: true,
    })
  );

  // Sesion-middleware
  app.use(
    session({
      name: COOKIE_NAME, // nombre de mi session cookie
      store: new RedisStore({
        // conectando session con Redis storage
        client: redisClient, // touch reinicia el tiempo de sesion si el user hizo una accion
        disableTouch: true, // desabilito ya que mi sesion estara siempre activa
      }),
      cookie: {
        // Specifing setting for the cookie
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 años
        httpOnly: true, // para seguridad, desde js (front-end) no puedes acceder al cookie
        sameSite: "lax", // predicting in csrf
        secure: __prod__, // cookie solo funciona en https (we use localhost so we only need this in production, if you have https obviously )
      },
      saveUninitialized: false, // para no guardar sesiones vacias, solo cuando necesite guardar datos
      secret: "secret", // firma secreta de mi session cookie
      resave: false, // evitar multiple pings a Redis
    })
  );

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver, UserResolver],
      validate: false, // turning off validation, that uses package Class validator(o algo asi)
    }),
    // context is accesible from all resolvers
    // em contains the data on my database instance, req res contain data from session
    context: ({ req, res }): MyContext => ({ em: orm.em, req, res }),
  });

  apolloServer.applyMiddleware({
    app,
    // apollo sets cors only for this route (necesito cors ya que cambie credentials a "include"), but i want my cors globally
    // cors: { origin: "http://localhost:3000" },
    cors: false,
  });

  // creating the graphQL endpoint on express
  app.listen(port, () => {
    console.log(`Server corriendo en localhost:${port}`);
  });

  // const post = orm.em.create(Post, {title: 'MI PRIMER POST'});            // run sql
  // await orm.em.persistAndFlush(post);
};
//ejecuto main y capturo los errores
main().catch((err) => {
  console.error(err);
});
