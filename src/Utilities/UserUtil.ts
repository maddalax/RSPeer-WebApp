import {User} from "../Models/User";

export class UserUtil {

    public static getSession() : string | null {
        return localStorage.getItem("rspeer_session") || sessionStorage.getItem("rspeer_session")
    }

    public static getAccessKey() : string | null {
        return localStorage.getItem("dashboard_access_key");
    }

    public static hasInuvation(user : User) : boolean {
        return user && user.groupNames.find((s: string) => s === 'Inuvation' || s === "Inuvation Maintainers") != null;
    }
    
}