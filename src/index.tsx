import React from 'react';
import ReactDOM from 'react-dom/client';
import { MoralisProvider } from 'react-moralis';
import { QueryClient, QueryClientProvider } from 'react-query';
import reportWebVitals from './reportWebVitals';
import './styles/global.css';
import Init from './App';
import { BrowserRouter } from 'react-router-dom';
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
export const queryClient = new QueryClient()
root.render(
  <React.StrictMode>
    <MoralisProvider serverUrl='https://tegvbkenkckg.usemoralis.com:2053/server' appId='LDiq0dcIjNKdEgqqjQHaJgHZXptPQLrtcGtdV88P'>
      <QueryClientProvider client={queryClient}>

        <BrowserRouter>   <Init /></BrowserRouter>
      </QueryClientProvider>
    </MoralisProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
