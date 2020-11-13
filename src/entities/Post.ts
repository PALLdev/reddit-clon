import { Entity, PrimaryKey, Property } from "@mikro-orm/core";


@Entity()
export class Post {
//cada @ desde aqui es una columna de mi tabla
  @PrimaryKey()
  _id!: number;

  @Property({type: 'date'})
  createdAt = new Date();

  @Property({ type: 'date' ,onUpdate: () => new Date() })
  updatedAt = new Date();

  @Property({type: 'text'})
  title!: string;
    
}