export interface DbUser {
    createdAt?: Date;
    id: string;
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
    orders: number;
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

export const emptyUser: DbUser = {
    apy: {
        apyArtist: 0,
        popArist: 0,
        totalStaked: 0,
    },
    id: '',
    type: 'user',
    balance: 0,
    orders:0,
    dateOfBirth: 'No date',
    email: '',
    fullName: 'No name',
    image: '',
    legalName: 'No name',
    phoneNumber: '',
    passphrase: [],
    socials: {
        instagram: '',
        twitter: '',
        spotify: ''
    },
    wallet: '',
    verified: false,
    genre: 'No genre',

}