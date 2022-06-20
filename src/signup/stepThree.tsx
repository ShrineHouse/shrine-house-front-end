import { Center, CircularProgress } from '@chakra-ui/react';
import * as React from 'react';
import { useMoralis } from 'react-moralis';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/general/logo';
import { DbUser, upUser, upUserSocials } from '../interfaces/users';


const StepThree = (props: { data: upUser, dataSocials: upUserSocials }) => {
    const { user } = useMoralis();
    const [isSaving, setSaving] = React.useState(true)
    const navigate = useNavigate();

    async function updateUser() {
        if (user !== null) {
            setSaving(true);
            const dbUser: DbUser = {
                id: '',
                apy: { apyArtist: 0, popArist: 0, totalStaked: 0 },
                balance: 0,
                dateOfBirth: props.data.birth,
                email: props.data.email,
                fullName: props.data.artistName,
                legalName: props.data.legalName,
                genre: props.data.genre,
                orders: 0,
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
            setSaving(false)

        }

    }

    React.useEffect(() => {
        updateUser()
    }, [])

    return (

        <div className='flex flex-col items-center justify-center gap-5 p-10 px-20'>
            <div className='h-20 w-20'>
                <Logo />
            </div>
            <div className='flex flex-col items-center mx-auto gap-3'>

                {isSaving && <div className='titleText'>We are saving your information</div>}

                {isSaving && <Center><CircularProgress isIndeterminate /></Center>}
                {!isSaving && <div className='titleText'>Info processed</div>}
                {!isSaving && <div className='text-xl text-center'>We successfully processed your information, welcome to Shrine House!</div>}
                {!isSaving && <button className='primaryButton' onClick={() => { navigate('/') }}>Return home</button>}

            </div>


        </div>

    )
}
export default StepThree