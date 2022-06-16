import React from 'react';
import ReactDOM from 'react-dom/client';
import { MoralisProvider } from 'react-moralis';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import App from './App';
import ArtistPage from './artist/artistpage';
import BeatPackPage from './beatpack/beatpack';
import CreateBp from './createbeatpack/creatBp';
import reportWebVitals from './reportWebVitals';
import SignupPage from './signup/signup';
import './styles/global.css'

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
export const queryClient = new QueryClient()
root.render(
  <React.StrictMode>
    <MoralisProvider serverUrl='https://tegvbkenkckg.usemoralis.com:2053/server' appId='LDiq0dcIjNKdEgqqjQHaJgHZXptPQLrtcGtdV88P'>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<App />} />
            <Route path='/signup' element={<SignupPage />} />
            <Route path='/createbeatpack' element={<CreateBp />} />
            <Route path='/:id' element={<ArtistPage />} />
            <Route path='/beatpack/:id' element={<BeatPackPage />} />
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </MoralisProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
