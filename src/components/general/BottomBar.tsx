import * as React from 'react';

import BeatPackLogo from '../icons/BeatpackLogo';
import HomeIcon from '../icons/Home';

import NftLogo from '../icons/NftDisplayLogo';
const BottomBar = (props: { tabIndex: Number, setTabIndex: Function }) => {
    return (
        <>

            <div className={`bottom-0 overflow-hidden transition-all bg-white grid grid-cols-3 gap-5 shadow-md fixed z-20 h-14 w-screen `}>
                <div className={props.tabIndex === 0 ? "sideBarIcon h-full flex flex-col justify-center " : "h-full flex flex-col justify-center sideBarIconInActive "} onClick={() => props.setTabIndex(0)}>
                    <div className='h-7'>
                        <HomeIcon />
                    </div>
                </div>
                <div className={props.tabIndex === 1 ? "sideBarIcon   h-full flex flex-col justify-center  " : " h-full flex flex-col justify-center sideBarIconInActive"} onClick={() => props.setTabIndex(1)}>
                    <div className='h-6'>
                        <NftLogo />
                    </div>

                </div>
                <div className={props.tabIndex === 2 ? "sideBarIcon  h-full flex flex-col justify-center " : " h-full flex flex-col justify-center sideBarIconInActive  "} onClick={() => props.setTabIndex(2)}>
                    <div className='h-7  '>
                        <BeatPackLogo />
                    </div>
                </div>
            </div>

        </>


    );
}
export default BottomBar