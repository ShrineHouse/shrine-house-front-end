import { ChevronDownIcon, ChevronRightIcon, ChevronLeftIcon, Icon, LinkIcon, } from '@chakra-ui/icons';
import { Box, Button, Center, Flex, Input, Spacer, Stack, Text, useDisclosure, VStack } from '@chakra-ui/react';
import React, { useEffect, useRef, useState } from 'react';
import JsFileDownloader from 'js-file-downloader';
import { beatpackDetails } from '../data/beatpack';
import BeatPack, { Beat } from '../interfaces/beats';
import { AiFillPauseCircle, AiFillPlayCircle } from 'react-icons/ai';

const MusicCard = (props: { data: Beat }) => {

    const [trackProgress, setTrackProgress] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);

    // Refs
    const audioRef = useRef(new Audio(props.data.beatDownloadUrl));
    const intervalRef = useRef<any>(null);
    const isReady = useRef(false);
    // Destructure for conciseness
    const { duration } = audioRef.current;

    function handleMusic(bool: boolean) {

        setIsPlaying(bool);
    }
    const startTimer = () => {
        // Clear any timers already running
        clearInterval(intervalRef.current);

        intervalRef.current = setInterval(() => {

            setTrackProgress(audioRef.current.currentTime);

        }, 1000);
    }

    useEffect(() => {
        if (isPlaying) {
            audioRef.current.play();
            startTimer();

        } else {
            clearInterval(intervalRef.current);

            audioRef.current.pause();
        }
    }, [isPlaying])

    const onScrub = (value: any) => {
        // Clear any timers already running
        clearInterval(intervalRef.current);
        audioRef.current.currentTime = value;
        setTrackProgress(audioRef.current.currentTime);
    }

    return (
        <Box w='100%' className='bg-white pr-5' borderRadius={10} >
            <Flex gap={5}>
                <Box w={100} bg='#F07634' borderTopLeftRadius={10} borderBottomStartRadius={10}>
                    <Center>{isPlaying && <Icon as={AiFillPauseCircle} color='white' h={100} w={100} onClick={() => { handleMusic(false) }} />}
                        {!isPlaying && <Icon as={AiFillPlayCircle} color='white' h={100} w={100} onClick={() => { handleMusic(true) }} />}
                    </Center>
                </Box>
                <Stack w='100%' className='pl-4'>
                    <Flex alignItems='center' w='100%' paddingRight="20px" paddingTop="20px">
                        <div className='flex flex-col gap-2' >
                            <Text className='text-xl font-bold'>{props.data.beatArtist}</Text>
                            <Text marginTop='-10px !important' fontSize='lg'>{props.data.beatName}</Text>
                        </div>
                        <Spacer />
                        <Button bg='#F07634' color='white' display='none' onClick={() => {
                            new JsFileDownloader({
                                url: props.data.beatDownloadUrl
                            })
                        }}>Download</Button>
                    </Flex>
                    <div className='mr-5 w-full'>
                        <input className='pr-5 w-full max-w-full' onChange={(e: any) => onScrub(e.target.value)}
                            type='range' value={trackProgress} step='1' min='0' max={duration ? duration : `${duration}`} />
                    </div>
                </Stack>
            </Flex>
        </Box>
    );
}






const BeatPackPage = (props: { bp: BeatPack, back: Function }) => {
    const { isOpen, onOpen, onClose } = useDisclosure()



    function onDownload() {
        new JsFileDownloader({
            url: 'https://shrine.house/wp-content/uploads/2022/04/Tiësto-The-Business-Official-Music-Video.mp3',
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
                    <div className='flex flex-row gap-10'>
                        <div className='min-w-80 max-w-80 min-h-full bg-white p-10 rounded-xl shadow-md flex flex-col gap-5'>
                            <div className='flex flex-col gap-3 items-center'>
                                <div className="text-2xl font-bold text-center">Other playlists from this producer</div>
                                <div className='grid grid-cols-2 gap-5'>

                                    <div className='flex flex-col gap-2'>
                                        <img src={props.bp.imageUrl} className=" object-cover w-20 h-20 rounded-xl" />
                                        <div className="text-xl font-bold"> {props.bp.beatPackName}</div>
                                    </div>
                                    <div className='flex flex-col gap-2'>
                                        <img src={props.bp.imageUrl} className=" object-cover w-20 h-20 rounded-xl" />
                                        <div className="text-xl font-bold"> {props.bp.beatPackName}</div>
                                    </div>
                                    <div className='flex flex-col gap-2'>
                                        <img src={props.bp.imageUrl} className=" object-cover w-20 h-20 rounded-xl" />
                                        <div className="text-xl font-bold"> {props.bp.beatPackName}</div>
                                    </div>
                                    <div className='flex flex-col gap-2'>
                                        <img src={props.bp.imageUrl} className=" object-cover w-20 h-20 rounded-xl" />
                                        <div className="text-xl font-bold"> {props.bp.beatPackName}</div>
                                    </div>
                                </div>
                            </div>
                            <div className='w-full border-b-2 border-gray-300'></div>
                        </div>

                        <VStack w='100%' gap={10}>
                            <div className='flex flex-row gap-5 justify-start w-full'>
                                <div>
                                    <img src={props.bp.imageUrl} className=" object-cover h-60 w-60 rounded-xl" />
                                </div>
                                <div className='flex flex-col gap-2'>
                                    <div className='text-4xl font-bold'>
                                        {props.bp.artistName}
                                    </div>
                                    <div className='text-2xl font-bold'>
                                        {props.bp.genre}
                                    </div>
                                </div>

                            </div>
                            <div className='flex flex-row w-full gap-10'>
                                <div className=' underline text-3xl font-bold'>Beatpack</div>
                                <div className='text-3xl font-bold text-gray-400'>Producer info</div>
                            </div>

                            <div className='flex flex-row gap-5 justify-between w-full items-center'>
                                <div className='flex flex-col gap-3'>
                                    <div className='text-2xl'>{props.bp.beatPackName}</div>
                                    <div className='text-lg'>{props.bp.description}</div>
                                </div>
                                <div>
                                    <Button bg='#F07634' color='white' className='primaryButton' onClick={onDownload}>Purchase all tracks for ${props.bp.beatPackPrice}</Button>

                                </div>

                            </div>

                            {props.bp.beats.map((beatcard => <MusicCard data={beatcard} />))}
                        </VStack>
                    </div>
                </div>

            </Box>



        </div>
    )

}

export default BeatPackPage;