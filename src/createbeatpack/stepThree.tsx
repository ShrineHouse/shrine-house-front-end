import Moralis from 'moralis/types';
import * as React from 'react';
import { MoralisObjectSaveData, useMoralis, useNewMoralisObject } from 'react-moralis';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/logo';
import { useGetFetchQuery } from '../helpers/state';
import { DbUser, upUser, upUserSocials } from '../interfaces/users';


const StepThree = (props: { data: upUser, dataSocials: upUserSocials }) => {
    const initImg = 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png?20170328184010';
    const [image, setImage] = React.useState(initImg)
    const { isSaving, error, save, } = useNewMoralisObject('_Users');
    const { user } = useMoralis();
    console.log(props.data, props.dataSocials)
    const navigate = useNavigate();

    async function updateUser() {
        if (user !== null) {
            const dbUser: DbUser = {
                id: '',
                apy: { apyArtist: 0, popArist: 0, totalStaked: 0 },
                balance: 0,
                orders: 0,
                dateOfBirth: props.data.birth,
                email: props.data.email,
                fullName: props.data.artistName,
                legalName: props.data.legalName,
                genre: '',
                image: props.dataSocials.image,
                passphrase: [],
                phoneNumber: '',
                socials: {
                    instagram: props.dataSocials.instagram,
                    spotify: props.dataSocials.spotify,
                    twitter: props.dataSocials.twitter
                },
                type: props.data.type,
                verified: false,
                wallet: user.attributes.ethAddress
            }
            user.set('apy', dbUser.apy)
            user.set('balance', dbUser.balance)
            user.set('dateOfBirth', dbUser.dateOfBirth)
            user.set('email', dbUser.email)
            user.set('fullName', dbUser.fullName)
            user.set('legalName', dbUser.legalName)
            user.set('genre', dbUser.genre)
            user.set('image', dbUser.image)
            user.set('passphrase', dbUser.passphrase)
            user.set('phoneNumber', dbUser.phoneNumber)
            user.set('socials', dbUser.socials)
            user.set('type', dbUser.type)
            user.set('verified', dbUser.verified)
            user.set('wallet', dbUser.wallet)

            user.save()
            navigate('/')
        }

    }
    return (

        <div className='flex flex-col items-center justify-center min-h-screen gap-5 p-10 px-20'>
            <div className='h-20 w-20'>
                <Logo />
            </div>
            <div className='titleText'>Registration complete</div>
            <button onClick={updateUser}>save</button>
        </div>

    )
}
export default StepThree