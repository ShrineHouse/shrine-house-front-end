import React, { useEffect } from 'react'
import { useMoralis, useMoralisQuery } from 'react-moralis';
import Logo from '../components/logo';
import { AiFillCheckCircle } from 'react-icons/ai';
import SearchBar from '../components/searchBar';
import { useQuery } from 'react-query';

import DbUser from '../interfaces/users';
import { dataToShrineUsers, dataToUsers } from '../helpers/database';



const BigArtistCard = (props: { url: string }) => {
    return (
        <div className='w-full h-56 bg-white borderRadiusComponents shadow bigCard'>
            <img src={props.url} className='relative h-full w-full object-cover borderRadiusComponents' />
        </div>
    );
}

const SmallArtistCard = (props: { url: string, artistName: string, verified: boolean }) => {
    return (
        <div className='w-full h-full flex flex-col gap-2'>

            <div className='w-full h-56 bg-white borderRadiusComponents shadow bigCard'>
                <img src={props.url} className='relative h-full w-full object-cover borderRadiusComponents' />
            </div>

            <div className='flex flex-row justify-between'> <p>{props.artistName}</p> {props.verified && <div className="primaryColor"><AiFillCheckCircle size={24} /></div>} </div>
        </div>

    );
}





const Home = () => {
    const { fetch } = useMoralisQuery("users")
    const { isLoading, error, data } = useQuery('usersData', () => fetch())


    if (isLoading || data === undefined) return <h1>'Loading...'</h1>
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
                        {shrineUsers.map((u) => <BigArtistCard url={u.image} />
                        )}
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    <h1>Trending</h1>
                    <div className='grid grid-cols-5 gap-5'>
                        {users.map((u) => <SmallArtistCard url={u.image} artistName={u.fullName} verified={u.verified} />)}
                    </div>
                </div>
            </div>
        </div>
    )
}


export default Home