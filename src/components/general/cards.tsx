import React from 'react'
import { AiFillCheckCircle } from 'react-icons/ai';

export const BigArtistCard = (props: { url: string }) => {
    return (
        <div className='w-full h-56 bg-white borderRadiusComponents shadow bigCard'>
            <img src={props.url} className='relative h-full w-full object-cover borderRadiusComponents' />
        </div>
    );
}

export const SmallArtistCard = (props: { url: string, artistName: string, verified: boolean }) => {
    return (
        <div className='w-full flex flex-col gap-2'>

            <div className='w-full  bg-white borderRadiusComponents shadow bigCard '>
                <img src={props.url} className='relative h-full w-full object-cover borderRadiusComponents smallCard' />
            </div>

            <div className='flex flex-row justify-between'> <p>{props.artistName}</p> {props.verified && <div className="primaryColor"><AiFillCheckCircle size={24} /></div>} </div>
        </div>

    );
}
