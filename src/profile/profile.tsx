import React from 'react'
import { useMoralis } from 'react-moralis';
import SearchBar from '../components/searchBar'

const Profile = () => {
    const { logout } = useMoralis();

    return (
        <div className='flex flex-col gap-3 text-black cursor-default p-5'>
            <p>General</p>
            <p>Socials</p>
            <p>Push Notifications</p>
            <div className='h-10'></div>
            <p>Apply as an artist/product</p>
            <p>More</p>
            <p>FAQ</p>
            <p onClick={logout} className='cursor-pointer hover:underline'>Logout</p>
        </div>
    )
}


export default Profile