export default interface DbUser {
    apy:         Apy;
    type:        string;
    balance:     number;
    dateOfBirth: DateOfBirth;
    email:       string;
    fullName:    string;
    image:       string;
    legalName:   string;
    phoneNumber: string;
    passphrase:  string[];
    socials:     Socials;
    wallet:      string;
    verified:    boolean;
}

export interface Apy {
    apyArtist: number;
    popArist: number;
    totalStaked: number;
}

export interface DateOfBirth {
    __type: string;
    iso:    string;
}

export interface Socials {
    instagram: string;
    twitter:   string;
    spotify:   string;
}
