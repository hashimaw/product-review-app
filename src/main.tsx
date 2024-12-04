import ReactDOM from 'react-dom/client';
import React from 'react';
import './index.css'
import App from './App.tsx'
import { MantineProvider } from '@mantine/core';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom'
import '@mantine/carousel/styles.css';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
     <MantineProvider>
      <QueryClientProvider client={queryClient}> 
      <App /> 
      </QueryClientProvider>
    </MantineProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
