import { __prod__ } from "./constants";
import { Post } from "./entities/Post";
import { MikroORM } from "@mikro-orm/core";
import path from "path";

export default {
    migrations: {
        path: path.join(__dirname, "./migrations"),     // path to the folder with migrations (editado para crear una correcta path absoluta usando la funcion path de NodeJS )
        pattern: /^[\w-]+\d+\.[tj]s$/,                  // regex pattern for the migration files (editado para ts y js)
    },
    entities: [Post],
    dbName: "reddit-clon",
    type: "postgresql", // one of `mongo` | `mysql` | `mariadb` | `postgresql` | `sqlite`
    user: "postgres",
    password: "password",
    debug: !__prod__
  } as Parameters<typeof MikroORM.init>[0];  // exporto el type que requiere el primer parametro de func init en index.ts