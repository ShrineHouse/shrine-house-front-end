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
                    <Flex gap={5}>
                        <Box w={500} >
                            <Stack gap={5} w={300} position='fixed'>
                                <Box h={300} w={300} borderRadius="lg" backgroundImage={`url(${props.bp.imageUrl})`} backgroundPosition="center"
                                    backgroundRepeat="no-repeat" className='rounded-xl'></Box>
                                <Flex alignItems='center' >
                                    <Text className='text-2xl'>
                                        {props.bp.artistName} - {props.bp.beatPackName}
                                    </Text>
                                    <Spacer />
                                    <LinkIcon color='#F07634' w={25} h={25} />
                                </Flex>
                                <Text>
                                    {props.bp.description}
                                </Text>
                                <Button bg='#F07634' color='white' className='primaryButton' onClick={onDownload}>Purchase for ${props.bp.beatPackPrice}</Button>
                            </Stack>
                        </Box>

                        <VStack w='100%'>
                            {props.bp.beats.map((beatcard => <MusicCard data={beatcard} />))}
                        </VStack>
                    </Flex>
                </div>

            </Box>



        </div>
    )

}

export default BeatPackPage;