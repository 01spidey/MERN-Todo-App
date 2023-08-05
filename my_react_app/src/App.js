import './App.scss';
import Auth from './components/Auth';
import Content from './components/Content';
import Footer from './components/Footer';
import Header from './components/Header';
import { Routes, Route } from "react-router-dom";

function App() {

  return (   
    <div className='App'>

      <Header/>
      
      <Routes>
        <Route path="/" element={<Auth />}/>
        <Route path="/todo" element={<Content />}/>
        <Route path='*' element={<Auth/>}/>
      </Routes>

      <Footer/>

    </div>
  );

}

export default App;
