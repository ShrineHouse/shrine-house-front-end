import * as React from 'react';

import { GiShintoShrine } from 'react-icons/gi';
import { AiFillHome, AiFillCheckCircle } from 'react-icons/ai';
import { MdMusicNote, MdPerson } from 'react-icons/md';
import Logo from './logo';
const Sidebar = (props: { tabIndex: Number, setTabIndex: Function }) => {
    return (
        <div className='h-screen w-24 bg-white py-10 flex flex-col gap-5 items-center'>
            <div className='p-5'>
                <Logo />
            </div>
            <div className=' border border-solid w-full' />

            <div className={props.tabIndex === 0 ? "sideBarIcon w-full flex flex-row justify-center py-5" : " w-full flex flex-row justify-center sideBarIconInActive"} onClick={() => props.setTabIndex(0)}>
                <GiShintoShrine size={40} />
            </div>
            <div className={props.tabIndex === 1 ? "sideBarIcon w-full flex flex-row justify-center py-5" : " w-full flex flex-row justify-center sideBarIconInActive"} onClick={() => props.setTabIndex(1)}>
                <AiFillHome size={40} />

            </div>
            <div className={props.tabIndex === 2 ? "sideBarIcon  w-full flex flex-row justify-center py-5" : " w-full flex flex-row justify-center sideBarIconInActive"} onClick={() => props.setTabIndex(2)}>
                <MdMusicNote size={40} />
            </div>

        </div>
    );
}
export default Sidebar