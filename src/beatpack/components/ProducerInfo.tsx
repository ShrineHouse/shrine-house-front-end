import { Button } from '@chakra-ui/react';
import React from 'react';
import { numFormatter } from '../../helpers/utils';
import BeatPack from '../../interfaces/beats';
import { DbUser } from '../../interfaces/users';
import TrackCard from './TrackCard';


function ProducerInfo(props: { producer: DbUser }) {
    return (
        <div className='grid grid-cols-2 w-full'>
            <div className='flex flex-col gap-4 w-full justify-start'>
                <div className='flex flex-col'>
                    <div className='text-2xl font-bold'>Active Since</div>
                    <div className='text-xl'>{`${(props.producer.createdAt as Date).toLocaleDateString()}`}</div>
                </div>
                <div className='flex flex-col'>
                    <div className='text-2xl font-bold'>Producer Genre</div>
                    <div className='text-xl'>{props.producer.genre}</div>
                </div>
                <div className='flex flex-col'>
                    <div className='text-2xl font-bold'>Orders</div>
                    <div className='text-xl'>{numFormatter(props.producer.orders)} executed</div>
                </div>
                <div className='flex flex-col'>
                    <div className='text-2xl font-bold'>Accepted Currencies</div>
                    <div className='text-xl'>ETH, SHRI, USDC, DAI</div>
                </div>
                <button className='primaryButton w-max'>Go to producer page</button>
            </div>
            <img src={props.producer.image} className='w-auto h-full object-cover rounded-xl' />
        </div>

    );
}

export default ProducerInfo