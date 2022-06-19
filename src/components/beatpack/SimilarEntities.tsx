import React, { useEffect, useState } from 'react'
import { useMoralisCloudFunction } from 'react-moralis';
import { dataToBeatPack, dataToUsers } from '../../helpers/database';
import BeatPack from '../../interfaces/beats';
import { DbUser } from '../../interfaces/users';


//Sidebar in the beatpack displaying similar producers, beatpacks
const SimilarEntities = (props: { bp: BeatPack, setLoaded:Function }) => {
    const emptyBp: BeatPack[] = [];
    const emptySimilarUsers: DbUser[] = [];
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
        //Get similat beatpacks by genre
        getBeatsGenre.fetch({
            onSuccess(results) {

                setBeatsGenre(dataToBeatPack(results as any).slice(0,4))
            },
        })
        // get similar producers by fenre
        getSimilarUser.fetch({
            onSuccess(results) {

                setSimilarProducers(dataToUsers(results as any).slice(0,4))
            },
        })
        // Get all beatpacks this user uploaded
        getAllBeatsUser.fetch({
            onSuccess(results) {

                setAllBeats(dataToBeatPack(results as any).slice(0, 4))
                props.setLoaded(true)
            },
        })

    

    }, [props.bp])

    return (<div className='similarCol min-h-full bg-white p-10 rounded-xl shadow-md flex flex-col gap-5'>
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

    </div>);


}

export default SimilarEntities