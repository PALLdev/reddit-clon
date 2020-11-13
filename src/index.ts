import { MikroORM } from '@mikro-orm/core';
import { __prod__ } from './constants';
import { Post } from './entities/Post';
import  microConfig  from './mikro-orm.config';

const main = async () => {
    const orm = await MikroORM.init(microConfig);

    const post = orm.em.create(Post, {title: 'MI PRIMER POST!'});
    await orm.em.persistAndFlush(post);
    console.log('---------LO QUE DEVUELVE:  ' +post);
};
    //ejecuto main y capturo los errores
main().catch((err) => {
   console.log(err); 
});