import React, { useEffect, useState } from 'react'
import { useMoralis, useMoralisCloudFunction } from 'react-moralis';
import SearchBar from '../components/searchBar';
import { useQuery } from 'react-query';

import { artistGenreFilter, dataBeatpackFilter, dataToShrineUsers, dataToUsers, searchArtists } from '../helpers/database';
import { BigArtistCard, SmallArtistCard } from '../components/cards';
import { DbUser } from '../interfaces/users'
import Chip from '../components/chip';
import { Link } from 'react-router-dom';
import LoadingWidget from '../components/loadingwidget';




////Home page - artists live here
const Home = () => {
    const emptyUser: DbUser[] = [];
    const [searchedUsers, setUsers] = useState(emptyUser)
    const [isSearching, setSearch] = useState(false)
    const { fetch } = useMoralisCloudFunction('getArtists');

    const { isLoading, error, data } = useQuery('usersData', () => fetch())
    const [genreArtist, setGenre] = useState([{ genre: 'none' }])
    const { logout } = useMoralis()

    if (isLoading || data === undefined)  return         <LoadingWidget />

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
    return (
        <div className='h-screen w-full container mx-auto'>
            <div className='flex flex-col mx-5 gap-10'>
                <SearchBar search={search} marketplace={false} />
                <div className='flex flex-row justify-between items-center mt-20 pt-5'>
                    <div className='flex flex-row gap-2'>
                        <Chip text='Trending' />
                        <Chip text='Liked' />
                        <Chip text='New' />
                    </div>
                    <select id="genres" name="genres" className='genreSelect' onChange={(e) => {
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
                        <div className="flex flex-col gap-2">
                            <h1>Shrine Artists</h1>
                            <div className='grid grid-cols-3 gap-5'>
                                {shrineUsers.map((u, i) => <ul key={i}><Link to={`/${u.id}`}><BigArtistCard url={u.image} /> </Link></ul>
                                )}
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <h1>Trending</h1>
                            <div className='grid grid-cols-2 md:grid-cols-5 gap-5'>
                                {buildList()}
                            </div>
                        </div>
                    </div>}

            </div>
        </div>
    )
}


export default Home