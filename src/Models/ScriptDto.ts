export interface ScriptDto {
    id:                number;
    name:              string;
    version:           number;
    author:            string;
    description:       string;
    category:          number;
    categoryFormatted: string;
    lastUpdate:        Date;
    fileSize:          number;
    totalUsers:        number;
    price:             number;
    priceFormatted:    string;
    typeFormatted:     string;
    type:              ScriptType;
    doesUserOwn:       boolean;
    instances:         number;
    forumThread:       string;
    statusFormatted:   string;
    repositoryUrl : string;
    status: ScriptStatus;
}

export interface Script {
    id:            number;
    legacyId:      null | string;
    userId:        number;
    user:          null;
    name:          string;
    description:   string;
    version:       number;
    type:          number;
    status:        number;
    price:         number | null;
    instances:     null;
    maxUsers:      null;
    category:      number;
    forumThread:   string;
    repositoryUrl: null | string;
    dateAdded:     Date;
    lastUpdate:    Date;
    totalUsers:    number;
    scriptContent: null;
}

export interface ScriptAccessDto {
    id : number;
    userId : number;
    orderId : number;
    timestamp : string;
    expiration? : string;
    isExpired : boolean;
    recurring : boolean;
    instances? : number;
    script : ScriptDto;
}

export interface ScripterInfo {
    gitlabUsername : string;
    gitlabUserId : string;
    gitlabGroupId : string;
    gitlabGroupPath : string;
    dateAdded : string
}


export const ScriptTypes : any = {
    'mine' : "Mine",
    'premium' : "Premium",
    "free" : "Free",
};

export const ScriptOrderBy : any = {
    'featured' : 'Most Popular (24 Hours)',
    'featuredAllTime' : 'Most Popular (30 Days)',
    'newest' : 'Newest',
    'users' : 'Users',
    'alphabetical' : 'Alphabetical',
    'lastUpdated' : 'Last Update'
};

export const ScriptCategories = [
    'All', 'Agility', 'Combat', 'Construction', 'Cooking', 'Crafting', 'Farming', 'Firemaking',
    'Fishing', 'Fletching', 'Herblore', 'Hunter', 'Magic', 'Minigames','Mining', 'Money Making',
    'Other', 'Prayer', 'Runecrafting', 'Smithing', 'Thieving', 'Woodcutting', 'Questing'
];

export enum ScriptType {
    Free,
    Vip,
    PremiumTrial,
    Premium,
    Private,
    Mine
}

export enum ScriptStatus
{
    Pending,
    Live,
    Denied
}