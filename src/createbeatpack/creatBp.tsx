import * as React from 'react';
import { useMoralis, useMoralisFile } from 'react-moralis';
import { useMutation, useQuery } from 'react-query';
import Logo from '../components/logo';
import StepThree from './stepThree';
import StepTwo from './stepTwo';
import { upUser, upUserSocials } from '../interfaces/users'
import { convertBase64 } from '../helpers/database';
import JSZip from 'jszip';
import { Beat } from '../interfaces/beats';

function StepOneBp(props: { setStep: Function, setData: Function }) {
    const [switchState, setSwitchState] = React.useState(false)
    const initImg = 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png?20170328184010';
    const [image, setImage] = React.useState(initImg)
    const [file, setFile] = React.useState()
    const [beatZip, setBeatZip] = React.useState('')
    const [uploadedBeats, setUppedBeats] = React.useState({})
    const { user } = useMoralis();

    const {
        error,
        isUploading,
        moralisFile,
        saveFile,
    } = useMoralisFile();
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const baseImage = convertBase64(file)
        let beatpackData = {
            'imageUrl': baseImage,
            'beatPackName': (event.target as any)[1].value,
            'beatPackPrice': (event.target as any)[2].value,
            'beatPrice': (event.target as any)[3].value,
            'royaltyIndex': (event.target as any)[4].value,
            'genre': (event.target as any)[5].value,
            'description': (event.target as any)[6].value,
        }
        props.setData(beatpackData)

        props.setStep(1)
    }
    function handleClick() {
        let element: HTMLElement = document.querySelector('input[type="file"]') as HTMLElement;
        element.click();
    };
    function handleClickZip() {
        let element: HTMLElement = document.querySelector('zip') as HTMLElement;
        element.click();
    };
    function onImageChange(e: any) {
        setImage(URL.createObjectURL(e.target.files[0]))
        setFile(e.target.files[0])
    }

    function onZipChange(event: any) {
        handleZip(event.target.files[0])
    }

    console.log(uploadedBeats)
    console.log(beatZip)


    async function handleZip(file: any) {
        var zipe = new JSZip();
        var beats: Beat[] = []
        const standardUrl = "https://ipfs.moralis.io:2053/ipfs/"

        const zip = await zipe.loadAsync(file);
        const allFiles: Object = zip.files;
        console.log(user)
        console.log('user')

        const keys = Object.keys(allFiles)
        let i = 0;

        for await (var elem of keys) {
            if (elem.includes('__MACOSX/._')) {
            } else {
                console.log(elem)
                zip.files[elem].async('blob').then(async function (fileData) {
                    const newFile = new File([fileData], 'Cyanide.mp3');
                    const uploadFile = await saveFile(newFile.name, newFile, { saveIPFS: true })
                    if ((user !== null && uploadFile !== undefined)) {
                        const dlUrl = standardUrl + uploadFile.name().replace('.txt', '')
                        beats.push({ beatArtist: user.attributes.fullName, beatDownloadUrl: dlUrl, beatPrice: 12, beatUrl: dlUrl, royaltyIndex: 12 })
                    }
                })
            }
            i++
            if (i === keys.length) {
                const uppedZip = await saveFile(zip.name, file, { saveIPFS: true })
                if (uppedZip !== undefined) {
                    const dlUrl = standardUrl + uppedZip.name().replace('.zip', '')
                    setUppedBeats(beats);
                    setBeatZip(dlUrl)
                }
            }
        }
    }

    return (
        <div className='flex flex-col items-center justify-center min-h-screen gap-5 p-10 px-20'>
            <div className='h-20 w-20'>
                <Logo />
            </div>
            <div className='titleText'>Create your beatpack</div>
            <form className='formLol flex flex-col gap-5 w-full' onSubmit={(e) => handleSubmit(e)}>
                <>
                    <div className='mx-auto relative' onClick={handleClick}>
                        <img src={image} className='object-cover w-36 h-36 rounded-xl' />
                        <div className='absolute bottom-0 right-0 h-10 text-center w-10 mx-auto text-white text-2xl primaryColorBg rounded-full'>
                            {image === initImg ? <p>+</p> : <p>x</p>}
                        </div>
                    </div>
                    <input type='file' style={{ display: 'none' }} accept='image/*' onChange={onImageChange} />
                </>
                <input className='inputFieldText' name="legal" placeholder='Beatpack name' type='text' />
                <input className='inputFieldText' name="name" placeholder='Beatpack price' type='number' />
                <input className='inputFieldText' name="name" placeholder='Individual beat price' type='number' />
                <input className='inputFieldText' placeholder='Royalty index' type='number' />
                <input className='inputFieldText' placeholder='Genre' type='text' />
                <textarea className='inputFieldText rounded-xl' placeholder='Description' rows={5} aria-multiline={true} />
                <input
                    onChange={onZipChange}
                    type="file"
                    id='zip'
                    accept=".zip,.rar,.7zip"
                />
                <input type='submit' className='primaryButton rounded-full' id='submit' value='Submit' />
            </form>
        </div>
    );
}


const CreateBp = () => {
    const { auth } = useMoralis();
    const emptyUser: upUser = { artistName: '', birth: '', email: '', legalName: '', type: 'user' }
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
                    {step === 0 && <StepOneBp setStep={setStep} setData={setData} />}
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

export default CreateBp