import * as React from 'react';
import { useMoralis, useMoralisQuery } from 'react-moralis';
import { useQuery } from 'react-query';
import Logo from '../components/general/logo';
import StepThree from './stepThree';
import StepTwo from './stepTwo';
import { upUser, upUserSocials } from '../interfaces/users'
import { getGenres } from '../helpers/database';

function StepOne(props: { setStep: Function, setData: Function }) {
    const [switchState, setSwitchState] = React.useState(false)
    const { fetch } = useMoralisQuery("genres")
    const [genre, setGenre] = React.useState('No genre');
    const { data } = useQuery('genres', () => fetch())

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        let signupData = {
            'legalName': (event.target as any)[0].value,
            'artistName': (event.target as any)[1].value,
            'email': (event.target as any)[2].value,
            'birth': (event.target as any)[3].value,
            'artist': (event.target as any)[4].value,
            'genre': genre,
            'type': switchState === true ? 'artist' : 'producer',
        }
        props.setData(signupData)

        props.setStep(1)
    }

    function buildGenres() {
        if (data !== undefined) {
            const de = getGenres(data)
            return de.map((genre) => <option>{genre}</option>)
        }
        return <ul>Loading genres...</ul>

    }
    return (<div className='flex flex-col items-center justify-center min-h-screen gap-5 p-10 px-20'>
        <div className='h-20 w-20'>
            <Logo />
        </div>
        <div className='titleText'>Create your account</div>
        <form className='formLol flex flex-col gap-5 w-full' onSubmit={(e) => handleSubmit(e)}>
            <input className='inputFieldText' name="legal" placeholder='Legal name' type='text' />
            <input className='inputFieldText' name="name" placeholder='Artist/producer name' type='text' />
            <input className='inputFieldText' placeholder='Email' type='email' />
            <input className='inputFieldText' placeholder='Birthdate' type='date' />
            <div >
                <datalist id="suggestions">
                    {buildGenres()}
                </datalist>
                <input autoComplete="on" className='inputFieldText' list="suggestions" placeholder='Pick a genre' required={true} onChange={(e) => {
                    setGenre(e.target.value)
                }} />
            </div>
            <label style={{
                'marginTop': '-20px'
            }}>
                <input style={{
                    'visibility': 'hidden',
                    'height': '0px'
                }} type="checkbox" checked={switchState} value={`${switchState}`} onChange={e => {
                    setSwitchState(e.target.checked);
                }} />
                <div className='flex flex-row switch justify-between '>
                    <div className={switchState ? 'switchActive' : 'switchInactive'}>
                        Artist
                    </div>
                    <div className={!switchState ? 'switchActive' : 'switchInactive'}>
                        Producer
                    </div>
                </div>
            </label>
            <input type='submit' className='primaryButton rounded-full' id='submit' value='Submit' />
        </form>
    </div>);
}


const SignupPage = () => {
    const { auth } = useMoralis();
    const emptyUser: upUser = { artistName: '', birth: '', email: '', legalName: '', type: 'user', genre: 'none' }
    const emptyUserSoc: upUserSocials = { image: '', instagram: '', spotify: '', twitter: '' }
    const [step, setStep] = React.useState(0)
    const [data, setData] = React.useState(emptyUser)
    const [dataSocials, setSocialsData] = React.useState(emptyUserSoc)

    if (auth.state !== 'authenticated') {
        return <h1>Please connect your wallet before signing up.</h1>
    }



    return (
        <div>
            <div className='backgroundCol min-h-screen min-w-screen flex flex-row relative '>
                <div className='wizardWrapper shadow z-20 relative'>
                    {step === 0 && <StepOne setStep={setStep} setData={setData} />}

                    {step === 1 && <StepTwo setStep={setStep} setSocialsData={setSocialsData} />}

                    {step === 2 && <StepThree data={data} dataSocials={dataSocials} />}

                </div>

                <div className='wizardInfoUnderneath shadow z-0 relative right-0'>
                </div>
                <div className='wizardInfoScreen shadow z-10 absolute right-0'>
                    <div className='flex flex-col justify-center h-screen pl-10 gap-5'>
                        <div className='whiteHeading w-8/12'>
                            Empowering artists and producers
                        </div>
                        <div className='signupText'>
                            Join us on our journey to reimagine the music industry <br />
                            by providing a platform that delivers high-quality content
                        </div>
                    </div>
                </div>
            </div>

        </div >
    )
}

export default SignupPage