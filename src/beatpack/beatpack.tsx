import { ChevronLeftIcon } from '@chakra-ui/icons';
import { Box, CircularProgress, Text, useDisclosure, VStack } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import JsFileDownloader from 'js-file-downloader';
import BeatPack from '../interfaces/beats';
import BeatPackInfo from './components/BeatpackInfo';
import ProducerInfo from './components/ProducerInfo';
import { useMoralis, useMoralisCloudFunction, useTokenPrice, useWeb3Transfer } from 'react-moralis';
import { dataToBeatpackPage, dataToUser } from '../helpers/database';
import { emptyUser } from '../interfaces/users';
import SimilarEntities from './components/SimilarEntities';
import { Link, useParams } from 'react-router-dom';

import Modal from 'react-modal';


const BeatPackPage = () => {
    const emptyBp: BeatPack = {
        artistName: '',
        beatPackName: '',
        beatPackPrice: 0,
        beatPackUrl: '',
        beats: [],
        description: '',
        downloads: 0,
        genre: '',
        imageUrl: '', objectId: '',
        ownerWallet: '',
        royaltyIndex: 0
    };
    const { Moralis } = useMoralis();
    const [modalIsOpen, setIsOpen] = useState(false);

    const { id } = useParams();
    const [bp, setBp] = useState(emptyBp)

    const getBp = useMoralisCloudFunction("getBeatpack", { id: id })
    const [activeTab, setActiveTab] = useState('beat');
    const { fetch } = useMoralisCloudFunction("getUser", { wallet: bp.ownerWallet })
    const [producer, setProducer] = useState(emptyUser)
    const { data: formattedData } = useTokenPrice({ address: "0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0", chain: "eth" });

    console.log(formattedData)
    useEffect(() => {
        console.log('di')


        if (bp.artistName === '') {
            getBp.fetch({
                onSuccess(res) {
                    const result = res as any;

                    const _bp = dataToBeatpackPage(result as any);
                    setBp(_bp)
                    console.log(_bp)

                }
            })
            return
        }
        fetch({
            onSuccess(results) {
                setProducer(dataToUser(results as any))
            },
        });

    }, [bp])



    function onDownload() {
        new JsFileDownloader({
            url: bp.beatPackUrl,
        })
            .then(function () {
                // Called when download ended
            })
            .catch(function (error) {
                // Called when an error occurred
            });
    }
    function openModal() {
        setIsOpen(true);
    }



    function closeModal() {
        setIsOpen(false);
    }
    const customStyles = {
        content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            borderRadius: '20px'
        },
    };

    const transfer = useWeb3Transfer({
        amount: Moralis.Units.ETH(formattedData === null ? 0 : bp.beatPackPrice / formattedData.usdPrice),
        receiver: bp.ownerWallet,
        type: "native",
    });

    if (producer.fullName === 'No name') {
        return <div className='w-screen h-screen flex flex-row items-center justify-center '>
            <div className='m-auto'>
            <CircularProgress isIndeterminate />

            </div>
        </div>
    }

    return (
        <div className='container mx-auto'>
            <>

                <Modal
                    isOpen={modalIsOpen}
                    onRequestClose={closeModal}
                    style={customStyles}
                    contentLabel="Example Modal"

                >
                    <div className='flex flex-col gap-3 modalWidth'>
                        <h2 className='text-3xl text-center font-bold'>Complete checkout</h2>
                        <div className=' bg-gray-100 w-full h-1 mb-10'></div>
                        <div className="flex flex-row w-full justify-between">
                            <div className='font-bold'>Item</div>
                            <div className='font-bold'>Total</div>
                        </div>

                        <div className=' bg-gray-100 w-full h-1'></div>
                        <div className='flex flex-row justify-between w-full items-center'>
                            <div className='flex flex-row gap-5'>
                                <img src={bp.imageUrl} className=" object-cover h-32 w-32 rounded-xl" />
                                <div className='flex flex-col justify-center'>
                                    <div className='font-bold primaryColor text-2xl'>{producer.fullName}</div>
                                    <div className='font-bold text-xl'>{bp.beatPackName}</div>
                                    <div className=' text-gray-400'>royalties: {bp.royaltyIndex}%</div>
                                </div>
                            </div>
                            <div className='flex flex-col justify-center items-end'>
                                <div className='font-bold text-2xl'>
                                    ${bp.beatPackPrice}

                                </div>
                                <div className='text-gray-400'>
                                    matic: {formattedData === null ? 0 : Math.round((bp.beatPackPrice / formattedData.usdPrice))}
                                </div>
                            </div>


                        </div>
                        <div className=' bg-gray-100 w-full h-1 mb-10'></div>

                        <button className='primaryButton' onClick={() => {
                            Moralis.authenticate().then(() => {
                                transfer.fetch({
                                    onError(error) {
                                        console.log(error)
                                        alert(error.stack)
                                    },
                                })
                            })

                        }}>Confirm checkout</button>
                    </div>


                </Modal>
            </>
            <Box padding={10} className='m-5'>
                <div className="flex flex-col">
                    <Link to={'/'}>

                        <div className='flex flex-row gap-2 items-center mb-5 cursor-pointer' onClick={() => { }}>
                            <ChevronLeftIcon height={50} width={50} />
                            <Text className='text-xl font-bold'>Back</Text>
                        </div>
                    </Link>
                    <div className='flex flex-row gap-20'>
                        <SimilarEntities bp={bp} />
                        <VStack w='100%' gap={10}>
                            <div className='flex flex-row gap-5 justify-start w-full'>
                                <div>
                                    <img src={bp.imageUrl} className=" object-cover h-60 w-60 rounded-xl" />
                                </div>
                                <div className='flex flex-col gap-2'>
                                    <div className='text-4xl font-bold'>
                                        {bp.beatPackName}
                                    </div>
                                    <div className='text-4xl font-bold primaryColor'>
                                        {producer.fullName}
                                    </div>
                                    <div className='text-xl text-gray-400'>
                                        {bp.genre}
                                    </div>
                                </div>
                            </div>
                            <div className='flex flex-row w-full gap-10'>
                                <div className={activeTab === 'beat' ? 'transition-all underline text-3xl font-bold' : 'transition-all text-3xl font-bold text-gray-500'} onClick={() => setActiveTab('beat')}>Beatpack</div>
                                <div className={activeTab !== 'beat' ? 'transition-all underline text-3xl font-bold' : 'transition-all text-3xl font-bold text-gray-500'} onClick={() => setActiveTab('producer')}>Producer info</div>
                            </div>
                            {activeTab === 'beat' && <BeatPackInfo bp={bp} onDownload={openModal} />}
                            {activeTab === 'producer' && <ProducerInfo producer={producer} />}
                        </VStack>
                    </div>
                </div>

            </Box>



        </div>
    )

}

export default BeatPackPage;