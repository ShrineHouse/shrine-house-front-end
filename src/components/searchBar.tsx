import * as React from 'react';
import Logo from "./logo";
import { MdAccountBalanceWallet, MdNotifications, MdPerson } from 'react-icons/md';
import { useMoralis } from 'react-moralis';

const SearchBar = (props: { search: Function }) => {
    const { authenticate, isAuthenticated, user, logout } = useMoralis();

    const login = async () => {
        if (!isAuthenticated) {

            await authenticate()
                .then(function (user) {
                    console.log(user!.get("ethAddress"));
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
    }
    return (
        <div className="flex flex-col container mx-auto">
            <div className='bg-white max-h-20 mt-10 grid grid-cols-3    borderRadiusComponents relative gap-5 justify-between'>
                <div className='flex flex-row gap-3 max-h-20 p-5'>
                    <Logo />
                    <div className='self-center'>
                        <h1>SHRINE HOUSE</h1>
                    </div>
                </div>
                <div className='py-5'>
                    <input placeholder='Search shrine' className='textInput justify-center w-full' onChange={(e)=> props.search(e.target.value)} />
                </div>
                <div className='flex flex-row items-center gap-3 justify-end p-5'>
                    <div className='iconColorInactive'>
                        <MdNotifications size={25} />
                    </div>
                    {isAuthenticated && <div className='iconColorInactive'>
                        <MdPerson size={25} />
                    </div>}
                    {!isAuthenticated && <div className='primaryButton'>
                        <button className='flex flex-row gap-3' onClick={login} ><MdAccountBalanceWallet size={25} /> Connect Account</button>
                    </div>}

                </div>
            </div>
        </div>);
}

export default SearchBar