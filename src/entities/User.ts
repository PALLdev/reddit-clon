import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, ObjectType } from "type-graphql";

@ObjectType()
@Entity()
export class User {
  @Field()
  @PrimaryKey()
  id!: number;

  @Field(() => String)
  @Property({ type: "date" })
  createdAt = new Date();

  @Field(() => String)
  @Property({ type: "date", onUpdate: () => new Date() })
  updatedAt = new Date();

  @Field()
  @Property({ type: "text", unique: true }) // no se puede repetir el mail
  email!: string;

  @Field()
  @Property({ type: "text", unique: true }) // no se puede repetir el username
  username!: string;

  @Property({ type: "text" }) // sin decorador field, no permito el acceso al password
  password!: string;
}
