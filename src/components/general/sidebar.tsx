import * as React from 'react';

import { AiFillHome } from 'react-icons/ai';
import { MdMusicNote } from 'react-icons/md';
import BeatPackLogo from '../icons/BeatpackLogo';
import HomeIcon from '../icons/Home';
const Sidebar = (props: { tabIndex: Number, setTabIndex: Function }) => {
    return (
        <div className='h-screen w-24 bg-white py-10 flex flex-col gap-5 items-center justify-center shadow-md fixed z-20'>


            <div className={props.tabIndex === 0 ? "sideBarIcon w-full flex flex-row justify-center py-5 px-7" : " w-full flex flex-row justify-center sideBarIconInActive px-7"} onClick={() => props.setTabIndex(0)}>
                <HomeIcon />

            </div>
            <div className={props.tabIndex === 1 ? "sideBarIcon  w-full flex flex-row justify-center py-5 mb-20 px-7" : " w-full flex flex-row justify-center sideBarIconInActive mb-20 px-7"} onClick={() => props.setTabIndex(1)}>
                <BeatPackLogo />
            </div>

        </div>
    );
}
export default Sidebar