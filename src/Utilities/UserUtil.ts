export class UserUtil {

    public static getSession() : string | null {
        return localStorage.getItem("rspeer_session") || sessionStorage.getItem("rspeer_session")
    }

}