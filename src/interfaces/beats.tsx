export default interface BeatPack {
    artistName: string;
    beatPackName: string;
    beatPackPrice: number;
    beatPackUrl: string;
    beats: Beat[];
    imageUrl: string;
    royaltyIndex: number;
    downloads: number;
    genre: string;
    description: string;
    ownerWallet: string;
    objectId: string;
}

export interface Beat {
    beatArtist: string;
    beatDownloadUrl: string;
    beatPrice: number;
    beatUrl: string;
    royaltyIndex: number;
    beatName: string;
}

export const emptyBp: BeatPack = {
    artistName: '',
    beatPackName: '',
    beatPackPrice: 0,
    beatPackUrl: '',
    beats: [],
    description: '',
    downloads: 0,
    genre: '',
    imageUrl: '', objectId: '',
    ownerWallet: '',
    royaltyIndex: 0
};