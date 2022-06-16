import React, { useState } from 'react';
import Sidebar from './components/sidebar';
import Home from './home/home';
import MarketPlace from './beatpack/marketplace';
import { useMoralis, useMoralisCloudFunction } from 'react-moralis';
import Profile from './profile/profile';
import { useQuery } from 'react-query';

const App = () => {
  const [tabIndex, setTabIndex] = useState(2);
  const { isInitialized } = useMoralis();
  const { fetch } = useMoralisCloudFunction("beats")
  const fetchArtists = useMoralisCloudFunction('getArtists');
  const getArtists = useQuery('usersData', () => fetchArtists.fetch())

  const getBps = useQuery('beatPacks', () => fetch())

  if (!isInitialized) return <div className='h-screen w-screen text-center'>'Loading...'</div>

  return (
    <div>
      <div className=' backgroundCol relative'>
        <div className='flex flex-row h-screen w-screen'>

          <Sidebar tabIndex={tabIndex} setTabIndex={setTabIndex} />

          {tabIndex === 1 && <Home />}
          {tabIndex === 2 && <MarketPlace />}
        </div>
      </div>
    </div>
  );
}

export default App;
