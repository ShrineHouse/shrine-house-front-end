import React, { useState } from 'react';
import Sidebar from './components/general/sidebar';
import Home from './home/home';
import MarketPlace from './beatpack/marketplace';
import { useMoralis, useMoralisCloudFunction } from 'react-moralis';
import { useQuery } from 'react-query';
import LoadingWidget from './components/general/loadingwidget';

const App = () => {
  const [tabIndex, setTabIndex] = useState(2);
  const { isInitialized } = useMoralis();

  ////These 4 consts load all the artists + beatpacks and will cache them.
  const fetchBeatpacks = useMoralisCloudFunction("beats")
  const fetchArtists = useMoralisCloudFunction('getArtists');
  const getArtists = useQuery('usersData', () => fetchArtists.fetch())
  const getBps = useQuery('beatPacks', () => fetchBeatpacks.fetch())

  if (!isInitialized) return <LoadingWidget />

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
