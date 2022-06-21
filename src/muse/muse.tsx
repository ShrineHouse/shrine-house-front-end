import { ChevronLeftIcon } from '@chakra-ui/icons';
import React from 'react'
import { useMoralisCloudFunction } from 'react-moralis';
import { useQuery } from 'react-query';
import { Link, useParams } from 'react-router-dom';
import { MuseCard } from '../components/general/cards';
import LoadingWidget from '../components/general/loadingwidget';
import { dataToMuse } from '../helpers/database';

export default function MusePage() {
    const { id } = useParams();

    const getchMuse = useMoralisCloudFunction('getMuse', { id: id });
    const { data, isLoading, error } = useQuery('muse', () => getchMuse.fetch())
    console.log(data)

    if (isLoading || data === undefined) return <LoadingWidget />
    console.log(data)
    if (error) return <div>'WOOPS ERROR...'</div>
    const muse = dataToMuse(data as any);

    return (
        <div>
            <div className='absolute z-50'>
                <Link to={"/"}>
                    <div className="flex flex-row gap-2 items-center mb-5 cursor-pointer">
                        <ChevronLeftIcon height={50} width={50} />
                        <div className="text-xl font-bold">Back</div>
                    </div>
                </Link>

            </div>
            <div className="flex flex-row justify-between min-h-screen">
                <div className='h-full fixed '>
                    <div className='fixed w-2/6 h-screen  flex flex-col  justify-center items-center'>
                        <div className='relative'>
                            <div className='w-72'>
                                <MuseCard muse={muse} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className='h-full w-2/6 ' />

                <div className='w-4/6 bg-white py-10  rounded-xl min-h-screen m-0 table'>
                    <div className='w-4/6 align-middle table-cell'>
                        <div className='mx-auto w-4/6'>
                            <div className='text-4xl font-bold mb-5'>Your purchase</div>
                            <div className="flex flex-row w-full justify-between mb-2 px-3">
                                <div className="text-gray-400">Price</div>
                                <div className="text-gray-400">${muse.nftData.nftPrice}</div>
                            </div>
                            <div className="flex flex-row w-full justify-between p-3 primaryColorLightBg rounded-xl">
                                <div className="font-bold black">You will pay</div>
                                <div className="font-bold black">${muse.nftData.nftPrice}</div>
                            </div>
                            <div className='divider my-5'></div>

                            <div className='flex flex-col text-gray-400 mb-10'>
                                <div className='text-gray-400"'>Secondary Market</div>
                                <div className='flex flex-col'>
                                    <div>Your resale value will be <span className='text-black font-bold'>{100 - muse.nftData.artistRoyalties - muse.nftData.producerRoyalties - 2}%</span></div>
                                    <div className='divider my-2'></div>
                                    <li className='pl-5'>Creators will receive <span>{muse.nftData.artistRoyalties + muse.nftData.producerRoyalties}%</span> of resale revenue</li>
                                    <li className='pl-5'>Shrine House will receive 2% of resale revenue</li>
                                </div>
                            </div>

                            <button className='primaryButton'>Purchase NFT</button>
                        </div>

                    </div>
                </div>
            </div>

        </div>
    )

}