import React, { useState } from 'react'
import { useMoralisCloudFunction } from 'react-moralis';
import SearchBar from '../components/general/searchBar';
import { useQuery } from 'react-query';
import { dataToUsers, searchArtists } from '../helpers/database';
import { EthBCNCard, SmallArtistCard } from '../components/general/cards';
import { DbUser } from '../interfaces/users'
import { Link } from 'react-router-dom';
import LoadingWidget from '../components/general/loadingwidget';
import Heading1 from '../components/general/Heading1';
import { Heading2 } from '../components/general/Heading2';
import { NavbarSpacer } from '../components/general/NavbarSpacer';
import { Divider } from '../components/general/Divider';
import { BodyLink } from '../components/general/BodyLink';

////Home page - artists live here
const Home = () => {
    const emptyUser: DbUser[] = [];
    const [searchedUsers, setUsers] = useState(emptyUser)
    const [isSearching, setSearch] = useState(false)
    const { fetch } = useMoralisCloudFunction('getArtists');
    const { isLoading, error, data } = useQuery('usersData', () => fetch())
    if (isLoading || data === undefined) return <LoadingWidget />

    if (error) return <div>'WOOPS ERROR...'</div>
    const users = dataToUsers(data as any);

    /////Build artist list based upon search
    function search(value: string) {
        if (value === '') {
            setSearch(false)
            return setUsers(emptyUser)
        }
        let search = searchArtists(users, value);
        setUsers(search);
        if (!isSearching) return setSearch(true)
    }
    /////Build artist list with genre filters applied
    function buildList() {
        return users.slice(0, 5).map((u, i) => <ul key={i}><Link to={`/${u.id}`}><SmallArtistCard url={u.image} artistName={`${u.fullName}`} verified={false} /> </Link></ul>)
    }

    const ethBcnCard = [
        <EthBCNCard url='https://ethbarcelona.com/assets/Image.png' />
        , <EthBCNCard url='https://novobrief.com/wp-content/uploads/2022/05/FS-ECuBVsAMKLFC-810x456.jpeg' />,
        <EthBCNCard url='https://ethbarcelona.com/assets/Image.png' />
    ]

    ///// RENDER THE HOMEPAGE
    return (
        <div className='backgroundCol w-full'>
            <div className='md:min-h-screen  container mx-auto'>
                <div className='flex flex-col'>
                    <SearchBar search={search} marketplace={false} />
                    <NavbarSpacer />
                    {isSearching !== false ?
                        <div className="flex flex-col gap-2">
                            <Heading1 text="Search Results" />
                            <div className='grid grid-cols-5 gap-10 gap-y-20'>
                                {searchedUsers.map((u, i) => <ul key={i}>
                                    <Link to={`/${u.id}`}>
                                        <SmallArtistCard url={u.image} artistName={u.fullName} verified={u.verified} />
                                    </Link>
                                </ul>
                                )}
                            </div>
                        </div> : <div>
                            <div className="flex flex-col">
                                <Heading1 text="Welcome" className=' mt-10' />
                                <Divider className='mt-4' />
                                <div className='flex flex-row justify-between items-center mt-3'>
                                    <Heading2 text='News' />
                                    <BodyLink text='See All' />
                                </div>
                                <div className='grid grid-cols-2 md:grid-cols-3 gap-10 mt-3  '>
                                    {ethBcnCard.map((u, i) => {
                                        if (window.innerWidth > 800) { return <ul key={i}><a target='_blank' href={`https://ethbarcelona.com/`}>{u}</a></ul> } else {
                                            if (i > 1) return
                                            return <ul key={i}><a target='_blank' href={`https://ethbarcelona.com/`}>{u}</a></ul>
                                        }
                                    }
                                    )
                                    }
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <Divider className='mt-10' />
                                <div className='flex flex-row justify-between items-center mt-3'>
                                    <Heading2 text='Trending' />
                                    <BodyLink text='See All' />
                                </div>
                                <div className='flex flex-col md:grid md:grid-cols-5 gap-10 h-full mt-3'>
                                    {buildList()}
                                </div>
                                <Divider className='mt-10' />
                                <div className='flex flex-row justify-between items-center mt-3'>
                                    <Heading2 text='New' />
                                    <BodyLink text='See All' />
                                </div>
                                <div className='flex flex-col md:grid md:grid-cols-5 gap-10 h-full mt-3'>
                                    {buildList()}
                                </div>
                                <Divider className='mt-10' />
                                <div className='flex flex-row justify-between items-center mt-3'>
                                    <Heading2 text='Recommended' />
                                    <BodyLink text='See All' />
                                </div>
                                <div className='flex flex-col md:grid md:grid-cols-5 gap-10 h-full mt-3'>
                                    {buildList()}
                                </div>
                                <div className='h-20 w-full' />
                            </div>
                        </div>}
                </div>
            </div>
        </div>

    )
}


export default Home