import SideMenu from './SideMenu';
import React, { useEffect, useState } from 'react';
import CardGrid from './CardGrid';
import Card from 'react-bootstrap/Card'
import axios from 'axios';
import './Menu.js';
import './Home.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import cookies from './images/assortedCookies.jpg';
import brownies from './images/assortedBrownies.jpg';
import icecream from './images/tiffwichs.png';
import beverages from './images/cokeImage.png';

//page that will give a simple glance of the categories we offer and all the currently available items for each category
function Menu() {

  const [categories, setCategories] = useState([]);
  const [menuItemListMap, setMenuItemListMap] = useState({});
  const [loading, setLoading] = useState(true);

  const image_list = [cookies, brownies, icecream, beverages];


  useEffect(() => {
    axios.get("https://bytebendersbackend.onrender.com/categories")
      .then(response => {
        //remove Specials category and then extract category from response data
        var tempCategories = response.data.filter(item => item.category != "Specials").map(function (item) {
          return item.category;
        });
        setCategories(tempCategories);

        tempCategories.forEach(category => {
          if (category !== '') {
            callCategoryItemsAPI(category);
          }
        });

      }).catch(error => {
        console.log("error in categories call");
      });
    
  }, []);

  const callCategoryItemsAPI = category => {
    const categoryItemsUrl = `/categoryItems?category=${category}`;
    axios.get(categoryItemsUrl)
      .then(response => {
        const tempMenuList = response.data.map(item => item.name);

        setMenuItemListMap(prevMap => {
          const updatedMap = { ...prevMap };
          updatedMap[category] = tempMenuList;
          return updatedMap;
        });
        setLoading(false);
      })
      .catch(error => {
        console.log("error in call to get category items");
      });
  };
  
  if (loading) {
    return (
      <div className="App">
        <header className="App-header">
          <div class="lds-ellipsis greeting"><div></div><div></div><div></div><div></div></div>
        </header>
      </div>
    );
  } else {
    return (
      <div class='menu'>
      <Container>
        <Row xs={1} md={2} className="g-4">
          {Array.from({ length: Object.keys(menuItemListMap).length }).map(
            (_, idx) => (
              <Col key={idx}>
                <Card className="text-center h-100">
                  <Card.Img
                    className="menuCard"
                    variant="top"
                    alt = "Image demonstrating an example of items from this category"
                    src={image_list[idx]}
                  />
                  <Card.Body>
                    <Card.Title>{categories[idx]}</Card.Title>
                    <Card.Text>
                      {menuItemListMap !== undefined &&
                      menuItemListMap !== null &&
                      menuItemListMap[categories[idx]] !== undefined &&
                      Object.keys(menuItemListMap).length > 0 ? (
                        menuItemListMap[categories[idx]].map((item, index) => (
                          <React.Fragment key={index}>
                            {index > 0 && ' - '}
                            {item}
                          </React.Fragment>
                        ))
                      ) : (
                        <React.Fragment>loading</React.Fragment>
                      )}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            )
          )}
        </Row>
        </Container>
        </div>
    );
  }
}
  
  export default Menu;
