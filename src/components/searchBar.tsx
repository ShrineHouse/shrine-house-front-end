import * as React from 'react';
import Logo from "./logo";
import { MdAccountBalanceWallet, MdNotifications } from 'react-icons/md';

function SearchBar() {
    return (<div className="flex flex-col container mx-auto">
        <div className='bg-white h-20  mt-10 flex flex-row p-5 borderRadiusComponents relative gap-5 justify-between'>
            <div className='flex flex-row gap-3'>
                <Logo />
                <div className='self-center'>
                    <h1>SHRINE HOUSE</h1>
                </div>
                <input placeholder='Search shrine' className='textInput' />
            </div>
            <div className='flex flex-row items-center gap-3'>
                <div className='iconColorInactive'>
                    <MdAccountBalanceWallet size={25} />
                </div>
                <div className='iconColorInactive'>
                    <MdNotifications size={25} />
                </div>
            </div>
        </div>
    </div>);
}

export default SearchBar