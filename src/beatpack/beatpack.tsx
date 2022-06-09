import { ChevronLeftIcon } from '@chakra-ui/icons';
import { Box, Text, VStack } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import JsFileDownloader from 'js-file-downloader';
import BeatPack from '../interfaces/beats';
import BeatPackInfo from './components/BeatpackInfo';
import ProducerInfo from './components/ProducerInfo';
import { useMoralisCloudFunction } from 'react-moralis';
import { useQuery } from 'react-query';
import { dataToBeatPack, dataToUser, dataToUsers } from '../helpers/database';
import { DbUser, emptyUser } from '../interfaces/users';









const BeatPackPage = (props: { bp: BeatPack, back: Function }) => {
    const emptyBp: BeatPack[] = [];
    const emptySimilarUsers: DbUser[] = [];
    const [activeTab, setActiveTab] = useState('beat');
    const { fetch, data } = useMoralisCloudFunction("getUser", { wallet: props.bp.ownerWallet })
    const [producer, setProducer] = useState(emptyUser)
    const [beatsGenre, setBeatsGenre] = useState(emptyBp)
    const [allBeats, setAllBeats] = useState(emptyBp)
    const [similarProducers, setSimilarProducers] = useState(emptySimilarUsers)
    const getBeatsGenre = useMoralisCloudFunction("getBeatsGenre", { genre: props.bp.genre })
    const getSimilarUser = useMoralisCloudFunction("getSimilarUser", { genre: props.bp.genre })
    const getAllBeatsUser = useMoralisCloudFunction("getAllBeats", { wallet: props.bp.ownerWallet })


    useEffect(() => {
        if (props.bp.artistName === '') {
            return
        }
        console.log('here')
        fetch({
            onSuccess(results) {
                setProducer(dataToUser(results as any))
            },
        })
        getBeatsGenre.fetch({
            onSuccess(results) {

                setBeatsGenre(dataToBeatPack(results as any))
            },
        })
        getSimilarUser.fetch({
            onSuccess(results) {
                console.log(results)

                setSimilarProducers(dataToUsers(results as any))
            },
        })
        getAllBeatsUser.fetch({
            onSuccess(results) {

                setAllBeats(dataToBeatPack(results as any))
            },
        })

    }, [props.bp])

    function onDownload() {
        new JsFileDownloader({
            url: props.bp.beatPackUrl,
        })
            .then(function () {
                // Called when download ended
            })
            .catch(function (error) {
                // Called when an error occurred
            });
    }


    return (
        <div className='container mx-auto'>
            <Box padding={10} className='m-5'>
                <div className="flex flex-col">
                    <div className='flex flex-row gap-2 items-center mb-5 cursor-pointer' onClick={() => props.back()}>
                        <ChevronLeftIcon height={50} width={50} />
                        <Text className='text-xl font-bold'>Back</Text>
                    </div>
                    <div className='flex flex-row gap-20'>
                        <div className='similarCol min-h-full bg-white p-10 rounded-xl shadow-md flex flex-col gap-5'>
                        <div className='flex flex-col gap-3 '>
                                <div className="text-2xl font-bold text-left ">More Beatpacks From This User</div>
                                <div className='grid grid-cols-2 gap-5 w-full'>
                                    {allBeats.map((u, index) => <ul key={index}>
                                        <div className='flex flex-col gap-2'>
                                            <img src={u.imageUrl} className=" object-cover w-full h-auto  rounded-xl" />
                                            <div className="text-xl font-bold"> {u.beatPackName}</div>
                                        </div>
                                    </ul>)}
                                </div>
                            </div>
                            <div className='w-full border-b-2 border-gray-300'></div>

                            <div className='flex flex-col gap-3 '>
                                <div className="text-2xl font-bold text-left">Similar Producers</div>
                                <div className='grid grid-cols-2 gap-5 w-full'>
                                    {similarProducers.map((u, index) => <ul key={index}>
                                        <div className='flex flex-col gap-2'>
                                            <img src={u.image} className=" object-cover w-full h-auto rounded-xl" />
                                            <div className="text-xl font-bold"> {u.fullName}</div>
                                        </div>
                                    </ul>)}
                                </div>
                            </div>
                            <div className='w-full border-b-2 border-gray-300'></div>
                            <div className='flex flex-col gap-3 '>
                                <div className="text-2xl font-bold text-left items-start">Similar Beatpacks</div>
                                <div className='grid grid-cols-2 gap-5 w-full'>
                                    {beatsGenre.map((u, index) => <ul key={index}>
                                        <div className='flex flex-col gap-2'>
                                            <img src={u.imageUrl} className=" object-cover w-full h-auto  rounded-xl" />
                                            <div className="text-xl font-bold"> {u.beatPackName}</div>
                                        </div>
                                    </ul>)}
                                </div>
                            </div>

                        </div>

                        <VStack w='100%' gap={10}>
                            <div className='flex flex-row gap-5 justify-start w-full'>
                                <div>
                                    <img src={props.bp.imageUrl} className=" object-cover h-60 w-60 rounded-xl" />
                                </div>
                                <div className='flex flex-col gap-2'>
                                    <div className='text-4xl font-bold'>
                                        {props.bp.beatPackName}
                                    </div>
                                    <div className='text-4xl font-bold primaryColor'>
                                        {producer.fullName}
                                    </div>
                                    <div className='text-xl text-gray-400'>
                                        {props.bp.genre}
                                    </div>
                                </div>

                            </div>
                            <div className='flex flex-row w-full gap-10'>
                                <div className={activeTab === 'beat' ? 'transition-all underline text-3xl font-bold' : 'transition-all text-3xl font-bold text-gray-500'} onClick={() => setActiveTab('beat')}>Beatpack</div>
                                <div className={activeTab !== 'beat' ? 'transition-all underline text-3xl font-bold' : 'transition-all text-3xl font-bold text-gray-500'} onClick={() => setActiveTab('producer')}>Producer info</div>
                            </div>
                            {activeTab === 'beat' && <BeatPackInfo bp={props.bp} onDownload={onDownload} />}
                            {activeTab === 'producer' && <ProducerInfo producer={producer} onDownload={onDownload} />}


                        </VStack>
                    </div>
                </div>

            </Box>



        </div>
    )

}

export default BeatPackPage;