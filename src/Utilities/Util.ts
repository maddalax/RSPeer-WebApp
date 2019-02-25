export class Util {

    public static async sleep(length : number) {
        return await new Promise(res => setTimeout(res, length))
    }

    public static formatNumber(number : string) {
        return !number ? number : number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

}