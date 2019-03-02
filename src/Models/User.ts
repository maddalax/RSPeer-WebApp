export interface User {
    id : number;
    balance : number;
    email : string;
    groups : UserGroup[],
    isEmailVerified : boolean,
    isOwner : boolean,
    linkKey : boolean,
    username : string
}

export interface UserGroup {
    description : string,
    name : string
}