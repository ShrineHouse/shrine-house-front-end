import { Button } from '@chakra-ui/react';
import React from 'react';
import BeatPack from '../../interfaces/beats';
import { DbUser } from '../../interfaces/users';
import TrackCard from './TrackCard';


function ProducerInfo(props: { producer: DbUser, onDownload: Function }) {
    return (
        <div className='flex flex-col gap-4 w-full'>
                <div className='text-2xl font-bold'>{props.producer.fullName}</div>
                <div className='text-lg'>{props.producer.genre}</div>



        </div>
    );
}

export default ProducerInfo