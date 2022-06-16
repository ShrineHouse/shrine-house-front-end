import React from 'react'
import { CircularProgress } from "@chakra-ui/react";

export default function LoadingWidget() {
    return <div className='w-screen h-screen flex flex-row items-center justify-center '>
        <div className='m-auto'>
            <CircularProgress isIndeterminate />
        </div>
    </div>;
}