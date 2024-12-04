import '@mantine/core/styles.css';
import { useMantineColorScheme } from '@mantine/core';
import { Home } from './Home';
import { Route, Routes } from 'react-router-dom';
import { ProductDetails } from './ProductDetails';

function App() {
  const { setColorScheme } = useMantineColorScheme();
  setColorScheme('light')
  return (
    <div className='mx-auto max-w-screen-2xl px-5 xs:px-10 sm:px-12 md:px-12 xl:px-24'>
      
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/details/:id" element={<ProductDetails/>} />
        </Routes>
      
    </div>
  )
}

export default App
