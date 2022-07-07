import React from 'react'
import { useMoralis } from 'react-moralis';
import { MdAccountBalanceWallet } from 'react-icons/md';
import { Link } from 'react-router-dom';

const Profile = (props: { wrapperRef: React.MutableRefObject<null>, active: boolean, type: string }) => {
    const { logout, user } = useMoralis();


    return (
        <div className={props.active ? 'dropdown shadow' : 'dropdownInactive shadow'} ref={props.wrapperRef}>

            <div className='flex flex-col gap-3 text-black cursor-default p-5 relative'>
                <div className='flex flex-row'>
                    <div className='overflow-ellipsis'>
                        {user !== null && <div className='flex flex-row gap-3 items-center'>
                            <MdAccountBalanceWallet size={45} className="iconColorInactive" />
                            <div className='flex flex-col'>
                                <p className='w-40 overflow-hidden whitespace-nowrap  overflow-ellipsis'> {user.attributes.ethAddress}</p>
                                <p className='w-40 overflow-hidden whitespace-nowrap  overflow-ellipsis text-gray-400'> 15600 Shri</p>
                            </div>
                        </div>}
                    </div>
                </div>
                <div className='h-3'></div>
                <p className="profileLink">General</p>
                <p className="profileLink">Socials</p>
                <p className="profileLink">Push Notifications</p>
                {props.type !== 'user' && <Link to='/signup'>
                    <p className="profileLink">Edit Profile</p>
                </Link>}
                <div className='h-5'></div>
                {props.type === 'user' && <Link to='/signup'>
                    <p className="profileLink">Signup as an artist/producer</p>
                </Link>}

                <p className="profileLink">More</p>
                <p className="profileLink">FAQ</p>
                <p onClick={logout} className="profileLink">Logout</p>
            </div>
        </div>
    )
}


export default Profile