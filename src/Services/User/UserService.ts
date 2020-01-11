export class UserService {

    public static setSession = (token : string) => {
        localStorage.removeItem("session");
        localStorage.setItem("rspeer_session", token);
    };
    
}