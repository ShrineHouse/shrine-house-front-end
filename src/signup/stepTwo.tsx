import * as React from 'react';
import Logo from '../components/general/logo';
import { convertBase64 } from '../helpers/database';


const StepTwo = (props: { setStep: Function, setSocialsData:Function }) => {
    const initImg = 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png?20170328184010';
    const [image, setImage] = React.useState(initImg)
    const [file, setFile] = React.useState()
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const baseImage = await convertBase64(file)
        let socialsData = {
            'image': baseImage,
            'spotify': (event.target as any)[1].value,
            'instagram': (event.target as any)[2].value,
            'twitter': (event.target as any)[3].value,
        }
        props.setSocialsData(socialsData)
        props.setStep(2)
    }
    function onImageChange(e: any) {
        setImage(URL.createObjectURL(e.target.files[0]))
        setFile(e.target.files[0])
    }

    function handleClick() {
        let element: HTMLElement = document.querySelector('input[type="file"]') as HTMLElement;
        element.click();
    };

    return (

        <div className='flex flex-col items-center justify-center   h-full gap-5 p-10 px-20'>
            <div className='h-20 w-20'>
                <Logo />
            </div>
            <div className='titleText -mt-7 text-center'>Complete your profile</div>
            <form className='formLol flex flex-col gap-5 w-full' onSubmit={handleSubmit}>
                <>
                    <div className='mx-auto relative' onClick={handleClick}>
                        <img src={image} className='object-cover   w-36 h-36  rounded-full' />
                        <div className='absolute bottom-0 right-0 h-10 text-center w-10 mx-auto text-white text-2xl primaryColorBg rounded-full'>
                            {image === initImg ? <p>+</p> : <p>x</p>}
                        </div>
                    </div>
                    <input type='file' style={{ display: 'none' }} accept='image/*' onChange={onImageChange} />
                </>

                <input className='inputFieldText' name="spotifyUrl" placeholder='Spotify url' type='text' />
                <input className='inputFieldText' name="instagramUrl" placeholder='Instagram url' type='text' />
                <input className='inputFieldText' name="twitterUrl" placeholder='Twitter url' type='text' />

                <input type='submit' className='primaryButtonSubmit' id='submit' value='Create account' />
            </form>
        </div>

    )
}
export default StepTwo