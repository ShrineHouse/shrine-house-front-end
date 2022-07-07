import React, { useState } from 'react'
import { useMoralisCloudFunction } from 'react-moralis';
import SearchBar from '../components/general/searchBar';
import { useQuery } from 'react-query';

import { dataToMuses, searchBeatpack, searchMuse } from '../helpers/database';
import { MuseCard, } from '../components/general/cards';

import LoadingWidget from '../components/general/loadingwidget';
import { Link } from 'react-router-dom';
import { NavbarSpacer } from '../components/general/NavbarSpacer';
import Heading1 from '../components/general/Heading1';
import { Muse } from '../interfaces/muse';
import { Heading2 } from '../components/general/Heading2';
import { BodyLink } from '../components/general/BodyLink';
import { Divider } from '../components/general/Divider';




////Home page - artists live here
const NftDisplay = () => {
    const emptyMuse: Muse[] = [];

    const getchMuses = useMoralisCloudFunction('getMuses');
    const { data, isLoading, error } = useQuery('muses', () => getchMuses.fetch())
    const [isSearching, setSearch] = useState(false)
    const [searchedBp, setUsers] = useState(emptyMuse)


    if (isLoading || data === undefined) return <LoadingWidget />
    if (error) return <div>'WOOPS ERROR...'</div>
    const muses = dataToMuses(data as any);

    //BUild MuseFeed based up search
    function search(value: string) {
        if (value === '') {
            setSearch(false)
            return setUsers(emptyMuse)
        }
        let search = searchMuse(muses, value);
        setUsers(search);
        if (!isSearching) return setSearch(true)
    }
    /////Build artist list with genre filters applied
    function buildList() {
        ///BUILD NFT LIST HERE
        return muses.map((u, i) => <Link to={`/muse/${u.id}`} key={u.id + i}><ul key={u.id}><MuseCard muse={u} /></ul> </Link>)
    }



    return (
        <div className='backgroundCol w-full'>
            <div className='md:min-h-screen w-full  container mx-auto'>
                <div className='flex flex-col'>
                    <SearchBar search={search} marketplace={false} />
                    <NavbarSpacer />

                    {isSearching !== false ?
                        <div className="flex flex-col gap-2">
                            <Heading2 text="Search Results" className='mt-10' />
                            <div className='grid grid-cols-5 gap-10 gap-y-20'>
                                {searchedBp.map((u, i) => <Link to={`/muse/${u.id}`} key={i}><ul key={i}><div ><MuseCard muse={u} /></div></ul></Link>
                                )}
                            </div>
                        </div> : <div>

                            <div className="flex flex-col">
                                <div className='flex flex-row justify-between items-center mt-10'>
                                    <Heading2 text='Trending Muses' />
                                    <BodyLink text='See All' />
                                </div>
                                <div className='flex flex-col md:grid md:grid-cols-4 gap-10 h-full mt-3'>
                                    {buildList()}
                                </div>
                                <Divider className='mt-10' />
                                <div className='flex flex-row justify-between items-center mt-3'>
                                    <Heading2 text='New Muses' />
                                    <BodyLink text='See All' />
                                </div>
                                <div className='flex flex-col md:grid md:grid-cols-4 gap-10 h-full mt-3'>
                                    {buildList()}
                                </div>
                                <Divider className='mt-10' />
                                <div className='flex flex-row justify-between items-center mt-3'>
                                    <Heading2 text='Recommended Muses' />
                                    <BodyLink text='See All' />
                                </div>
                                <div className='flex flex-col md:grid md:grid-cols-4 gap-10 h-full mt-3'>
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


export default NftDisplay