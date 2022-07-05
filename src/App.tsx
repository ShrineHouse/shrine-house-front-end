import React, { useEffect, useState } from 'react';
import Sidebar from './components/general/sidebar';
import Home from './home/home';
import MarketPlace from './beatpack/marketplace';
import { useMoralis, useMoralisCloudFunction } from 'react-moralis';
import { useQuery } from 'react-query';
import LoadingWidget from './components/general/loadingwidget';
import { Route, Routes, useLocation } from 'react-router-dom';
import ArtistPage from './artist/artistpage';
import BeatPackPage from './beatpack/beatpack';
import CreateBp from './createbeatpack/creatBp';
import SignupPage from './signup/signup';
import './styles/global.css';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import NftDisplay from './nft-display-page/nftdisplay';
import MusePage from './muse/muse';
import BottomBar from './components/general/BottomBar';


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
        <Route path='/muse/:id' element={<MusePage />} />
      </Routes>
    </CSSTransition>
  </TransitionGroup>


}

const App = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [isShown, setIsShown] = useState(false);

  ////These 4 consts load all the artists + beatpacks and will cache them.
  const fetchBeatpacks = useMoralisCloudFunction("beats")
  const fetchArtists = useMoralisCloudFunction('getArtists');
  const getchMuses = useMoralisCloudFunction('getMuses');
  const ud = useQuery('usersData', () => fetchArtists.fetch())
  const bp = useQuery('beatPacks', () => fetchBeatpacks.fetch())
  const muse = useQuery('muses', () => getchMuses.fetch())

  useEffect(() => {

    if (ud.data === undefined && bp.data === undefined && muse.data === undefined) {

      ud.refetch()
      bp.refetch()
      muse.refetch()
    }
  }, [ud])




  if (ud.data === undefined && bp.data === undefined && muse.data === undefined) { return <LoadingWidget /> } else {
    return (
      <div>
        <div className=' min-h-screen relative'>
          <div className='flex flex-row h-screen w-screen'>
            <div onMouseEnter={() => {
              handleSidebar(true)
            }} onMouseLeave={() => {
              handleSidebar(false)
            }}>
              <div className='lg:block hidden'>
                <Sidebar className={isShown ? 'sideBarHoverEnabled' : 'sideBarHover'} tabIndex={tabIndex} setTabIndex={setTabIndex} classNameTool={isShown ? 'sideBarTool' : 'sideBarToolActive'} />

              </div>
              <div className='block lg:hidden'>
                <BottomBar tabIndex={tabIndex} setTabIndex={setTabIndex} />

              </div>
            </div>
            <div className='lg:block hidden'>
              <div className={isShown ? 'sideBarHoverEnabled' : 'sideBarHover'}></div>

            </div>
            <div className='w-full flex flex-row justify-center'>
              {tabIndex === 0 && <div className='px-5'><Home /></div>}
              {tabIndex === 1 && <div className='px-5'><NftDisplay /></div>}
              {tabIndex === 2 && <div className='px-5 w-full'><MarketPlace /></div>}
            </div>

          </div>
        </div>
      </div>
    );

  }


  function handleSidebar(bool: boolean) {

    if (!bool) {
      setTimeout(() => {
        if (isShown) {
          setIsShown(false)
        }
      }, 2000)
    } else {
      setIsShown(bool)
    }
  }


}

