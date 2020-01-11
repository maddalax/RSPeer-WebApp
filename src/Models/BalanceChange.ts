import {User} from "./User";

export interface BalanceChange {
    timestamp : string;
    oldBalance : number;
    newBalance : number;
    difference : number;
    isAdd : boolean
    orderId : number;
    reason : number
    adminUser? : User
    adminUserId? : number;
}