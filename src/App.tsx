import React, { useState } from 'react';
import Sidebar from './components/sidebar';
import Home from './home/home';
import MarketPlace from './beatpack/marketplace';

const App = () => {
  const [tabIndex, setTabIndex] = useState(1);
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
