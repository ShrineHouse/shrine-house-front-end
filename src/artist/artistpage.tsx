import { ChevronLeftIcon } from '@chakra-ui/icons';
import { Box, Text, VStack } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';

import { useMoralisCloudFunction } from 'react-moralis';
import { dataToUser } from '../helpers/database';
import { DbUser, emptyUser } from '../interfaces/users';
import { Link, useParams } from 'react-router-dom';
import ProducerInfo from '../beatpack/components/ProducerInfo';

import { spotifyFetch } from '../helpers/spotify';
import BeatPack, { Beat } from '../interfaces/beats';
import TrackList from './components/Tracklist';



const ArtistPage = () => {
    let emptyArray: Beat[] = [];

    const { id } = useParams();
    const [activeTab, setActiveTab] = useState('beat');

    const { fetch } = useMoralisCloudFunction("getArtist", { id: id })
    const [artist, setArtist] = useState(emptyUser)
    const [tracks, setTracks] = useState(emptyArray)

    useEffect(() => {

        fetch({
            onSuccess(results) {
                const _artist = dataToUser(results as any);
                getTracks(_artist)

            },
        })

      
    }, [])


    async function getTracks(_artist:DbUser) {
        const res = await spotifyFetch('https://api.spotify.com/v1/artists/7FngGIEGgN3Iwauw1MvO4P/top-tracks?market=IT');
        const tracks = res.data.tracks;
        let trackArray: Beat[] = [];

        tracks.map((track: any) => trackArray.push({ beatArtist: _artist.fullName, beatDownloadUrl: track.preview_url, beatName: track.name, beatPrice: 0, beatUrl: track.preview_url, royaltyIndex: 0 }))
        console.log(trackArray)
        if (trackArray.length < 0) {
            return;
        }
        setTracks(trackArray)
        setArtist(_artist)

    }

    



    return (
        <div className='container mx-auto'>
            <Box padding={10} className='m-5'>
                <div className="flex flex-col">
                    <Link to={'/'}>

                    <div className='flex flex-row gap-2 items-center mb-5 cursor-pointer'>
                        <ChevronLeftIcon height={50} width={50} />
                        <Text className='text-xl font-bold'>Back</Text>
                        </div>
                        </Link>
                    <div className='flex flex-row gap-20'>
                        <VStack w='100%' gap={10}>
                            <div className='flex flex-row gap-5 justify-start w-full'>
                                <div>
                                    <img src={artist.image} className=" object-cover h-60 w-60 rounded-xl" />
                                </div>
                                <div className='flex flex-col gap-2'>
                                    <div className='text-4xl font-bold primaryColor'>
                                        {artist.fullName}
                                    </div>
                                    <div className='text-xl text-gray-400'>
                                        {artist.genre}
                                    </div>
                                </div>
                            </div>
                            <div className='flex flex-row w-full gap-10'>
                                <div className={activeTab === 'beat' ? 'transition-all underline text-3xl font-bold' : 'transition-all text-3xl font-bold text-gray-500'} onClick={() => setActiveTab('beat')}>Tracks</div>
                                <div className={activeTab !== 'beat' ? 'transition-all underline text-3xl font-bold' : 'transition-all text-3xl font-bold text-gray-500'} onClick={() => setActiveTab('producer')}>Producer info</div>
                            </div>
                            {activeTab === 'beat' && <TrackList tracks={tracks} />}
                            {activeTab === 'producer' && <ProducerInfo producer={artist} />}
                        </VStack>
                    </div>
                </div>

            </Box>



        </div>
    )

}

export default ArtistPage;