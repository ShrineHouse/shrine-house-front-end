
export interface Muse{
    minter: string;
    producer: string;
    minterWallet: string;
    producerWallet: string;
    nftAddress: string;
    image: string;
    nftName: string;
    nftData: NFTData;
    claimed: number;
    minterImage: string;
    id: string;
    createdAt: Date;
}

export interface NFTData{
    nftName:string;
    ticker: string;
    URI: string;
    producerRoyalties:number;
    artistRoyalties:number;
    artistWallet:number;
    nftPrice:number;
    nftEditions:number;
}