import './Home.css';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import SideMenu from './SideMenu';
import React, {useEffect, useState } from 'react';
import axios from 'axios';

import couple from './images/tiffscouple.png';
import store from './images/hoursimage.jpg';
import truck from './images/contactimage.png';
import news from './images/tiffsNews.jpeg';

//page to display useful information about the business
function AboutUs() {

  const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  
  const [weather, setWeather] = useState(false);
  const [closed, setClosed] = useState(false);
  const [weatherCondition, setWeatherCondition] = useState("");

  useEffect(() => {
    console.log("call");
    axios.get("/weather").then(response => {
      if (response.data === "Thunderstorm" || response.data === "Snow") {
        setClosed(true);
      }
      setWeather(true);
      setWeatherCondition(response.data);
    });
  }, []);

  

  const [category, setCategory] = useState('Our Story');

  const categories = ['Our Story', 'Hours', 'Contact Information', 'News'];

  const [newsLog, setNewsLog] = useState([]);
  const [load, setLoad] = useState(true);
  const [newsFail, setNewsFail] = useState(false);


  async function retrieveNews() {
    
    setLoad(true);
    
    var url = "https://api.thenewsapi.com/v1/news/all?api_token=mPDhUshXwc1jcpXx39w4tYiOJGNYNvIyVKB6CBpi&search=tiff%27s%20treats&search_fields=title,description&sort=published_at";

    try {
      const resp = await axios.get(url);
      setNewsLog(resp.data.data);
    } catch (e) {
      setNewsFail(true);
    }


    // console.log(resp.data.data);

    setLoad(false);
  }

  useEffect(() => {
    retrieveNews();
  }, []);

  function DisplayImage(){

    switch(category){
      case 'Our Story':
        return(
          <img src={couple} className="aboutImage aboutImage1" alt="An illustrated image of the founders of Tiff's Treats." />
        );

      case 'Hours':
        return(
          <img src={store} className="aboutImage aboutImage2" alt="Image that showcases the exterior of the Tiff's Treats store in college station." />
        );

      case 'Contact Information':
        return(
          <img src={truck} className="aboutImage aboutImage3" alt="Image that shows a Tiff's Treats delivery truck." />
        );
      case 'News':
        return(
          <img src={news} className="aboutImage aboutImage3" alt="Image that shows a Tiff's Treats delivery truck." />
        );
    }

  }
  
  function hours(_day) {
    const d = new Date();
    const day = weekday[d.getDay()];

    if (day === _day && closed) {
      return (<p>{_day + ': Closed due to weather'}</p>);
    } else if (!weather) {
      return (<p>{'Loading Weather'}</p>);
    } else if (day === _day) {
      return (<p>{_day + ': 9:00 AM - 12:00 AM - It is currently '}<span class='weatherStatus'>{weatherCondition.toLowerCase()}</span>{' outside'}</p>);
    } else {
      return (<p>{_day + ': 9:00 AM - 12:00 AM'}</p>);
    }
  }

  function DisplayContent(){

      switch(category){
        case 'Our Story':
          return(
            <p>
              Tiff's Treats was founded by Tiffany Taylor and Leon Chen in 1999. Born and cultivated in Austin, Texas, we are committed to filling the world with delicious confections.
            </p>
          );

        case 'Hours':
          return(
            <table>
              <tr>
                {hours("Monday")}
              </tr>
              <tr>
                {hours("Tuesday")}
              </tr>
              <tr>
                {hours("Wednesday")}
              </tr>
              <tr>
                {hours("Thursday")}
              </tr>
              <tr>
                {hours("Friday")}
              </tr>
              <tr>
                {hours("Saturday")}
              </tr>
              <tr>
                {hours("Sunday")}
              </tr>
            </table>
          );

        case 'Contact Information':
          return(
            <table>
              <tr>
                <p><span style={{color: '#1d1d1e'}}>Phone:</span> (512) 473-2600</p>
              </tr>
              <tr>
                <p><span style={{color: '#1d1d1e'}}>Email:</span> customerservice@cookiedelivery.com</p>
              </tr>
              <tr>
                <p><span style={{color: '#1d1d1e'}}>Address:</span> Tiff's Treats Customer Service
                  8310-1 N. Capital of Texas Highway, Suite 110
                  Austin, TX 78731</p>
              </tr>
            </table>
          );

        case 'News':
          return (
            <div>
              {load ? (
                <p>Currently Loading news...</p>
              ) : newsFail ? (
                <p>No News For Today</p>
              ) : (
                <div>
                  {newsLog.map((newsLog, index) => (
                    <ul style={{ listStyle: 'none' }}>
                      <li>
                        <a href={newsLog.url}>{newsLog.title}</a> -{' '}
                        {newsLog.published_at.split('T')[0]}
                      </li>
                    </ul>
                  ))}
                </div>
              )}
            </div>
          );
      }

  }
  
  return (
    <div className="App">
      <div className="App-header">
        <SideMenu categories={categories} categorySwap={setCategory}></SideMenu>
        <div className='contentarea'>
        <h3>About Tiff's Treats: <span style={{ color: '#1d1d1e'}}>{category}</span> </h3>
          <div className='aboutBox'>
            <DisplayContent></DisplayContent>
           </div>
        </div>
        <DisplayImage></DisplayImage>
        
      </div>
    </div>
  );
}

export default AboutUs;
