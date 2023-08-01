import './App.scss';
import Auth from './components/Auth';
import Content from './components/Content';
import Footer from './components/Footer';
import Header from './components/Header';

function App() {


  return (   
    <div className='App'>
      
      <Header/>
          
      <Auth/>
      {/* <Content/> */}

      <Footer/>

    </div>
  );

}


export default App;
