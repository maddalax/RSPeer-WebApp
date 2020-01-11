import {User} from "./User";

export interface Order {
    id:              number;
    userId:          number;
    user :           User;
    adminUserId:     null;
    paypalId:        null;
    total:           number;
    quantity:        number;
    isRefunded:      boolean;
    isPaidOut:       boolean;
    item:            Item;
    itemId:          number;
    timestamp:       Date;
    payoutDate:      null;
    status:          number;
    statusFormatted: string;
    recurring:       boolean;
    legacyId:        string;
}

export interface Item {
    id:                  number;
    name:                string;
    description:         string;
    sku:                 string;
    price:               number;
    feesPercent:         number;
    paymentMethod:       number;
    expirationInMinutes: number;
    type:                number;
}
