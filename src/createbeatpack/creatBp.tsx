import * as React from 'react';
import { MoralisObjectSaveData, useMoralis, useMoralisCloudFunction, useMoralisFile, useNewMoralisObject } from 'react-moralis';
import Logo from '../components/general/logo';

import { convertBase64 } from '../helpers/database';
import JSZip from 'jszip';
import BeatPack, { Beat } from '../interfaces/beats';
import { CircularProgress } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { removeExtension } from '../helpers/utils';
import { v4 as uuidv4 } from 'uuid';

function StepOneBp() {
    const emptyBp: Beat[] = []
    const [genres, setGenres] = React.useState([]);
    //Just a placeholder
    const initImg = 'https://media.istockphoto.com/vectors/thumbnail-image-vector-graphic-vector-id1147544807?k=20&m=1147544807&s=612x612&w=0&h=pBhz1dkwsCMq37Udtp9sfxbjaMl27JUapoyYpQm0anc=';
    const [image, setImage] = React.useState(initImg)
    const [file, setFile] = React.useState()
    const [beatFile, seatBeatFile] = React.useState()
    const { user } = useMoralis();
    const { save } = useNewMoralisObject('beats');
    const navigate = useNavigate()
    const { saveFile } = useMoralisFile();
    const { fetch } = useMoralisCloudFunction("getGenres")

    const [isUploading, setUploading] = React.useState(false)
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        setUploading(true)
        event.preventDefault();
        const baseImage: any = await convertBase64(file)

        if (user !== null) {
            let beatpackData: BeatPack = {
                imageUrl: baseImage,
                beatPackName: (event.target as any)[4].value,
                beatPackPrice: Number((event.target as any)[1].value),
                royaltyIndex: Number((event.target as any)[3].value),
                genre: (event.target as any)[5].value,
                description: (event.target as any)[6].value,
                artistName: user.attributes.fullName,
                beatPackUrl: '',
                beats: emptyBp,
                downloads: 0,
                ownerWallet: user.attributes.wallet,
                objectId: ''
            }
            await handleZip(beatFile, (event.target as any)[2].value, Number((event.target as any)[3].value), beatpackData)
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

        if (event.target.files[0].size >= 52428800) {
            alert('File size too big, max. allowed is 50mb')
            event.target.value = '';
            return;
        }
        seatBeatFile(event.target.files[0])
    }

    async function handleZip(file: any, beatPrice: number, royaltyIndex: number, beatpackData: BeatPack) {
        var zipe = new JSZip();
        var beats: Beat[] = []
        const standardUrl = "https://ipfs.moralis.io:2053/ipfs/"

        const zip = await zipe.loadAsync(file);
        const allFiles: Object = zip.files;

        const keys = Object.keys(allFiles)
        let i = 0;

        for await (var elem of keys) {
            if (elem.includes('__MACOSX/._') || elem.includes('__MACOSX')) {
            } else if (elem.includes('.mp3') || elem.includes('.wav')) {

                try {
                    var fileData = await zip.files[elem].async('blob')
                    const newFile = new File([fileData], elem);
                    let name = newFile.name.substring(newFile.name.indexOf("/") + 1);
                    name = removeExtension(name)
                    name = name.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');
                    const uploadFile = await saveFile(uuidv4(), newFile, { saveIPFS: true })
                    if ((user !== null && uploadFile !== undefined)) {
                        const dlUrl = standardUrl + uploadFile.name().replace('.txt', '')
                        beats.push({ beatArtist: user.attributes.fullName, beatDownloadUrl: dlUrl, beatPrice: beatPrice, beatUrl: dlUrl, royaltyIndex: royaltyIndex, beatName: name })
                    }
                } catch (e) {
                    alert(e)
                }
            }
        }

        let zipName = beatpackData.beatPackName.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');

        const uppedZip = await saveFile(uuidv4(), file, {
            saveIPFS: true, onError(error) {
                setUploading(false)
                alert('Your beatpack could not be uploaded')
            }
        });
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
                onError(error) {
                    setUploading(false)
                    alert('Your beatpack could not be uploaded')
                },

                onComplete: () => {
                    setUploading(false)
                    navigate('/')
                }

            })
        }
    }

    React.useEffect(() => {
        fetch({
            onSuccess(results: any) {
                results.map((a: any) => setGenres(a.attributes.genres))
            },
        })
    }, [])


    return (
        <div className='flex flex-col items-center justify-center min-h-full gap-5 p-10 px-20 rounded-xl'>
            <div className='h-20 w-20'>
                <Logo />
            </div>
            <div className='titleText -mt-7'>Adding to the Shrine?</div>
            <form className='formLol flex flex-col gap-5 w-full' onSubmit={(e) => handleSubmit(e)}>
                <>
                    <div className='mx-auto relative' onClick={handleClick}>
                        <img src={image} className='object-cover w-36 h-36 rounded-full' />
                        <div className='absolute bottom-0 right-0 h-10 text-center w-10 mx-auto text-white text-2xl primaryColorBg rounded-full'>
                            {image === initImg ? <p>+</p> : <p>x</p>}
                        </div>
                    </div>
                    <input type='file' style={{ display: 'none' }} required={true} accept='image/*' onChange={onImageChange} />
                </>
                <div className='flex flex-row gap-5'>
                    <input className='inputFieldText' title="The pricec of the beatpack" required={true} name="name" placeholder='Beatpack price' type='number' />
                    <input className='inputFieldText' title="The price of an individual track" required={true} name="name" placeholder='Beat price' type='number' />
                    <input className='inputFieldText' title="The percentage of royalties you wish to receive" required={true} min={0} max={12} placeholder='Royalty split' type='number' /></div>
                <input className='inputFieldText' required={true} name="legal" placeholder='Beatpack name' type='text' />

                <input className='inputFieldText' required={true} placeholder='Genre' type='text' list="properties-list" />
                <datalist id="properties-list">

                    {genres.map((g) => <option>{g}</option>)}
                </datalist>
                <textarea className='inputFieldText rounded-xl' required={true} placeholder='Description' rows={5} aria-multiline={true} />
                <input
                    onChange={onZipChange}
                    type="file"
                    id='zip'
                    accept=".zip,.rar,.7zip"
                    required={true}
                />
                <div className='mx-auto'>
                    {isUploading && <CircularProgress isIndeterminate />}

                </div>
                {!isUploading && <input type='submit' className='primaryButtonSubmit rounded-full' id='submit' value='Submit & Upload Beatpack' />}

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
                <div className='grid grid-cols-2 gap-10 m-10 mx-auto'>
                    <div className='wizardWrapper shadow z-20 relative '>
                        <StepOneBp />

                    </div>
                    <div className='flex flex-col justify-center  gap-5 z-10'>
                        <div className='whiteHeading w-8/12'>
                            You choose
                        </div>
                        <div className='signupText'>

                            <li>Price your tracks as a package and individually</li>
                            <li>Producers deserve Publishing Royalties—tell them how much</li>
                            <li>Every baby deserves a name</li>
                            <li>Choose a genre that best describes your work… because genre still matters apparently</li>
                            <li>Help the artist understand your vision by giving them 2-3 sentences describing the vibes</li>
                            <li>Upload a .zip file containing your beats (max. 50mb)</li>

                        </div>
                    </div>
                </div>

                <div className='wizardInfoUnderneath shadow z-0 absolute w-full'>
                    <div className='absolute wizardInfoScreen w-screen h-screen' ></div>
                </div>

            </div>
        </div >
    )
}

export default CreateBp