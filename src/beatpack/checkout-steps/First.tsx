import * as React from 'react';

import { Divider } from "../../components/general/Divider";
import Heading1 from "../../components/general/Heading1";
import BeatPack from "../../interfaces/beats";
import { DbUser } from "../../interfaces/users";

export const FirstCheckout = (props: { bp: BeatPack, producer: DbUser, matic: any, setTransferStatus: Function }) => {
    return (<div className="flex flex-col">
        <Heading1 text='Complete Checkout' />
        <div className="flex flex-row w-full justify-between mt-10">
            <div className="font-semibold">Item</div>
            <div className="font-semibold">Total</div>
        </div>
        <Divider />
        <div className="flex flex-row justify-between w-full items-center mt-3">
            <div className="flex flex-col md:flex-row gap-5">
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
            <div className="flex flex-col justify-start items-end">
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

                props.setTransferStatus(true);
            }}>
            Confirm checkout
        </button>
    </div>)
}