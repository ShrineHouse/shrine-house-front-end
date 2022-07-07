import React from 'react'
export const CloseButton = (props: { close: Function }) => {
    return <div className='flex flex-row justify-end'> <div
        className="text-xl z-50 text-gray-600 pt-5 pr-5 cursor-pointer"
        onClick={() => props.close()}>
        Close
    </div></div>
}