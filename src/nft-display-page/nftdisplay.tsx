import React, { useState } from 'react'
import { useMoralisCloudFunction } from 'react-moralis';
import SearchBar from '../components/general/searchBar';
import { useQuery } from 'react-query';

import { dataToMuses, dataToUsers } from '../helpers/database';
import { MuseCard, } from '../components/general/cards';
import { DbUser } from '../interfaces/users'

import LoadingWidget from '../components/general/loadingwidget';
import Chip from '../components/general/chip';
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
        return muses.map((u, i) => <Link to={`/muse/${u.id}`}><ul key={i}><MuseCard muse={u} /></ul> </Link>)
    }



    return (
        <div className='backgroundCol w-full'>
            <div className='min-h-screen w-full container mx-auto'>
                <div className='flex flex-col mx-5 gap-10'>
                    <SearchBar search={search} marketplace={false} />
                    <div className="flex flex-col gap-5 mt-20 pt-5">
                        <div className='text-4xl  font-bold'>Muse Feed</div>
                        <div className='flex flex-row gap-5'>
                            <Chip text='Fresh' />
                            <Chip text='Sale' />
                            <Chip text='Growing' />
                        </div>
                        <div className='flex flex-col md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 pb-20'>
                            {buildList()}
                        </div>
                    </div>

                </div>
            </div>
        </div>

    )
}


export default NftDisplay