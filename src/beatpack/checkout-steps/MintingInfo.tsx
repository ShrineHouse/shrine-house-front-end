import { CircularProgress } from '@chakra-ui/react';
import React, { useState } from 'react'
import { MoralisObjectSaveData, useMoralis, useNewMoralisObject } from 'react-moralis';
import { Divider } from '../../components/general/Divider';
import Heading1 from '../../components/general/Heading1';
import factory from '../../Eth/factory';
import BeatPack from '../../interfaces/beats';
import { DbUser } from '../../interfaces/users';
import { v4 as uuidv4 } from 'uuid';
import JsFileDownloader from 'js-file-downloader';

export const MintingInfo = (props: { bp: BeatPack, producer: DbUser, setMinted: Function }) => {
    const { user } = useMoralis();
    const { save } = useNewMoralisObject('muses');
    const [nameValue, setNameValue] = useState(`${props.producer.fullName} X ${(user as any).attributes.fullName}`)
    const [loading, setLoading] = useState(false);

    function onDownload() {
        new JsFileDownloader({
            url: props.bp.beatPackUrl,
            filename: `${props.bp.beatPackName}.zip`
        });
    }
    const myAsync = async (
        name: string,
        symbol: string,
        URI: string,
        producerRoyalty: number,
        artistRoyalty: number,
        artist: string,
        cost: string,
        maxSupply: string
    ): Promise<any> => {
        if (user !== null) {
            setLoading(true)
            let response = await factory.methods
                .createBeatpack(
                    name,
                    symbol,
                    URI,
                    producerRoyalty,
                    artistRoyalty,
                    artist,
                    cost,
                    maxSupply
                )
                .send({
                    from: user.attributes.wallet,
                });
            return response;
        }
    };


    async function mintNft(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        ////Mint the NFT here
        if (user !== null) {
            const artistWallet = user.attributes.wallet;
            const producerWallet = props.producer.wallet;
            const producerRoyalties = props.bp.royaltyIndex;
            const nftName = (event.target as any)[0].value;

            const artistRoyalties = (event.target as any)[1].value;
            const nftPrice = (event.target as any)[2].value;
            const nftEditions = (event.target as any)[3].value;

            console.log('roy', artistRoyalties, 'price', nftPrice, 'edit', nftEditions)
            const ticker = "Shrine";
            const URI = `ipfs://QmQdPYTY8yArgVmMJK319e75rsi91bwtUF5JsSF9CLnEYe/`;

            ///ADD THIS VALUE TO THE CONTRACT
            const nftUUID = uuidv4();

            await myAsync(
                nftName,
                ticker,
                URI,
                producerRoyalties,
                artistRoyalties,
                artistWallet,
                nftPrice,
                nftEditions
            ).then(() => {

                let uploadData: MoralisObjectSaveData = {
                    minter: user.attributes.fullName,
                    producer: props.producer.fullName,
                    minterWallet: artistWallet,
                    producerWallet: producerWallet,
                    ////NFTADDRESS SHOULD BE HERE
                    nftAddress: "0x000",
                    image: props.bp.imageUrl,
                    nftName: nftName,
                    minterImage: user.attributes.image,
                    claimed: 0,
                    nftUUID: nftUUID,
                    nftData: {
                        nftName: nftName,
                        ticker: ticker,
                        URI: URI,
                        producerRoyalties: producerRoyalties,
                        artistRoyalties: artistRoyalties,
                        artistWallet: artistWallet,
                        nftPrice: nftPrice,
                        nftEditions: nftEditions
                    }
                }

                ///This saves it to the DB
                save(uploadData, {
                    onError(error) {
                        alert('Your beatpack could not be uploaded')
                        setLoading(false)
                    },

                    onComplete: () => {
                        props.setMinted(true)
                        setLoading(false)

                    }

                })
            })
        }
    }

    return <div>

        <form
            onSubmit={(event) => {
                mintNft(event);
            }}
        >
            <div className="flex flex-col gap-3">
                <Heading1 text='Mint Your NFT' />
                <Divider />
                <div className="mx-auto">
                    <img
                        src={props.bp.imageUrl}
                        className=" object-cover h-24 w-24 rounded-xl"
                    />
                </div>
                <div className="flex flex-col">
                    <label>NFT Name</label>
                    <input
                        type="text"
                        id="nftName"
                        required={true}
                        placeholder="NFT Name"
                        className="inputFieldText"
                        onChange={(e) => setNameValue(e.target.value)}
                        value={nameValue}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="flex flex-col">
                        <label>Your royalty percentage</label>
                        <input
                            type="number"
                            max={12}
                            min={0}
                            id="royalty"
                            required={true}
                            placeholder="Royalty split"
                            className="inputFieldText"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label>NFT price</label>
                        <input
                            type="number"
                            id="nftprice"
                            required={true}
                            placeholder="Price in USD"
                            className="inputFieldText"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label>NFT editions</label>
                        <input
                            type="number"
                            id="nfteditions"
                            required={true}
                            placeholder="Amount of editions"
                            className="inputFieldText"
                        />
                    </div>
                </div>

                <Divider />
                <div className="flex flex-col md:flex-row justify-between w-full items-start md:items-center">
                    <div className="flex flex-col md:flex-row gap-5">
                        <div className="flex flex-col justify-center">
                            <div className="font-bold primaryColor text-2xl">
                                {props.bp.beatPackName}
                            </div>
                            <div className="font-semibold text-xl">
                                {props.producer.fullName}
                            </div>
                            <div className=" text-gray-400">
                                royalties: {props.bp.royaltyIndex}%
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col w-full md:justify-center md:items-end">
                        <div
                            className="primaryButton bg-gray-500 text-white text-center cursor-pointer"
                            onClick={() => {
                                onDownload();
                            }}
                        >
                            Download beats
                        </div>
                    </div>
                </div>
                <div className="divider mb-10"></div>
                {loading && <div className="mx-auto"><CircularProgress isIndeterminate /></div>}
                {!loading && <input type="submit" className="primaryButton mb-10" value="Mint NFT" />}
            </div>
        </form>
    </div>
}