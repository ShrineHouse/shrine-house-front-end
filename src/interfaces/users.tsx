export interface DbUser {
    apy: Apy;
    type: string;
    balance: number;
    dateOfBirth: string;
    email: string;
    fullName: string;
    image: string;
    legalName: string;
    phoneNumber: string;
    passphrase: string[];
    socials: Socials;
    wallet: string;
    verified: boolean;
    genre: string;
}

export interface Apy {
    apyArtist: number;
    popArist: number;
    totalStaked: number;
}

export interface DateOfBirth {
    __type: string;
    iso: string;
}

export interface Socials {
    instagram: string;
    twitter: string;
    spotify: string;
}

export interface upUser {
    email: string, artistName: string, legalName: string, birth: string, type: string, genre: string
}
export interface upUserSocials {
    image: string, instagram: string, spotify: string, twitter: string
}

