import { Box, Button, Center, Flex, Icon, Spacer, Stack, Text } from '@chakra-ui/react';
import JsFileDownloader from 'js-file-downloader';
import React, { useEffect, useRef, useState } from 'react';
import { AiFillPauseCircle, AiFillPlayCircle } from 'react-icons/ai';
import { Beat } from '../../interfaces/beats';


const TrackCard = (props: { data: Beat, playingIndex: number, index: number, setPlaying: Function }) => {

    const [trackProgress, setTrackProgress] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);

    // Refs
    const audioRef = useRef(new Audio(props.data.beatDownloadUrl));
    const intervalRef = useRef<any>(null);
    // Destructure for conciseness
    const { duration } = audioRef.current;

    function handleMusic(bool: boolean) {
        setIsPlaying(bool);
        if (bool) {
            props.setPlaying(props.index)
        }
    }

    useEffect(() => {

        if (props.playingIndex !== props.index) {
            setIsPlaying(false);
            audioRef.current.pause();
        }
    }, [props.playingIndex])



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
        <Box w='100%' className='bg-white pr-5 shadow-md' borderRadius={10} >
            <Flex gap={5}>
                <Box w={120} bg={isPlaying ? '#F07634' : '#FDEEE6'} borderTopLeftRadius={10} borderBottomStartRadius={10} className="items-center flex flex-col justify-center">
                    <Center>{isPlaying && <Icon as={AiFillPauseCircle} color='white' h={50} w={50} onClick={() => { handleMusic(false) }} />}
                        {!isPlaying && <Icon as={AiFillPlayCircle} color='#B6ACA7' h={50} w={50} onClick={() => { handleMusic(true) }} />}
                    </Center>
                </Box>
                <Stack w='100%' className='pl-4 py-5'>
                    <Flex alignItems='center' w='100%' paddingRight="20px">
                        <div className='flex flex-col gap-2' >
                            <Text className='text-xl font-bold'>{props.data.beatArtist}</Text>
                            <Text marginTop='-10px !important' fontSize='lg'>{props.data.beatName.replace('.mp3', '')}</Text>
                        </div>
                        <Spacer />
                        <Button bg='#F07634' color='white' display='none' onClick={() => {
                            new JsFileDownloader({
                                url: props.data.beatDownloadUrl
                            })
                        }}>Download</Button>
                    </Flex>
                    <div className='mr-5 w-full'>

                        <input className='my-slider' onChange={(e: any) => onScrub(e.target.value)}
                            type='range' value={trackProgress} step='1' min='0' max={duration ? duration : `${duration}`} />
                    </div>
                </Stack>
            </Flex>
        </Box>
    );
}


export default TrackCard;