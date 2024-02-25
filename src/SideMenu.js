import React from 'react';
import './Home.css';

//this side menu is to be reused on multiple pages and allows for multiple pages categories to be selected between
//the categories will be passed in through a list
//finally, a function also needs to be passed in in order to handle the switching
function SideMenu({categories, categorySwap}){
    return (
      <div className="sideMenu">
        <ul className='sideListU'>
          {categories.map((category, index) => (
            <li className="sideListL" key={index}>
              <button className="sideButton" onClick={() => categorySwap(category)}>{category}</button>
            </li>
          ))}
        </ul>
      </div>
    );
}

export default SideMenu;