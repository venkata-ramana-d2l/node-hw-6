import { Collection, Entity, ManyToOne, OneToMany, OneToOne, PrimaryKey, Property } from "@mikro-orm/core";
import { User } from "./user";
import { Product } from "./product";
import { Order } from "./order";

@Entity()
export class Cart {
    @PrimaryKey({type: 'uuid'})
    id!: string;

    @OneToOne({ mappedBy: 'cart', orphanRemoval: true })
    user!: User

    @Property()
    isDeleted!: boolean

    @OneToMany('Product', 'id')
    items = new Collection<Product>(this)

    constructor(isDeleted: boolean) {
        this.isDeleted = isDeleted;
    }

}