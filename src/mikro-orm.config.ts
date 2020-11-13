import { __prod__ } from "./constants";
import { Post } from "./entities/Post";
import { MikroORM } from "@mikro-orm/core"

export default {
    entities: [Post],
    dbName: "reddit-clon",
    type: "postgresql", // one of `mongo` | `mysql` | `mariadb` | `postgresql` | `sqlite`
    debug: !__prod__,
  } as Parameters<typeof MikroORM.init>[0];  // exporto el type que requiere el primer parametro de func init en index.ts