export class Util {

    public static async sleep(length : number) {
        return await new Promise(res => setTimeout(res, length))
    }

}