import React, { useState } from 'react'
import { useMoralisCloudFunction } from 'react-moralis';
import SearchBar from '../components/general/searchBar';
import { useQuery } from 'react-query';

import { artistGenreFilter, dataToShrineUsers, dataToUsers, searchArtists } from '../helpers/database';
import { BigArtistCard, EthBCNCard, SmallArtistCard } from '../components/general/cards';
import { DbUser } from '../interfaces/users'
import Chip from '../components/general/chip';
import { Link } from 'react-router-dom';
import LoadingWidget from '../components/general/loadingwidget';




////Home page - artists live here
const NftDisplay = () => {
    const emptyUser: DbUser[] = [];
    const [searchedUsers, setUsers] = useState(emptyUser)
    const [isSearching, setSearch] = useState(false)
    const { fetch } = useMoralisCloudFunction('getArtists');

    const { isLoading, error, data } = useQuery('usersData', () => fetch())

    if (isLoading || data === undefined) return <LoadingWidget />

    if (error) return <div>'WOOPS ERROR...'</div>
    const users = dataToUsers(data as any);

    /////Build artist list based upon search
    function search(value: string) {
        if (value === '') {
            setSearch(false)
            return setUsers(emptyUser)
        }
        let search = searchArtists(users, value);
        setUsers(search);
        if (!isSearching) return setSearch(true)
    }
    /////Build artist list with genre filters applied
    function buildList() {
        ///BUILD NFT LIST HERE
        ///Just pass the image and the NFT name, that's good for now.
        return users.map((u, i) => <ul key={i}><SmallArtistCard url={u.image} artistName={`${u.fullName}`} verified={false} /></ul>)
    }


    const ethBcnCard = [
        <EthBCNCard url='https://ethbarcelona.com/assets/Image.png' />
        , <EthBCNCard url='https://novobrief.com/wp-content/uploads/2022/05/FS-ECuBVsAMKLFC-810x456.jpeg' />,
        <EthBCNCard url='https://pbs.twimg.com/card_img/1537329690641371136/EHHFVLhL?format=jpg&name=medium' />

    ]
    return (
        <div className='backgroundCol w-full'>
            <div className='min-h-screen w-full container mx-auto'>
                <div className='flex flex-col mx-5 gap-10'>
                    <SearchBar search={search} marketplace={false} />


                    <div className="flex flex-col gap-5 mt-20 pt-5">
                        <div className='text-4xl -mb-2'>Latest NFT's</div>
                        <div className='grid grid-cols-2 md:grid-cols-5 gap-5'>
                            {buildList()}
                        </div>
                    </div>

                </div>
            </div>
        </div>

    )
}


export default NftDisplay