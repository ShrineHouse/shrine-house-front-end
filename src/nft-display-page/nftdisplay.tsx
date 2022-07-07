import React, { useState } from 'react'
import { useMoralisCloudFunction } from 'react-moralis';
import SearchBar from '../components/general/searchBar';
import { useQuery } from 'react-query';

import { dataToMuses } from '../helpers/database';
import { MuseCard, } from '../components/general/cards';

import LoadingWidget from '../components/general/loadingwidget';
import { Link } from 'react-router-dom';




////Home page - artists live here
const NftDisplay = () => {
    const getchMuses = useMoralisCloudFunction('getMuses');
    const { data, isLoading, error } = useQuery('muses', () => getchMuses.fetch())

    if (isLoading || data === undefined) return <LoadingWidget />
    if (error) return <div>'WOOPS ERROR...'</div>
    const muses = dataToMuses(data as any);
    /////Build artist list based upon search
    function search(value: string) {
    }
    /////Build artist list with genre filters applied
    function buildList() {
        ///BUILD NFT LIST HERE
        return muses.map((u, i) => <Link to={`/muse/${u.id}`} key={u.id + i}><ul key={u.id}><MuseCard muse={u} /></ul> </Link>)
    }



    return (
        <div className='backgroundCol w-full'>
            <div className='md:min-h-screen w-full  container mx-auto'>
                <div className='flex flex-col mx-5 gap-10'>
                    <SearchBar search={search} marketplace={false} />
                    <div className=' h-24 w-full'></div>
                    <div className="flex flex-col gap-5">
                        <div className='text-4xl  font-bold'>Muse Feed</div>
                        <div className='flex flex-col md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 gap-y-20'>
                            {buildList()}
                        </div>
                        <div className='h-20 w-full' />

                    </div>

                </div>
            </div>
        </div>

    )
}


export default NftDisplay