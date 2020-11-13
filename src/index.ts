import { MikroORM } from '@mikro-orm/core';
import { __prod__ } from './constants';
import { Post } from './entities/Post';

const main = async () => {
    const orm = await MikroORM.init({
        entities: [Post],       // tablas de mi base de datos
        dbName: 'reddit-clon',
        type: 'postgresql',
        // user: '',
        // password: '',
        debug: !__prod__,    //si no estoy en entorno de production quiero la opcion de debug
    });

    const post = orm.em.create(Post, {title: 'MI PRIMER POST!'});
    await orm.em.persistAndFlush(post);
    console.log('---------LO QUE DEVUELVE:  ' +post);
};
    //ejecuto main y capturo los errores
main().catch((err) => {
   console.log(err); 
});