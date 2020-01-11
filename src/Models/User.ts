export interface User {
    id : number;
    balance : number;
    email : string;
    groups : UserGroup[],
    groupNames : string[],
    isEmailVerified : boolean,
    isOwner : boolean,
    linkKey : boolean,
    username : string
    disabled : boolean,
    discordAccount? : DiscordAccount
}

export interface DiscordAccount {
    discordUsername : string;
    discriminator : string;
    dateVerified : string;
}

export interface UserGroup {
    description : string,
    name : string
}

export enum AddRemove {
    Unknown,
    Add,
    Remove
}