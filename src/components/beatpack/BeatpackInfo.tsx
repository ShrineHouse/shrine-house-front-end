import { Button } from '@chakra-ui/react';
import React, { createContext, useContext, useState } from 'react';
import BeatPack from '../../interfaces/beats';
import TrackCard from './TrackCard';


function BeatPackInfo(props: { bp: BeatPack, onDownload: Function }) {
    const [playingIndex, setPlayingIndex] = useState(0)
    return (<div className='flex flex-col gap-4'>
        <div className='flex flex-row gap-5 justify-between w-full items-center'>
            <div className='flex flex-col gap-3'>
                <div className='text-2xl font-bold'>{props.bp.beatPackName}</div>
                <div className='text-lg'>{props.bp.description}</div>
            </div>
            <div>
                <Button bg='#F07634' color='white' className='primaryButton' onClick={() => {
                    props.onDownload()
                }}>Purchase all tracks for ${props.bp.beatPackPrice}</Button>

            </div>

        </div>
        <div className='flex flex-col gap-5'>
            {props.bp.beats.map((beatcard, index) => <ul key={index}><TrackCard playingIndex={playingIndex} index={index} data={beatcard} setPlaying={setPlayingIndex} /></ul>)}
        </div>
    </div>);
}

export default BeatPackInfo



