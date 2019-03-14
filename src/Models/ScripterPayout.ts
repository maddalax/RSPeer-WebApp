import {User} from "./User";
import {Script} from "./ScriptDto";
import {Item, Order} from "./Order";

export interface ScripterPayoutDto {
    orders : Order[],
    scripter : User,
    scripts : Script[],
    items : Item[],
    totalSales : number,
    amountToPayout : number,
    refundedOrderCount : number,
    refundedOrderTotal : number
    staffPurchasesTotal : number,
    staffPurchases : number
}