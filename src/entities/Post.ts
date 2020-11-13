import { Entity, PrimaryKey, SerializedPrimaryKey, Property } from "@mikro-orm/core";


@Entity()
export class Post {
//cada @ desde aqui es una columna de mi tabla
  @PrimaryKey()
  _id!: number;

  @SerializedPrimaryKey()
  id!: string;

  @Property()
  createdAt = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt = new Date();

  @Property()
  title!: string;
    
}