import * as React from 'react';

import BeatPackLogo from '../icons/BeatpackLogo';
import HomeIcon from '../icons/Home';

import { IoIosArrowForward } from 'react-icons/io'
import NftLogo from '../icons/NftDisplayLogo';
const Sidebar = (props: { tabIndex: Number, setTabIndex: Function, className: string, classNameTool: string }) => {
    return (
        <>
            <div className={`absolute top-0 mt-24 py-5 left-0 z-30 bg-gray-500 bg-opacity-25 ${props.classNameTool}`}>
                <IoIosArrowForward size={24} color="#F07735" />
            </div>
            <div className={`h-screen overflow-hidden transition-all bg-white py-10 flex flex-col gap-5 items-center justify-center shadow-md fixed z-20 ${props.className}`}>

                <div className={props.tabIndex === 0 ? "sideBarIcon w-full flex flex-row justify-center py-5 px-7" : " w-full flex flex-row justify-center sideBarIconInActive px-7"} onClick={() => props.setTabIndex(0)}>
                    <HomeIcon />
                </div>
                <div className={props.tabIndex === 1 ? "sideBarIcon  w-full flex flex-row justify-center py-5 px-7" : " w-full flex flex-row justify-center sideBarIconInActive px-7"} onClick={() => props.setTabIndex(1)}>
                    <NftLogo />
                </div>
                <div className={props.tabIndex === 2 ? "sideBarIcon  w-full flex flex-row justify-center py-5 mb-20 px-7" : " w-full flex flex-row justify-center sideBarIconInActive mb-20 px-7"} onClick={() => props.setTabIndex(2)}>
                    <BeatPackLogo />
                </div>
            </div>

        </>


    );
}
export default Sidebar