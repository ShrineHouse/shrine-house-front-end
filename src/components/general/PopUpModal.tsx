import React from 'react'
import { CloseButton } from './CloseButton';
type Props = {
    isOpen: boolean,
    close: Function,
    children: any,

};

export const PopUp: React.FC<Props> = ({ isOpen, close, children }) => {
    return (
        <>
            <div className={isOpen ? 'popupOverlayActive h-screen w-screen fixed z-50 top-0 left-0' : 'popupOverlay top-0 left-0 h-screen w-screen fixed z-50'} />


            <div className={isOpen ? 'popUpActive shadow-md' : 'popUp'}>


                <div className='z-50 flex flex-col relative '>
                    <CloseButton close={close} />
                    <div className='px-10 py-10 md:p-10 relative   overflow-hidden'>

                        <div className='h-full w-full fixed z-0 top-0 left-0 '>
                            <div className='ellipse1' />
                            <div className='ellipse2' />
                        </div>
                        <div className='flex flex-col relative z-50'>
                            {children}

                        </div>

                    </div>
                </div>
            </div>

        </>

    )
}