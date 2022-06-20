import React, { useState } from 'react'
import { Beat } from '../../interfaces/beats';
import TrackCard from '../beatpack/TrackCard';

function TrackList(props: { tracks: Beat[] }) {
    const [playingIndex, setPlayingIndex] = useState(0)
    return (<div className='flex flex-col gap-4 w-full'>

        <div className='flex flex-col gap-5'>
            {props.tracks.map((beatcard, index) => <ul key={index}><TrackCard playingIndex={playingIndex} data={beatcard} index={index} setPlaying={setPlayingIndex} /></ul>)}

        </div>
    </div>
    );
}

export default TrackList