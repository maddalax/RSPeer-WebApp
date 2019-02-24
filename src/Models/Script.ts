export interface Script {
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
}

export const ScriptTypes : any = {
    'mine' : "Mine",
    'premium' : "Premium",
    "free" : "Free",
};

export const ScriptOrderBy : any = {
    'featured' : 'Featured',
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