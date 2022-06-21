import React, { useEffect, useState } from 'react';
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
import NftDisplay from './nft-display-page/nftdisplay';


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
  const [isShown, setIsShown] = useState(false);

  ////These 4 consts load all the artists + beatpacks and will cache them.
  const fetchBeatpacks = useMoralisCloudFunction("beats")
  const fetchArtists = useMoralisCloudFunction('getArtists');
  const getArtists = useQuery('usersData', () => fetchArtists.fetch())
  const getBps = useQuery('beatPacks', () => fetchBeatpacks.fetch())



  if (!isInitialized) return <LoadingWidget />

  function handleSidebar(bool: boolean) {
    console.log(bool)

    if (!bool) {
      setTimeout(() => {
        console.log('ENNE')
        console.log(bool)

        console.log(isShown)
        if (isShown) {
          setIsShown(false)

        }
      }, 2000)
    } else {
      setIsShown(bool)

    }


  }

  return (
    <div>
      <div className=' min-h-screen relative'>
        <div className='flex flex-row h-screen w-screen'>

          <div onMouseEnter={() => {
            handleSidebar(true)
          }} onMouseLeave={() => {
            handleSidebar(false)

          }}>
            <Sidebar className={isShown ? 'sideBarHoverEnabled' : 'sideBarHover'} tabIndex={tabIndex} setTabIndex={setTabIndex} classNameTool={isShown ? 'sideBarTool' : 'sideBarToolActive'} />
          </div>
          <div className={isShown ? 'sideBarHoverEnabled' : 'sideBarHover'}></div>
          {tabIndex === 0 && <div className='px-5'><Home /></div>}
          {tabIndex === 1 && <div className='px-5'><NftDisplay /></div>}
          {tabIndex === 2 && <div className='px-5'><MarketPlace /></div>}
        </div>
      </div>
    </div>
  );
}

