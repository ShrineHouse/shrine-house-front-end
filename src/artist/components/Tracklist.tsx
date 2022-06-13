import { Button } from '@chakra-ui/react';
import React from 'react'
import TrackCard from '../../beatpack/components/TrackCard';
import BeatPack, { Beat } from '../../interfaces/beats';

function TrackList(props: { tracks: Beat[] }) {
    return (<div className='flex flex-col gap-4 w-full'>

        <div className='flex flex-col gap-5'>
            {props.tracks.map((beatcard, index) => <ul key={index}><TrackCard data={beatcard} /></ul>)}

        </div>
    </div>
    );
}

export default TrackList