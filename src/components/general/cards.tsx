import React from 'react'
import { AiFillCheckCircle } from 'react-icons/ai';
import { IoSparklesSharp } from 'react-icons/io5';
import { Muse } from '../../interfaces/muse';

export const BigArtistCard = (props: { url: string }) => {
    return (
        <div className='w-full md:h-80 bg-white borderRadiusComponents shadow bigCard'>
            <img src={props.url} className='relative h-full w-full object-cover borderRadiusComponents' />
        </div>
    );
}

export const EthBCNCard = (props: { url: string }) => {
    return (
        <div className='w-full aspect-square md:h-80 bg-white borderRadiusComponents shadow bigCard'>
            <img src={props.url} className='relative h-full w-full object-cover borderRadiusComponents' />
        </div>
    );
}


export const SmallArtistCard = (props: { url: string, artistName: string, verified: boolean }) => {
    return (
        <div className='w-full flex flex-col gap-2'>
            <div className='w-full  bg-white borderRadiusComponents shadow bigCard smallCard' style={{'backgroundImage':`url("${props.url}")`, 'backgroundSize':'cover', 'backgroundPosition':'center'}}>
            </div>
            <div className='flex flex-row justify-between'> <p>{props.artistName}</p> {props.verified && <div className="primaryColor"><AiFillCheckCircle size={24} /></div>} </div>
        </div>

    );
}

export const MuseCard = (props: { muse: Muse }) => {
    const muse = props.muse;
    const currentDate = Date.now();
    const day = currentDate - (1000 * 60 * 60 * 24);

    const isNew = muse.createdAt.getTime() > day;
    return (
        <div className='w-full flex flex-col shadow rounded-xl cursor-pointer '>

            <div className='w-full  bg-white  rounded-tr-xl rounded-tl-xl  bigCard h-64 md:h-full '>
                <img src={muse.image} className='relative h-full w-full object-cover rounded-tr-xl rounded-tl-xl  smallCard' />
            </div>

            <div className='flex flex-col bg-white rounded-br-xl rounded-bl-xl p-5'>
                <div className='flex flex-col' >
                    <div className='font-bold text-lg'>{muse.nftName}</div>
                    <div className='flex flex-row justify-between'>
                        <div className='flex flex-row gap-2 items-center'>
                            <img src={muse.minterImage} className="rounded-full object-cover h-6 w-6" />
                            <div className='font-bold text-md'>
                                @{muse.minter}</div>
                        </div>

                        <div className='text-md text-gray-300'>
                            {muse.claimed} / {muse.nftData.nftEditions}
                        </div>

                    </div>
                    <div className='divider mt-4 mb-3'></div>
                    <div className='flex flex-row justify-between items-center'>
                        <div className='flex flex-col'>
                            <div className='text-md text-gray-300'>Price</div>
                            <div className='text-md font-bold black'>${muse.nftData.nftPrice}</div>
                        </div>
                        {isNew && <div className='flex flex-row primaryColor items-center gap-2'>Fresh <IoSparklesSharp size={16} /></div>}
                    </div>
                </div>
            </div>
        </div>

    );
}
