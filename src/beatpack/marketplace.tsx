import React, { useState } from 'react'
import { useMoralisCloudFunction } from 'react-moralis';
import { useQuery } from 'react-query';

import { dataToBeatPack, searchBeatpack } from '../helpers/database';
import { BeatPackCard, SmallArtistCard } from '../components/general/cards';
import BeatPack from '../interfaces/beats';
import { Link } from 'react-router-dom';

import LoadingWidget from '../components/general/loadingwidget'
import SearchBar from '../components/general/searchBar';
import Heading1 from '../components/general/Heading1';
import { Heading2 } from '../components/general/Heading2';
import { NavbarSpacer } from '../components/general/NavbarSpacer';
import { BodyLink } from '../components/general/BodyLink';
import { Divider } from '../components/general/Divider';

////Marketplace - Beatpacks live here

const MarketPlace = () => {
    const emptyBp: BeatPack[] = [];

    const [searchedBp, setUsers] = useState(emptyBp)
    const [isSearching, setSearch] = useState(false)
    const { fetch } = useMoralisCloudFunction("beats")
    const { isLoading, error, data } = useQuery('beatPacks', () => fetch())
    if (isLoading || data === undefined) return <LoadingWidget />
    if (error) return <div>'WOOPS ERROR...'</div>
    let beatPack = dataToBeatPack(data as any);

    //Build marketplace based upon genre
    function buildList() {
        return beatPack.slice(0, 5).map((u, i) => <Link key={i} to={`/beatpack/${u.objectId}`}><ul key={i}><div  ><BeatPackCard beatPackName={u.beatPackName} url={u.imageUrl} artistName={u.artistName} verified={false} /></div></ul></Link>)
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
        <div className='backgroundCol w-full'>
            <div className='md:min-h-screen w-full  container mx-auto'>
                <div className='flex flex-col'>
                    <SearchBar search={search} marketplace={true} />
                    <NavbarSpacer />
                    {isSearching !== false ?
                        <div className="flex flex-col gap-2">
                            <Heading2 text="Search Results" className='mt-10' />
                            <div className='grid grid-cols-5 gap-10 gap-y-20'>
                                {searchedBp.map((u, i) => <Link to={`/beatpack/${u.objectId}`} key={i}><ul key={i}><div ><SmallArtistCard url={u.imageUrl} artistName={`${u.artistName} - ${u.beatPackName}`} verified={false} /></div></ul></Link>
                                )}
                            </div>
                        </div> : <div>

                            <div className="flex flex-col">
                                <div className='flex flex-row justify-between items-center mt-10'>
                                    <Heading2 text='Trending Beats' />
                                    <BodyLink text='See All' />
                                </div>
                                <div className='flex flex-col md:grid md:grid-cols-5 gap-10 h-full mt-3'>
                                    {buildList()}
                                </div>
                                <Divider className='mt-10' />
                                <div className='flex flex-row justify-between items-center mt-3'>
                                    <Heading2 text='New Beats' />
                                    <BodyLink text='See All' />
                                </div>
                                <div className='flex flex-col md:grid md:grid-cols-5 gap-10 h-full mt-3'>
                                    {buildList()}
                                </div>
                                <Divider className='mt-10' />
                                <div className='flex flex-row justify-between items-center mt-3'>
                                    <Heading2 text='Recommended Beats' />
                                    <BodyLink text='See All' />
                                </div>
                                <div className='flex flex-col md:grid md:grid-cols-5 gap-10 h-full mt-3'>
                                    {buildList()}
                                </div>

                                <div className='h-20 w-full' />
                            </div>
                        </div>}

                </div>

            </div>
        </div>
    )
}


export default MarketPlace

