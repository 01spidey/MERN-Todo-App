import './App.scss';
import Auth from './components/Auth';
import Content from './components/Content';
import Footer from './components/Footer';
import Header from './components/Header';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ReactDOM from "react-dom/client";

function App() {
  const username = localStorage.getItem('username');

  return (   
    <div className='App'>

      <Header/>
      
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Auth />}/>
          {/* <Route path="/todo" element={
            username === null ? <Auth /> : <Content />
          } /> */}
          <Route path="/todo" element={<Content />}/>
        </Routes>
      </BrowserRouter>

      <Footer/>

    </div>
  );

}

export default App;
