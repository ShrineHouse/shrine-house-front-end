import React, { useEffect, useState } from 'react'
import { useMoralisQuery } from 'react-moralis';
import SearchBar from '../components/searchBar';
import { useQuery } from 'react-query';

import DbUser from '../interfaces/users';
import { dataToBeatPack, dataToBeatPackRec, dataToShrineUsers, dataToUsers } from '../helpers/database';
import { BigArtistCard, SmallArtistCard } from '../components/cards';





function Chip(props: { text: string }) {
    const [active, setActive] = useState(false);
    return (
        <div className={active ? 'chipActive' : 'chip'} onClick={() => setActive(!active)}>
            {props.text}
        </div>
    );
}


const MarketPlace = () => {
    const { fetch } = useMoralisQuery("beats")
    const { isLoading, error, data } = useQuery('beatPacks', () => fetch())


    if (isLoading || data === undefined) return <h1>'Loading...'</h1>
    if (error) return <div>'WOOPS ERROR...'</div>
    const beatPack = dataToBeatPack(data);
    const shrineBeatPack = dataToBeatPackRec(data);
    return (
        <div className='h-screen w-full container mx-auto'>
            <div className='flex flex-col mx-5 gap-10'>
                <SearchBar />
                <div className='flex flex-row justify-between items-center'>
                    <div className='flex flex-row gap-2'>
                        <Chip text='Trending' />
                        <Chip text='Liked' />
                        <Chip text='New' />
                    </div>
                    <select id="genres" name="genres" className='genreSelect'>
                        <option value="genre">Genre</option>
                        <option value="rap">Rap</option>
                        <option value="hiphop">Hip-Hop</option>
                        <option value="edm">EDM</option>
                    </select>
                </div>

                <div className="flex flex-col gap-2">
                    <h1>Recommended playlists</h1>
                    <div className='grid grid-cols-3 gap-5'>
                        {shrineBeatPack.map((u) => <BigArtistCard url={u.imageUrl} />
                        )}
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    <div className='flex flex-row justify-between items-center'><h1>Trending</h1> <a className='underline'>View All Beats</a></div>
                    <div className='grid grid-cols-5 gap-5'>
                        {beatPack.map((u) => <SmallArtistCard url={u.imageUrl} artistName={`${u.artistName} - ${u.beatPackName}`} verified={false} />)}
                    </div>
                </div>
            </div>
        </div>
    )
}


export default MarketPlace