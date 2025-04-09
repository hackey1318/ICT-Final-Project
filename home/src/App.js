import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Main from './page/user/Main';
import Layout from './page/user/Layout';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route index element={<Main />} />
        </Route>
        <Route path='/manager' element={<Layout />}>
          <Route index element={<Main />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
