import { Entity, ManyToOne, OptionalProps, PrimaryKey, Property } from "@mikro-orm/core";
import { User } from "./user";
import { Ref, Reference } from "@mikro-orm/core/entity";

@Entity()
export class Order {
    @PrimaryKey({ type: 'uuid' })
    id!: string;

    @ManyToOne(() => User, { primary: true, ref: true })
    user!: Ref<User>;

    @Property({ type: 'string' })
    comments!: string;

    @Property({ type: 'string' })
    status!: string

    @Property({ type: 'numeric' })
    total!: number;

    @Property({ type: 'string' })
    deliveryType!: string;

    @Property({ type: 'string' })
    address!: string;

    @Property({ type: 'string' })
    paymentType!: string;

    @Property({ type: 'string' })
    paymentAddress!: any;

    @Property({ type: 'string' })
    creditCard!: any;

    [OptionalProps]?: 'paymentAddress' | 'creditCard';

    constructor(userId: string, comments: string, status: string, total: number, deliveryType: string, address: string, paymentType: string, paymentAddress?: any, creditCard?: any) {
        this.comments = comments,
        this.status = status,
        this.total = total;
        this.deliveryType = deliveryType;
        this.address = address;
        this.paymentType = paymentType;
        this.paymentAddress = paymentAddress;
        this.creditCard = creditCard;
        this.user = Reference.createFromPK(User, userId);
    }
}