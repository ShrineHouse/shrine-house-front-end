import React from 'react'
import { useMoralis } from 'react-moralis';
import Logo from '../components/logo';
import { AiFillCheckCircle } from 'react-icons/ai';
import SearchBar from '../components/searchBar';






const BigArtistCard = (props: { url: string }) => {
    return (
        <div className='w-full h-56 bg-white borderRadiusComponents shadow bigCard'>
            <img src={props.url} className='relative h-full w-full object-cover borderRadiusComponents' />
        </div>
    );
}

const SmallArtistCard = (props: { url: string, artistName: string, verified: boolean }) => {
    return (
        <div className='w-full h-full flex flex-col gap-2'>

            <div className='w-full h-56 bg-white borderRadiusComponents shadow bigCard'>
                <img src={props.url} className='relative h-full w-full object-cover borderRadiusComponents' />
            </div>

            <div className='flex flex-row justify-between'> <p>{props.artistName}</p> {props.verified && <div className="primaryColor"><AiFillCheckCircle size={24} /></div>} </div>
        </div>

    );
}





const Home = () => {
    const { authenticate, isAuthenticated, user } = useMoralis();

    return (

        <div className='h-screen w-full container mx-auto'>
            <div className='flex flex-col mx-5 gap-10'>
                <SearchBar />
                <div className="flex flex-col gap-2">
                    <h1>Shrine Artists</h1>
                    <div className='grid grid-cols-3 gap-5'>
                        <BigArtistCard url='https://i.scdn.co/image/ab6761610000e5ebb88bda1b1f672e1cce76342e' />
                        <BigArtistCard url='https://pagesix.com/wp-content/uploads/sites/3/2022/05/machine-gun-kelly-billboard-music-awards-2022.jpg?quality=75&strip=all&w=618&h=410&crop=1' />
                        <BigArtistCard url='https://www.billboard.com/wp-content/uploads/2022/05/02-PSY-cr-P-NATION-Corporation-press-2022-billboard-1548.jpg' />
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    <h1>Trending</h1>
                    <div className='grid grid-cols-5 gap-5'>
                        <SmallArtistCard url='https://i.scdn.co/image/ab6761610000e5ebb88bda1b1f672e1cce76342e' artistName='Guy Pirelli' verified={true} />
                        <SmallArtistCard url='https://pagesix.com/wp-content/uploads/sites/3/2022/05/machine-gun-kelly-billboard-music-awards-2022.jpg?quality=75&strip=all&w=618&h=410&crop=1' artistName='Machine Gun kelly' verified={false} />
                        <SmallArtistCard url='https://www.billboard.com/wp-content/uploads/2022/05/02-PSY-cr-P-NATION-Corporation-press-2022-billboard-1548.jpg' artistName='Psy' verified={false} />
                    </div>
                </div>
            </div>
        </div>

    )
}


export default Home