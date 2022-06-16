import React, { useState } from 'react'
import { useMoralisCloudFunction, useMoralisQuery } from 'react-moralis';
import SearchBar from '../components/searchBar';
import { useQuery } from 'react-query';

import { dataBeatpackFilter, dataToBeatPack, dataToBeatPackRec, dataToShrineUsers, dataToUsers, searchBeatpack } from '../helpers/database';
import { BigArtistCard, SmallArtistCard } from '../components/cards';
import BeatPack from '../interfaces/beats';
import Chip from '../components/chip';
import { Link } from 'react-router-dom';
import LoadingWidget from '../components/loadingwidget';


////Marketplace - Beatpacks live here

const MarketPlace = () => {
    const emptyBp: BeatPack[] = [];
    const emptyBeatpack: BeatPack = {
        artistName: '',
        beatPackName: '',
        beatPackPrice: 0,
        beatPackUrl: '',
        beats: [],
        imageUrl: '',
        royaltyIndex: 0,
        downloads: 0,
        genre: '',
        description: '',
        ownerWallet: '',
        objectId: ''
    };

    const [searchedBp, setUsers] = useState(emptyBp)
    const [isSearching, setSearch] = useState(false)
    const { fetch } = useMoralisCloudFunction("beats")
    const { isLoading, error, data } = useQuery('beatPacks', () => fetch())
    const [genreBp, setGenre] = useState([{ genre: 'none' }])
    if (isLoading || data === undefined) return <LoadingWidget />
    if (error) return <div>'WOOPS ERROR...'</div>
    let beatPack = dataToBeatPack(data as any);
    let shrineBeatPack = dataToBeatPackRec(data as any);

    //Build marketplace based upon genre
    function buildList() {
        if (genreBp[0] === undefined) return <p>No beatpacks found</p>
        if (genreBp[0].genre === 'none') {
            return beatPack.map((u, i) => <Link to={`/beatpack/${u.objectId}`}><ul key={i}><div  ><SmallArtistCard url={u.imageUrl} artistName={`${u.artistName} - ${u.beatPackName}`} verified={false} /></div></ul></Link>)
        } else {
            return (genreBp as BeatPack[]).map((u, i) => <Link to={`/beatpack/${u.objectId}`}><ul key={i}><div  ><SmallArtistCard url={u.imageUrl} artistName={`${u.artistName} - ${u.beatPackName}`} verified={false} /></div></ul></Link>)
        }
    }
    //BUild marketplace based up search
    function search(value: string) {
        if (value === '') {
            setSearch(false)
            return setUsers(emptyBp)
        }
        let search = searchBeatpack(beatPack, value);
        setUsers(search);
        if (!isSearching) return setSearch(true)
    }
    return (
        <div className='h-screen w-full container mx-auto px-5'>
            <div className='flex flex-col mx-5 gap-10 mt-20 pt-5'>
                <SearchBar search={search} marketplace={true} />
                <div className=' text-5xl -mb-5 font-bold'>
                    Beat Market
                </div>
                <div className='flex flex-row justify-between items-center'>
                    <div className='flex flex-row gap-2'>
                        <Chip text='Trending' />
                        <Chip text='Liked' />
                        <Chip text='New' />
                    </div>
                    <select id="genres" name="genres" className='genreSelect' onChange={(e) => {
                        if (e.target.value === 'allgenres') return setGenre([{ genre: 'none' }])
                        const filteredData = dataBeatpackFilter(beatPack, e.target.value)
                        setGenre(filteredData)
                    }} >
                        <option value="allgenres">All genres</option>
                        <option value="altrock">Alt Rock</option>
                        <option value="rap">Rap</option>
                        <option value="trap">Trap</option>
                        <option value="edm">EDM</option>
                    </select>
                </div>
                {isSearching !== false ?
                    <div className="flex flex-col gap-2">
                        <h1>Search results</h1>
                        <div className='grid grid-cols-3 gap-5'>
                            {searchedBp.map((u, i) => <Link to={`/beatpack/${u.objectId}`}><ul key={i}><div ><SmallArtistCard url={u.imageUrl} artistName={`${u.artistName} - ${u.beatPackName}`} verified={false} /></div></ul></Link>
                            )}
                        </div>
                    </div> : <div>
                        <div className="flex flex-col gap-5">
                            <div className='text-4xl'>Recommended playlists</div>
                            <div className='grid grid-cols-3 gap-5'>
                                {shrineBeatPack.map((u, i) => <Link to={`/beatpack/${u.objectId}`}> <ul key={i}><div  ><BigArtistCard url={u.imageUrl} /></div></ul></Link>
                                )}
                            </div>
                        </div>
                        <div className="flex flex-col gap-5 mt-10">
                            <div className='text-4xl -mb-5'>Trending</div>
                            <div className='flex flex-row justify-between items-center'><h1>Beatpacks & playlists</h1> <a className='underline'>View All Packs & Playlists</a></div>
                            <div className='grid grid-cols-2 md:grid-cols-5 gap-5'>
                                {buildList()}
                            </div>
                        </div>
                    </div>}

            </div>
        </div>
    )
}


export default MarketPlace