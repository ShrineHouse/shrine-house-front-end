import React, { useState } from 'react'
import { useMoralisCloudFunction } from 'react-moralis';
import SearchBar from '../components/general/searchBar';
import { useQuery } from 'react-query';

import { artistGenreFilter, dataToShrineUsers, dataToUsers, searchArtists } from '../helpers/database';
import { BigArtistCard, EthBCNCard, SmallArtistCard } from '../components/general/cards';
import { DbUser } from '../interfaces/users'
import Chip from '../components/general/chip';
import { Link } from 'react-router-dom';
import LoadingWidget from '../components/general/loadingwidget';




////Home page - artists live here
const Home = () => {
    const emptyUser: DbUser[] = [];
    const [searchedUsers, setUsers] = useState(emptyUser)
    const [isSearching, setSearch] = useState(false)
    const { fetch } = useMoralisCloudFunction('getArtists');

    const { isLoading, error, data } = useQuery('usersData', () => fetch())
    const [genreArtist, setGenre] = useState([{ genre: 'none' }])

    if (isLoading || data === undefined) return <LoadingWidget />

    if (error) return <div>'WOOPS ERROR...'</div>
    const users = dataToUsers(data as any);
    const shrineUsers = dataToShrineUsers(data as any);

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
        if (genreArtist[0] === undefined) return <p>No artists found</p>
        if (genreArtist[0].genre === 'none') {
            {
                return users.map((u, i) => <ul key={i}><Link to={`/${u.id}`}><SmallArtistCard url={u.image} artistName={`${u.fullName}`} verified={false} /> </Link></ul>)
            }
        } else {
            {
                return (genreArtist as DbUser[]).map((u, i) => <ul key={i}><Link to={`/${u.id}`}><SmallArtistCard url={u.image} artistName={`${u.fullName}`} verified={false} /> </Link></ul>)
            }
        }
    }

    const ethBcnCard = [
        <EthBCNCard url='https://ethbarcelona.com/assets/Image.png' />
        , <EthBCNCard url='https://novobrief.com/wp-content/uploads/2022/05/FS-ECuBVsAMKLFC-810x456.jpeg' />,
        <EthBCNCard url='https://ethbarcelona.com/assets/Image.png' />
    ]
    return (
        <div className='backgroundCol w-full'>
            <div className='min-h-screen  container mx-auto'>
                <div className='flex flex-col mx-5 gap-10'>
                    <SearchBar search={search} marketplace={false} />
                    <div className='flex max-w-full flex-row justify-between items-center mt-20 pt-5'>
                        <div className='flex flex-row gap-2'>
                            <Chip text='Trending' />
                            <Chip text='Liked' />
                            <Chip text='New' />
                        </div>
                        <select id="genres" name="genres" className='genreSelect hidden md:block' onChange={(e) => {
                            if (e.target.value === 'allgenres') return setGenre([{ genre: 'none' }])
                            const filteredData = artistGenreFilter(users, e.target.value)
                            setGenre(filteredData)
                        }} >
                            <option value="allgenres">All genres</option>
                            <option value="altrock">Alt Rock</option>
                            <option value="rap">Rap</option>
                            <option value="trap">Trap</option>
                            <option value="edm">EDM</option>
                        </select>
                    </div>
                    {isSearching !== false ?
                        <div className="flex flex-col gap-2">
                            <h1>Search results</h1>
                            <div className='grid grid-cols-3 gap-5'>
                                {searchedUsers.map((u, i) => <ul key={i}>                    <Link to={`/${u.id}`}>
                                    <SmallArtistCard url={u.image} artistName={u.fullName} verified={u.verified} /> </Link></ul>
                                )}
                            </div>
                        </div> : <div>
                            <div className="flex flex-col gap-5">
                                <div className=' text-5xl -mb-2 font-bold'>
                                    News
                                </div>
                                <div className='grid grid-cols-2 md:grid-cols-3 gap-5 '>
                                    {ethBcnCard.map((u, i) => {
                                        if (window.innerWidth > 800) { return <ul key={i}><a target='_blank' href={`https://ethbarcelona.com/`}>{u}</a></ul> } else {
                                            if (i > 1) return
                                            return <ul key={i}><a target='_blank' href={`https://ethbarcelona.com/`}>{u}</a></ul>

                                        }
                                    }
                                    )}
                                </div>
                            </div>
                            <div className="flex flex-col gap-5 mt-10">
                                <div className='text-4xl -mb-2'>Trending</div>

                                <div className='grid grid-cols-2 md:grid-cols-5 gap-5 pb-20'>
                                    {buildList()}
                                </div>
                            </div>
                        </div>}

                </div>
            </div>
        </div>

    )
}


export default Home