export class Util {

    public static async sleep(length: number) {
        return await new Promise(res => setTimeout(res, length))
    }

    public static formatNumber(number: string) {
        return !number ? number : number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    public static formatDate(value : string, includeTime : boolean = false) {
        const date = new Date(value);
        return includeTime ? date.toLocaleString() : date.toDateString();
    };

    public static toCamel(o: any) {
        let newO : any, origKey, newKey, value;
        if (o instanceof Array) {
            newO = [];
            for (origKey in o) {
                value = o[origKey]
                if (typeof value === "object") {
                    value = Util.toCamel(value)
                }
                newO.push(value)
            }
        } else {
            newO = {};
            for (origKey in o) {
                if (o.hasOwnProperty(origKey)) {
                    newKey = (origKey.charAt(0).toLowerCase() + origKey.slice(1) || origKey).toString()
                    value = o[origKey]
                    if (value instanceof Array || value != null && value.constructor === Object) {
                        value = Util.toCamel(value)
                    }
                    newO[newKey] = value
                }
            }
        }
        return newO
    };

}