import * as React from 'react';

import { GiShintoShrine } from 'react-icons/gi';
import { AiFillHome } from 'react-icons/ai';
import { MdMusicNote } from 'react-icons/md';
const Sidebar = (props: { tabIndex: Number, setTabIndex: Function }) => {
    return (
        <div className='h-screen w-24 bg-white py-10 flex flex-col gap-5 items-center justify-center shadow-md'>

            <div className={props.tabIndex === 0 ? "sideBarIcon w-full flex flex-row justify-center py-5" : " w-full flex flex-row justify-center sideBarIconInActive"} onClick={() => props.setTabIndex(0)}>
                <GiShintoShrine size={40} />
            </div>
            <div className={props.tabIndex === 1 ? "sideBarIcon w-full flex flex-row justify-center py-5" : " w-full flex flex-row justify-center sideBarIconInActive"} onClick={() => props.setTabIndex(1)}>
                <AiFillHome size={40} />

            </div>
            <div className={props.tabIndex === 2 ? "sideBarIcon  w-full flex flex-row justify-center py-5 mb-20" : " w-full flex flex-row justify-center sideBarIconInActive mb-20"} onClick={() => props.setTabIndex(2)}>
                <MdMusicNote size={40} />
            </div>

        </div>
    );
}
export default Sidebar