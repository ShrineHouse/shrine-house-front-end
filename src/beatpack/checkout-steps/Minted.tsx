import React from 'react'
import { AiOutlineCheckCircle } from 'react-icons/ai'
import { BodyLink } from '../../components/general/BodyLink'
import Heading1 from '../../components/general/Heading1'
import BeatPack from '../../interfaces/beats'

export const Minted = (props: { bp: BeatPack }) => {
    return <div className="flex flex-col gap-5 text-left">
        <div className="flex flex-row gap-5 items-center w-full">
            <Heading1 text='Congrats!' />
            <AiOutlineCheckCircle size={50} className="primaryColor" />
        </div>

        <h2 className="text-xl text-left -mt-2 ">You are now the owner of <span className="font-bold">{props.bp.beatPackName}</span></h2>
        <img
            src={props.bp.imageUrl}
            className=" object-cover h-32 w-32 rounded-xl"
        />
        <div className="flex flex-row">
            <p>Checkout your freshly minted &nbsp;</p>

            <BodyLink text="NFT" />.
        </div>
    </div>
}