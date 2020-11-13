import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, ObjectType } from "type-graphql";

@ObjectType()
@Entity()
export class Post {
//cada @ desde aqui es una columna de mi tabla
  @Field()
  @PrimaryKey()
  _id!: number;

  @Field(() => String)
  @Property({type: 'date'})
  createdAt = new Date();

  @Field(() => String)
  @Property({ type: 'date' ,onUpdate: () => new Date() })
  updatedAt = new Date();

  @Field()                   // si quito el decorator field, ya no sera accesible desde mi schema graphQL (you can choose what you want to expose or hide on your graphQL schema )
  @Property({type: 'text'})
  title!: string;
    
}