import { Button } from '@chakra-ui/react';
import React, { createContext, useContext, useState } from 'react';
import { useMoralis } from 'react-moralis';
import { useNavigate } from 'react-router-dom';
import BeatPack from '../../interfaces/beats';
import TrackCard from './TrackCard';


function BeatPackInfo(props: { bp: BeatPack, onDownload: Function }) {
    const { user, authenticate } = useMoralis();
    const [playingIndex, setPlayingIndex] = useState(0);
    const navigate = useNavigate();

    return (<div className='flex flex-col gap-4'>
        <div className='flex flex-row gap-5 justify-between w-full items-center'>
            <div className='flex flex-col gap-3'>
                <div className='text-2xl font-bold'>{props.bp.beatPackName}</div>
                <div className='text-lg'>{props.bp.description}</div>
            </div>
            <div>
                <Button bg='#F07634' color='white' className='primaryButton' onClick={() => {
                    if (user !== null) {
                        if (user.attributes.wallet !== undefined) {
                            props.onDownload()
                        } else {
                            navigate('/signup')
                        }
                    } else {
                        authenticate().then((res) => {
                            if (res !== undefined) {
                                if (res.attributes.wallet === undefined) {
                                    navigate('/signup')
                                }
                            }
                        })
                    }
                }}>{(user !== null && user.attributes.wallet !== undefined) ? `Purchase all tracks for $${props.bp.beatPackPrice}` : user === null ? 'Sign in' : user.attributes.wallet === undefined ? 'Sign up' : 'Sign in'}   </Button>

            </div>

        </div>
        <div className='flex flex-col gap-5'>
            {props.bp.beats.map((beatcard, index) => <ul key={index}><TrackCard playingIndex={playingIndex} index={index} data={beatcard} setPlaying={setPlayingIndex} /></ul>)}
        </div>
    </div>);
}

export default BeatPackInfo



