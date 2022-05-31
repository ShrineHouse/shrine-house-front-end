import React, { useState } from 'react'
import { useMoralisQuery } from 'react-moralis';
import SearchBar from '../components/searchBar';
import { useQuery } from 'react-query';

import { dataBeatpackFilter, dataToBeatPack, dataToBeatPackRec, dataToShrineUsers, dataToUsers, searchBeatpack } from '../helpers/database';
import { BigArtistCard, SmallArtistCard } from '../components/cards';
import BeatPack from '../interfaces/beats';
import Chip from '../components/chip';
import { Link } from 'react-router-dom';
import BeatPackPage from './beatpack';

const MarketPlace = () => {
    const emptyBp: BeatPack[] = [];
    const emptyBeatpack:BeatPack = {
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
        ownerWallet:''
    };

    const [searchedBp, setUsers] = useState(emptyBp)
    const [isSearching, setSearch] = useState(false)
    const { fetch } = useMoralisQuery("beats")
    const { isLoading, error, data } = useQuery('beatPacks', () => fetch())
    const [genreBp, setGenre] = useState([{ genre: 'none' }])
    const [activeBp, setBp] = useState(emptyBeatpack)
    if (isLoading || data === undefined) return <h1>'Loading...'</h1>
    if (error) return <div>'WOOPS ERROR...'</div>
    let beatPack = dataToBeatPack(data);
    let shrineBeatPack = dataToBeatPackRec(data);
    function buildList() {
        if (genreBp[0] === undefined) return <p>No beatpacks found</p>
        if (genreBp[0].genre === 'none') {
            {
                return beatPack.map((u, i) => <ul key={i}><div onClick={()=>setBp(u)} ><SmallArtistCard url={u.imageUrl} artistName={`${u.artistName} - ${u.beatPackName}`} verified={false} /></div></ul>)
            }
        } else {
            {
                return (genreBp as BeatPack[]).map((u, i) => <ul key={i}><div onClick={()=>setBp(u)} ><SmallArtistCard url={u.imageUrl} artistName={`${u.artistName} - ${u.beatPackName}`} verified={false} /></div></ul>)
            }
        }
    }
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
        <div className='h-screen w-full container mx-auto'>
            <div className={activeBp.beatPackName === '' ? 'beatPack fixed w-screen h-screen z-50 backgroundCol' : 'beatPackActive fixed w-screen min-h-screen max-h-screen z-50 backgroundCol  overflow-y-scroll'}>
                <BeatPackPage bp={activeBp} back={()=> setBp(emptyBeatpack)} />
            </div>
            <div className='flex flex-col mx-5 gap-10'>
                <SearchBar search={search} marketplace={true} />
                <div className='flex flex-row justify-between items-center'>
                    <div className='flex flex-row gap-2'>
                        <Chip text='Trending' />
                        <Chip text='Liked' />
                        <Chip text='New' />
                    </div>
                    <select id="genres" name="genres" className='genreSelect' onClick={(e) => console.log(e.target)} onChange={(e) => {
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
                            {searchedBp.map((u, i) => <ul key={i}><div onClick={()=>setBp(u)} ><SmallArtistCard url={u.imageUrl} artistName={`${u.artistName} - ${u.beatPackName}`} verified={false} /></div></ul>
                            )}
                        </div>
                    </div> : <div>
                        <div className="flex flex-col gap-2">
                            <h1>Recommended playlists</h1>
                            <div className='grid grid-cols-3 gap-5'>
                                {shrineBeatPack.map((u, i) => <ul key={i}><div onClick={()=>setBp(u)} ><BigArtistCard url={u.imageUrl} /></div></ul>
                                )}
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <div className='flex flex-row justify-between items-center'><h1>Trending</h1> <a className='underline'>View All Beats</a></div>
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