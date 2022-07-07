import * as React from 'react';
import Logo from "./logo";
import { MdAccountBalanceWallet, MdNotifications, MdPerson, MdMusicNote } from 'react-icons/md';
import { useMoralis } from 'react-moralis';
import Profile from '../../profile/profile';
import { useOutsideAlerter } from '../../helpers/utils';
import { Link } from 'react-router-dom';
import { PopUp } from './PopUpModal';
import Heading1 from './Heading1';

const SearchBar = (props: { search: Function, marketplace: boolean }) => {
    const { authenticate, isAuthenticated, user } = useMoralis();
    const [dropdownActive, setDropdown] = React.useState(false);
    const [isOpen, setPopup] = React.useState(false)
    const login = async (useMetaMask: boolean) => {

        if (!isAuthenticated) {
            await authenticate({ provider: useMetaMask ? "metamask" : "walletconnect" })
                .then(function (user) {
                    setPopup(false)

                })
                .catch(function (error) {
                    setPopup(false)
                });
        }
    }
    let wrapperRef = React.useRef(null);
    useOutsideAlerter(wrapperRef, setDropdown)
    if (user !== null) {

    }


    return (
        <div className="flex flex-col mx-auto fixed  left-0 top-0 shadow-md z-30">
            <PopUp close={() => setPopup(false)} isOpen={isOpen}>

                <Heading1 text='Connect Your Wallet' />

                <p className='py-10'>
                    You need to be connected to access beatpacks, artists and NFT's.
                </p>

                <div className='flex flex-col gap-5'>
                    <button className='primaryButton' onClick={() => login(true)}>Metamask</button>
                    <button className='primaryButton' onClick={() => login(false)}>Walletconnect</button>
                </div>
            </PopUp>
            <div className='bg-white max-h-20 w-screen flex flex-row justify-between lg:grid lg:grid-cols-3  borderRadiusComponents relative gap-5 px-5 lg:px-0'>
                <div className='lg:flex flex-row gap-3 max-h-20 p-5 hidden'>
                    <div className=' w-11'>
                        <Logo />
                    </div>
                    <div className='self-center'>
                        <h1 className='text-2xl mt-1 font-semibold'>Shrine House</h1>
                    </div>
                </div>
                <div className='py-5'>
                    <input placeholder='Search name, genre, ...' className='textInput justify-center w-full' onChange={(e) => props.search(e.target.value)} />
                </div>
                <div className='flex flex-row items-center gap-3 justify-end '>
                    {(user !== null && props.marketplace) && <>
                        {(user.attributes.fullName !== undefined) && <div className='primaryButton'><Link to={'/createbeatpack'} className='flex flex-row gap-2' ><MdMusicNote size={25} />Upload beatpack</Link></div>}
                    </>}
                    <div className='iconColorInactive'>
                        <MdNotifications size={25} />
                    </div>
                    {isAuthenticated && <div className={dropdownActive ? 'iconColorActive md:mr-5' : 'iconColorInactive relative md:mr-5'}>
                        <MdPerson size={25} onClick={() => setDropdown(!dropdownActive)} />
                        <Profile active={dropdownActive} wrapperRef={wrapperRef} type={user === null ? 'user' : user.attributes.type} />
                    </div>}
                    <div className='hidden lg:block'>
                        {!isAuthenticated && <div className='primaryButton  mr-5'>
                            <button className='flex flex-row gap-3' onClick={() => setPopup(true)} ><MdAccountBalanceWallet size={25} />Sign in</button>
                        </div>}
                    </div>

                    <div className='block lg:hidden mr-5'>
                        {!isAuthenticated &&
                            <div className='iconColorInactive' onClick={() => setPopup(true)} ><MdAccountBalanceWallet size={25} /></div>
                        }
                    </div>

                </div>
            </div>
        </div>);


}



export default SearchBar