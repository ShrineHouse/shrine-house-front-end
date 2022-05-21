import * as React from 'react';
import { useMoralis } from 'react-moralis';

const SignupPage = () => {
    const { logout, user, auth } = useMoralis();

    if (auth.state !== 'authenticated') {
        return <h1>Please connect your wallet before signing up.</h1>
    }
    return (
        <div>
            <div className='backgroundCol min-h-screen min-w-screen flex flex-row relative '>
                <div className='wizardWrapper shadow z-20 relative p-10'>
                    <div className='flex flex-col'>
                        <h1>Apply as an artist or producer</h1>
                    </div>
                </div>

                <div className='wizardInfoUnderneath shadow z-0 relative right-0'>
                </div>
                <div className='wizardInfoScreen shadow z-10 absolute right-0'>
                </div>
            </div>

        </div>
    )
}

export default SignupPage