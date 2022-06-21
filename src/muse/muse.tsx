import React from 'react'
import { useMoralisCloudFunction } from 'react-moralis';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
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
            <div className="flex flex-row min-h-screen">
                <div className='h-full m-auto'>
                    <img src={muse.image} className=" w-72 h-auto rounded-xl" />
                </div>

                <div className=' w-4/6 bg-white h-full m-auto'>

                </div>
            </div>

        </div>
    )

}