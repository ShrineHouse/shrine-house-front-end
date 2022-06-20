import React, { useState } from 'react';
import Sidebar from './components/general/sidebar';
import Home from './home/home';
import MarketPlace from './beatpack/marketplace';
import { useMoralis, useMoralisCloudFunction } from 'react-moralis';
import { useQuery } from 'react-query';
import LoadingWidget from './components/general/loadingwidget';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import ArtistPage from './artist/artistpage';
import BeatPackPage from './beatpack/beatpack';
import CreateBp from './createbeatpack/creatBp';
import SignupPage from './signup/signup';
import './styles/global.css';
import { TransitionGroup, CSSTransition } from 'react-transition-group';


export default function Init() {
  const location = useLocation()
  return <TransitionGroup>
    <CSSTransition
      key={location.key}
      classNames="fade" timeout={300}>


      <Routes location={location}>
        <Route path='/' element={<App />} />
        <Route path='/signup' element={<SignupPage />} />
        <Route path='/createbeatpack' element={<CreateBp />} />
        <Route path='/:id' element={<ArtistPage />} />
        <Route path='/beatpack/:id' element={<BeatPackPage />} />
      </Routes>
    </CSSTransition>
  </TransitionGroup>


}

const App = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const { isInitialized } = useMoralis();

  ////These 4 consts load all the artists + beatpacks and will cache them.
  const fetchBeatpacks = useMoralisCloudFunction("beats")
  const fetchArtists = useMoralisCloudFunction('getArtists');
  const getArtists = useQuery('usersData', () => fetchArtists.fetch())
  const getBps = useQuery('beatPacks', () => fetchBeatpacks.fetch())

  if (!isInitialized) return <LoadingWidget />

  return (
    <div>
      <div className=' min-h-screen relative'>
        <div className='flex flex-row h-screen w-screen'>

          <Sidebar tabIndex={tabIndex} setTabIndex={setTabIndex} />
          <div className='w-24'></div>
          {tabIndex === 0 && <Home />}
          {tabIndex === 1 && <MarketPlace />}
        </div>
      </div>
    </div>
  );
}

