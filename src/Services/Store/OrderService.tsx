import {ApiService} from "../../Common/ApiService";
import {Alert} from "../../Utilities/Alert";
import {Order} from "../../Models/Order";
import {Util} from "../../Utilities/Util";
import React from "react";

export class OrderService {
    
    private api : ApiService;
    
    constructor(api : ApiService = new ApiService()) {
        this.api = api;
    }
    
    showOrder = async (id : number) => {
        const res = await this.api.get("order/get?id=" + id);
        if(!res || res.error) {
            Alert.show("Failed to load order.");
            return;
        }
        const order = res as Order;
        Alert.modal({
            title : `Order ${id}`,
            width : '50',
            body : <div>
                <p>Item Name: <strong>{order.item && order.item.name}</strong></p>
                <p>Item Description: <strong>{order.item && order.item.description}</strong></p>
                <p>Status: <strong>{order.statusFormatted}</strong></p>
                <p>Is Refunded: <strong>{order.isRefunded ? 'Yes' : 'No'}</strong></p>
                <p>Total: <strong>{Util.formatNumber(order.total.toString())}</strong></p>
                <p>Quantity: <strong>{Util.formatNumber(order.quantity.toString())}</strong></p>
                <p>Date: <strong>{Util.formatDate(order.timestamp.toString(), true)}</strong></p>
            </div>
        })
    };
    
}