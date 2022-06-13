import { ChevronLeftIcon } from '@chakra-ui/icons';
import { Box, Text, VStack } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import JsFileDownloader from 'js-file-downloader';
import BeatPack from '../interfaces/beats';
import BeatPackInfo from './components/BeatpackInfo';
import ProducerInfo from './components/ProducerInfo';
import { useMoralisCloudFunction } from 'react-moralis';
import { dataToUser } from '../helpers/database';
import { emptyUser } from '../interfaces/users';
import SimilarEntities from './components/SimilarEntities';



const BeatPackPage = (props: { bp: BeatPack, back: Function }) => {
    const [activeTab, setActiveTab] = useState('beat');
    const { fetch, data } = useMoralisCloudFunction("getUser", { wallet: props.bp.ownerWallet })
    const [producer, setProducer] = useState(emptyUser)

    useEffect(() => {
        if (props.bp.artistName === '') {
            return
        }
        fetch({
            onSuccess(results) {
                setProducer(dataToUser(results as any))
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
                        <SimilarEntities bp={props.bp} />
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
                            {activeTab === 'producer' && <ProducerInfo producer={producer}  />}
                        </VStack>
                    </div>
                </div>

            </Box>



        </div>
    )

}

export default BeatPackPage;