import * as React from 'react';
import { MoralisObjectSaveData, useMoralis, useMoralisFile, useNewMoralisObject } from 'react-moralis';
import { useMutation, useQuery } from 'react-query';
import Logo from '../components/logo';
import StepThree from './stepThree';
import StepTwo from './stepTwo';
import { upUser, upUserSocials } from '../interfaces/users'
import { convertBase64 } from '../helpers/database';
import JSZip from 'jszip';
import BeatPack, { Beat } from '../interfaces/beats';
import { CircularProgress } from '@chakra-ui/react';
import { Navigate, useNavigate } from 'react-router-dom';

function StepOneBp() {
    const emptyBp: Beat[] = []
    const initImg = 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png?20170328184010';
    const [image, setImage] = React.useState(initImg)
    const [file, setFile] = React.useState()
    const [beatFile, seatBeatFile] = React.useState()
    const { user } = useMoralis();
    const { isSaving, error, save } = useNewMoralisObject('beats');
    const navigate = useNavigate()
    const { saveFile, } = useMoralisFile();

    const [isUploading, setUploading] = React.useState(false)

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        setUploading(true)
        event.preventDefault();
        const baseImage: any = await convertBase64(file)
        if (user !== null) {
            let beatpackData: BeatPack = {
                imageUrl: baseImage,
                beatPackName: (event.target as any)[1].value,
                beatPackPrice: Number((event.target as any)[2].value),
                royaltyIndex: Number((event.target as any)[4].value),
                genre: (event.target as any)[5].value,
                description: (event.target as any)[6].value,
                artistName: user.attributes.fullName,
                beatPackUrl: '',
                beats: emptyBp,
                downloads: 0,
                ownerWallet: user.attributes.wallet,
            }
            await handleZip(beatFile, (event.target as any)[3].value, Number((event.target as any)[4].value), beatpackData)
        }



    }
    function handleClick() {
        let element: HTMLElement = document.querySelector('input[type="file"]') as HTMLElement;
        element.click();
    };

    function onImageChange(e: any) {
        setImage(URL.createObjectURL(e.target.files[0]))
        setFile(e.target.files[0])
    }

    function onZipChange(event: any) {
        seatBeatFile(event.target.files[0])
    }

    async function handleZip(file: any, beatPrice: number, royaltyIndex: number, beatpackData: BeatPack) {
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
                try {
                    console.log(elem)
                    var fileData = await zip.files[elem].async('blob')
                    const newFile = new File([fileData], elem);
                    const name = newFile.name.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');
                    const uploadFile = await saveFile(name, newFile, { saveIPFS: true })
                    if ((user !== null && uploadFile !== undefined)) {
                        const dlUrl = standardUrl + uploadFile.name().replace('.txt', '')
                        beats.push({ beatArtist: user.attributes.fullName, beatDownloadUrl: dlUrl, beatPrice: beatPrice, beatUrl: dlUrl, royaltyIndex: royaltyIndex, beatName: newFile.name })
                    }
                } catch (e) {
                    console.log(e)
                }
            }
        }
        const uppedZip = await saveFile(zip.name, file, { saveIPFS: true })
        if (uppedZip !== undefined) {
            const dlUrl = standardUrl + uppedZip.name().replace('.zip', '')
            let uploadData: MoralisObjectSaveData = {
                artistName: beatpackData.artistName,
                beatPackName: beatpackData.beatPackName,
                beatPackPrice: beatpackData.beatPackPrice,
                description: beatpackData.description,
                downloads: beatpackData.downloads,
                genre: beatpackData.genre,
                imageUrl: beatpackData.imageUrl,
                ownerWallet: beatpackData.ownerWallet,
                royaltyIndex: beatpackData.royaltyIndex,
                beatPackUrl: dlUrl,
                beats: beats,
            }

            save(uploadData, {
                onError: (e) => {
                    console.log(e)
                },
                onComplete: () => {
                    setUploading(false)
                    navigate('/')
                }

            })
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
                    <input type='file' style={{ display: 'none' }} required={true} accept='image/*' onChange={onImageChange} />
                </>
                <div className='flex flex-row gap-3'>                <input className='inputFieldText' required={true} name="name" placeholder='Beatpack price' type='number' />
                    <input className='inputFieldText' required={true} name="name" placeholder='Individual beat price' type='number' />
                    <input className='inputFieldText' required={true} min={0} max={12} placeholder='Royalty index' type='number' /></div>
                <input className='inputFieldText' required={true} name="legal" placeholder='Beatpack name' type='text' />

                <input className='inputFieldText' required={true} placeholder='Genre' type='text' />
                <textarea className='inputFieldText rounded-xl' required={true} placeholder='Description' rows={5} aria-multiline={true} />
                <input
                    onChange={onZipChange}
                    type="file"
                    id='zip'
                    accept=".zip,.rar,.7zip"
                    required={true}
                />
                {isUploading && <CircularProgress isIndeterminate />}
                {!isUploading && <input type='submit' className='primaryButton rounded-full' id='submit' value='Submit' />}
            </form>
        </div>
    );
}


const CreateBp = () => {
    const { auth } = useMoralis();




    if (auth.state !== 'authenticated') {
        return <h1>Please connect your wallet before signing up.</h1>
    }



    return (
        <div>
            <div className='backgroundCol min-h-screen min-w-screen flex flex-row relative '>
                <div className='wizardWrapper shadow z-20 relative'>
                    <StepOneBp />
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