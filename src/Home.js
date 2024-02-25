import cookie from './images/cookiesmelting.jpeg';
import './Home.css';

//simple homepage displaying a greeting and image of a cookie
function Home() {
  return (
    <div className="App">
      <body className="App-header">

      <p className='greeting'>
        Welcome to Tiff's Treats!
      </p>
      <img src={cookie} className="welcomeCookie" alt="Image of fresh baked cookie being split apart" />


      </body>
    </div>
  );
}

export default Home;
