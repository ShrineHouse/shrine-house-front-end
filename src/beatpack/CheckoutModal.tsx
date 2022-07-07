import React, { useState } from "react";

import { CircularProgress } from "@chakra-ui/react";
import JsFileDownloader from "js-file-downloader";
import BeatPack from "../interfaces/beats";
import {
    MoralisObjectSaveData,
    useMoralis,
    useNewMoralisObject,

} from "react-moralis";
import { DbUser } from "../interfaces/users";
import factory from "../Eth/factory";
import { v4 as uuidv4 } from 'uuid';
import { AiOutlineCheckCircle } from 'react-icons/ai'
import Heading1 from "../components/general/Heading1";
import { Divider } from "../components/general/Divider";

//checkout modal
export function CheckoutModal(props: {
    bp: BeatPack;
    producer: DbUser;
    matic: any;
    Moralis: any;
    transfer: any;
    closeModal: Function;
}) {
    const [transferDone, setTransferStatus] = useState(false);
    const { user } = useMoralis();
    const [nameValue, setNameValue] = useState(`${props.producer.fullName} X ${(user as any).attributes.fullName}`)
    const { save } = useNewMoralisObject('muses');
    const [minted, setMinted] = useState(false);
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
            const artistRoyalties = (event.target as any)[0].value;
            const nftName = (event.target as any)[1].value;
            const nftPrice = (event.target as any)[2].value;
            const nftEditions = (event.target as any)[3].value;
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
                        setMinted(true)
                        setLoading(false)

                    }

                })
            })
        }
    }
    if (minted) {
        return (

            <div className=" modalWidth my-5 px-5">

                <div className="flex flex-col justify-center items-center gap-5">
                    <AiOutlineCheckCircle size={84} color='green' />
                    <h2 className="text-3xl text-center font-bold">Mint Succesful</h2>
                    <h2 className="text-xl text-center -mt-2 ">Your NFT has succesfully been minted. Head over to the Muse Feed to view your NFT.</h2>
                    <button className="primaryButton" onClick={() => {
                        props.closeModal()
                        setMinted(false)
                    }}
                    >Close</button>
                </div>
            </div>

        )
    }

    if (transferDone && user !== null) {
        return (
            <div className=" modalWidth modalHeight my-5">
                <div
                    className="top-0 right-0 text-xl absolute z-50 text-gray-600 pt-5 pr-5 cursor-pointer"
                    onClick={() => props.closeModal()}
                >
                    close
                </div>
                <form
                    onSubmit={(event) => {
                        mintNft(event);
                    }}
                >
                    <div className="flex flex-col gap-3">
                        <h2 className="text-3xl text-center font-bold">Mint your NFT</h2>
                        <div className="divider  mb-10"></div>
                        <div className="mx-auto">
                            <img
                                src={props.bp.imageUrl}
                                className=" object-cover h-32 w-32 rounded-xl"
                            />
                        </div>
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
                        <div className="flex flex-row justify-between w-full items-center">
                            <div className="flex flex-row gap-5">
                                <div className="flex flex-col justify-center">
                                    <div className="font-bold primaryColor text-2xl">
                                        {props.producer.fullName}
                                    </div>
                                    <div className="font-bold text-xl">
                                        {props.bp.beatPackName}
                                    </div>
                                    <div className=" text-gray-400">
                                        royalties: {props.bp.royaltyIndex}%
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col justify-center items-end">
                                <div
                                    className="primaryButton bg-gray-500 text-white cursor-pointer"
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
        );
    }

    return (
        <div className="flex flex-col">
            <Heading1 text='Complete Checkout' />
            <div className="flex flex-row w-full justify-between mt-10">
                <div className="font-semibold">Item</div>
                <div className="font-semibold">Total</div>
            </div>
            <Divider />
            <div className="flex flex-row justify-between w-full items-center mt-3">
                <div className="flex flex-row gap-5">
                    <img
                        src={props.bp.imageUrl}
                        className=" object-cover h-24 w-24 rounded-xl"
                    />
                    <div className="flex flex-col justify-center">
                        <div className="font-bold primaryColor text-xl">
                            {props.bp.beatPackName}
                        </div>
                        <div className="font-semibold text-lg">
                            {props.producer.fullName}
                        </div>
                        <div className=" text-gray-400">
                            royalties: {props.bp.royaltyIndex}%
                        </div>
                    </div>
                </div>
                <div className="flex flex-col justify-center items-end">
                    <div className="font-bold text-2xl">${props.bp.beatPackPrice}</div>
                    <div className="text-gray-400">
                        Matic:{" "}
                        {props.matic.data === null
                            ? 0
                            : Math.round(props.bp.beatPackPrice / props.matic.data.usdPrice)}
                    </div>
                </div>
            </div>
            <Divider />
            <button
                className="primaryButton mt-10"
                onClick={() => {
                    //Authenticate, if complete init transfer of funds

                    setTransferStatus(true);
                }}>
                Confirm checkout
            </button>
        </div>
    );
}
