import React, { useState } from 'react';
import Sidebar from './components/sidebar';
import Home from './home/home';

const App = () => {
  const [tabIndex, setTabIndex] = useState(1);
  return (
    <div>
      <div className=' backgroundCol relative'>
        <div className='flex flex-row h-screen w-screen'>
          <Sidebar tabIndex={tabIndex} setTabIndex={setTabIndex} />
          <Home />
        </div>
      </div>
    </div>
  );
}

export default App;
