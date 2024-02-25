import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import MenuModal from './MenuModal';
import Button from 'react-bootstrap/esm/Button';
import {isMobile} from 'react-device-detect';

import chocolateChip from './images/chocolateChip.png';
import mandm from './images/mandm.png';
import whiteChipAlmond from './images/whiteChipAlmond.png';
import doubleChocolateChip from './images/doubleChocolateChip.png';
import snickerdoodle from './images/snickerdoodle.png';
import oatmealRaisin from './images/oatmealRaisin.png';
import peanutButter from './images/peanutButter.png';
import sugar from './images/sugar.png';
import chocolateChipPecan from './images/chocolateChipPecan.png';
import oatmealChocolateChip from './images/oatmealChocolateChip.png';
import holidaySprinkle from './images/holidaySprinkle.jpg';

import peanutButterBrownie from './images/peanutButterBrownie.png';
import chocolateBrownie from './images/chocolateBrownie.png';
import caramelBrownie from './images/caramelBrownie.png';

import vanillaScoop from './images/vanillaScoop.png';
import mintChocolateIceCream from './images/mintChocolateIceCream.png';
import tiffwich from './images/tiffwich.png';
import vanillaIceCream from './images/vanillaIceCream.png';
import chocolateIceCream from './images/chocolateIceCream.png';
import cookiesAndCreamIceCream from './images/cookiesAndCreamIceCream.png';

import dietCoke from './images/dietCoke.png';
import coke from './images/coke.png';
import milk from './images/milk.png';
import chocolateMilk from './images/chocolateMilk.png';
import vanillaFrappuchino from './images/vanillaFrappuchino.png';
import water from './images/water.png';
import mochaFrappuchino from './images/mochaFrappuchino.png';
import eggnog from './images/eggnog.png';

import placeholderCookie from './images/placeholderCookie.jpg';
import placeholderBrownie from './images/placeholderBrownie.jpg';
import placeholderDrink from './images/placeholderDrink.jpg';
import placeholderIcecream from './images/placeholderIcecream.jpg';

//accepts a 2d list as a parameter containing menu items
//component that will generate an aesthetically pleasing view of all the menu items in a given category on the order page
function CardGrid({menuItemList, addToCartFunction, availableItems = 0}) {

  //set up a map to hold the images for each menu item
  var image_map = new Map();
  image_map.set("Chocolate Chip Cookie", chocolateChip);
  image_map.set("White Chip Almond", whiteChipAlmond);
  image_map.set("Double Chocolate Chip", doubleChocolateChip);
  image_map.set("Peanut Butter", peanutButter);
  image_map.set("Snickerdoodle", snickerdoodle);
  image_map.set("Chocolate Chip Pecan", chocolateChipPecan);
  image_map.set("Sugar", sugar);
  image_map.set("Oatmeal Chocolate Chip", oatmealChocolateChip);
  image_map.set("Sugar Cookie with M&M", mandm);
  image_map.set("Oatmeal Raisin", oatmealRaisin);
  image_map.set("Holiday Sprinkle", holidaySprinkle);

  image_map.set("Peanut Butter Chocolate Bar", peanutButterBrownie);
  image_map.set("Classic Chocolate Brownie", chocolateBrownie);
  image_map.set("Salted Caramel Blondie", caramelBrownie);

  image_map.set("Vanilla Scoop", vanillaScoop);
  image_map.set("Mint Chocolate Chip", mintChocolateIceCream);
  image_map.set("Vanilla", vanillaIceCream);
  image_map.set("Chocolate", chocolateIceCream);
  image_map.set("Cookies n Cream", cookiesAndCreamIceCream);
  image_map.set("Tiffwich Scoop", tiffwich);

  image_map.set("1% White Milk", milk);
  image_map.set("Diet Coke", dietCoke);
  image_map.set("Coke", coke)
  image_map.set("Chocolate Milk", chocolateMilk);
  image_map.set("Water", water);
  image_map.set("Vanilla Frappuccino", vanillaFrappuchino);
  image_map.set("Mocha Frappuccino", mochaFrappuchino);
  image_map.set("Eggnog", eggnog);
  
  const margin = {
    margin: '0 10px'
  }

  if (isMobile){
    return (
      <Row>
        {Array.from({ length: menuItemList.length }).map((_, idx) => (
          <Col key={idx} style={{display: 'inline-block'}}>
            <Card>
              {image_map.has(menuItemList[idx][0]) ? (
                  <Card.Img alt="An image of the menu item described in the title." variant="top" src={image_map.get(menuItemList[idx][0])} />
                ) : <Card.Img alt="A silhouette of a cookie used as a placeholder image." variant="top" src={water} />
                }
              
              <Card.Body>
                <Card.Title>{menuItemList[idx][0]}</Card.Title>
                <Card.Text>
                  ${menuItemList[idx][4]}
                </Card.Text>
                <MenuModal item={menuItemList[idx]}/>
                <Button style={(availableItems && availableItems.get(menuItemList[idx][0]) === 0) ? {backgroundColor:'#555555', color:'mintcream', margin: '0 10px'} : {backgroundColor:'#000892', color:'mintcream ', margin: '0 10px'}} variant="success" onClick={() => {addToCartFunction([menuItemList[idx][0], menuItemList[idx][4]])}} disabled={availableItems && availableItems.get(menuItemList[idx][0]) === 0}>{(availableItems && availableItems.get(menuItemList[idx][0]) === 0) ? "Out Of Stock" : "Add to Cart"}</Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    );

  }
  else{
    return (
      <Row xs={1} md={2} className="g-4">
        {Array.from({ length: menuItemList.length }).map((_, idx) => (
          <Col key={idx}>
            <Card>
            {image_map.has(menuItemList[idx][0]) ? (
                  <Card.Img alt="An image of the menu item described in the title." variant="top" src={image_map.get(menuItemList[idx][0])} />
                ) : <Card.Img alt="A silhouette of a cookie used as a placeholder image." variant="top" src={placeholderCookie} />
                }
              <Card.Body>
                <Card.Title>{menuItemList[idx][0]}</Card.Title>
                <Card.Text>
                  ${menuItemList[idx][4]}
                </Card.Text>
                <MenuModal item={menuItemList[idx]}/>
                <Button style={(availableItems && availableItems.get(menuItemList[idx][0]) === 0) ? {backgroundColor:'#555555', color:'mintcream', margin: '0 10px'} : {backgroundColor:'#000892', color:'mintcream ', margin: '0 10px'}} variant="success" onClick={() => {addToCartFunction([menuItemList[idx][0], menuItemList[idx][4]])}} disabled={availableItems && availableItems.get(menuItemList[idx][0]) === 0}>{(availableItems && availableItems.get(menuItemList[idx][0]) === 0) ? "Out Of Stock" : "Add to Cart"}</Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    );

  }

  
}

export default CardGrid;