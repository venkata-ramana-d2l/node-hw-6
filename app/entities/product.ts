import { Entity, ManyToOne, PrimaryKey, Property } from "@mikro-orm/core";
import { Cart } from "./cart";

@Entity()
export class Product {
    @PrimaryKey({ type: 'uuid' })
    id!: string;

    @Property({ type: 'string' })
    title!: string;

    @Property({ type: 'string' })
    description!: string;

    @Property({ type: 'numeric' })
    price!: number;

    @ManyToOne()
    cart!: Cart

    constructor(title: string, description: string, price: number) {
        this.title = title;
        this.description = description;
        this.price = price;
    }

}