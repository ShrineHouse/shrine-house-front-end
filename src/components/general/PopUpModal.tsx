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
            <div className={isOpen ? 'popupOverlayActive h-screen w-screen fixed z-50' : 'popupOverlay h-screen w-screen fixed z-50'} />


            <div className={isOpen ? 'popUpActive shadow-md' : 'popUp'}>
                <div className='h-full w-full absolute overflow-hidden rounded-xl'>
                    <div className='ellipse1' />
                    <div className='ellipse2' />
                </div>

                <div className='z-50 flex flex-col relative '>
                    <CloseButton close={close} />
                    <div className='flex flex-col p-24'>
                        {children}
                    </div>
                </div>
            </div>

        </>

    )
}