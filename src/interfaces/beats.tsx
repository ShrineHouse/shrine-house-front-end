export default interface BeatPack {
    objectId: string;
    createdAt: string;
    updatedAt: string;
    artistName: string;
    beatPackName: string;
    beatPackPrice: number;
    beatPackUrl: string;
    beats: Beat[];
    imageUrl: string;
    royaltyIndex: number;
    downloads: number;
    genre: string;
}

export interface Beat {
    beatArtist: string;
    beatDownloadUrl: string;
    beatPrice: number;
    beatUrl: string;
    royaltyIndex: number;
}
