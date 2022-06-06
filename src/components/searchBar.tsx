import * as React from 'react';
import Logo from "./logo";
import { MdAccountBalanceWallet, MdNotifications, MdPerson, MdMusicNote } from 'react-icons/md';
import { useMoralis } from 'react-moralis';
import Profile from '../profile/profile';
import { useOutsideAlerter } from '../helpers/utils';
import { Link, Navigate } from 'react-router-dom';

const SearchBar = (props: { search: Function, marketplace: boolean }) => {
    const { authenticate, isAuthenticated, user, logout } = useMoralis();
    const [dropdownActive, setDropdown] = React.useState(false)
    const login = async () => {
        if (!isAuthenticated) {

            await authenticate()
                .then(function (user) {
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
    }
    let wrapperRef = React.useRef(null);
    useOutsideAlerter(wrapperRef, setDropdown)

    return (
        <div className="flex flex-col mx-auto absolute left-0 top-0 shadow-md">
            <div className='bg-white max-h-20 w-screen grid grid-cols-3  borderRadiusComponents relative gap-5 justify-between'>
                <div className='flex flex-row gap-3 max-h-20 p-5'>
                    <Logo />
                    <div className='self-center'>
                        <h1>SHRINE HOUSE</h1>
                    </div>
                </div>
                <div className='py-5'>
                    <input placeholder='Search shrine' className='textInput justify-center w-full' onChange={(e) => props.search(e.target.value)} />
                </div>
                <div className='flex flex-row items-center gap-3 justify-end p-5'>
                    {(props.marketplace && isAuthenticated) && <div className='primaryButton'><Link to={'/createbeatpack'} className='flex flex-row gap-2' ><MdMusicNote size={25} />Upload beatpack</Link></div>}

                    <div className='iconColorInactive'>
                        <MdNotifications size={25} />
                    </div>
                    {isAuthenticated && <div className={dropdownActive ? 'iconColorActive' : 'iconColorInactive relative'}>
                        <MdPerson size={25} onClick={() => setDropdown(!dropdownActive)} />
                        <Profile active={dropdownActive} wrapperRef={wrapperRef} />
                    </div>}
                    {!isAuthenticated && <div className='primaryButton'>
                        <button className='flex flex-row gap-3' onClick={login} ><MdAccountBalanceWallet size={25} />Connect Account</button>
                    </div>}

                </div>
            </div>
        </div>);


}



export default SearchBar