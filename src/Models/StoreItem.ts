export interface StoreItem {
    id:                  number;
    name:                string;
    description:         string;
    sku:                 string;
    price:               number;
    paymentMethod:       PaymentMethod;
    expirationInMinutes: number;
    expirationDays:      number;
    type:                ItemType;
}

export enum ItemType
{
    Tokens,
    ClientInstances,
    PremiumScript,
    Other
}

export enum PaymentMethod {
    Tokens,
    Paypal
}

export enum OrderStatus
{
    Created,
    Processing,
    Completed
}