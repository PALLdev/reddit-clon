import { MikroORM } from '@mikro-orm/core';
import { __prod__ } from './constants';
import { Post } from './entities/Post';
import  microConfig  from './mikro-orm.config';

const main = async () => {
    const orm = await MikroORM.init(microConfig);                           // conect to a database
    await orm.getMigrator().up();                                           // run migrations automatically
    const post = orm.em.create(Post, {title: 'MI PRIMER POST'});            // run sql 
    await orm.em.persistAndFlush(post);
};
    //ejecuto main y capturo los errores
main().catch((err) => {
   console.error(err); 
});