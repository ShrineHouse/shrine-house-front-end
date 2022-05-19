import React from 'react'
import { useMoralisQuery } from 'react-moralis';
import SearchBar from '../components/searchBar';
import { useQuery } from 'react-query';

import { dataToShrineUsers, dataToUsers } from '../helpers/database';
import { BigArtistCard, SmallArtistCard } from '../components/cards';






const Home = () => {




    const { fetch } = useMoralisQuery("users")
    const { isLoading, error, data } = useQuery('usersData', () => fetch())

    if (isLoading || data === undefined) return <div className='h-screen w-screen text-center'><h1>'Loading...'</h1></div>
    if (error) return <div>'WOOPS ERROR...'</div>
    const users = dataToUsers(data);
    const shrineUsers = dataToShrineUsers(data);
    return (
        <div className='h-screen w-full container mx-auto'>
            <div className='flex flex-col mx-5 gap-10'>
                <SearchBar />
                <div className="flex flex-col gap-2">
                    <h1>Shrine Artists</h1>
                    <div className='grid grid-cols-3 gap-5'>
                        {shrineUsers.map((u, i) => <ul key={i}><BigArtistCard url={u.image} /></ul>
                        )}
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    <h1>Trending</h1>
                    <div className='grid grid-cols-5 gap-5'>
                        {users.map((u, i) => <ul key={i}><SmallArtistCard url={u.image} artistName={u.fullName} verified={u.verified} /></ul>)}
                    </div>
                </div>
            </div>
        </div>
    )
}


export default Home