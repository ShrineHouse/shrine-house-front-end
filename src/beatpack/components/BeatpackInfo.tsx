import { Button } from '@chakra-ui/react';
import React from 'react';
import BeatPack from '../../interfaces/beats';
import TrackCard from './TrackCard';


function BeatPackInfo(props: { bp: BeatPack, onDownload: Function }) {
    return (<div className='flex flex-col gap-4'>
        <div className='flex flex-row gap-5 justify-between w-full items-center'>
            <div className='flex flex-col gap-3'>
                <div className='text-2xl font-bold'>{props.bp.beatPackName}</div>
                <div className='text-lg'>{props.bp.description}</div>
            </div>
            <div>
                <Button bg='#F07634' color='white' className='primaryButton' onClick={() => props.onDownload}>Purchase all tracks for ${props.bp.beatPackPrice}</Button>

            </div>

        </div>
        <div className='flex flex-col gap-5'>
            {props.bp.beats.map((beatcard,index) => <ul key={index}><TrackCard data={beatcard} /></ul>)}
        </div>
    </div>);
}

export default BeatPackInfo