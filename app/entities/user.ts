import { Collection, Entity, OneToMany, OneToOne, PrimaryKey } from "@mikro-orm/core";
import { Cart } from "./cart";
import { Order } from "./order";

@Entity()
export class User {
    @PrimaryKey({type: 'uuid'})
    id!: string;

    @OneToOne()
    cart!: Cart

    @OneToMany('Order', 'user')
    orders = new Collection<Order>(this);
}