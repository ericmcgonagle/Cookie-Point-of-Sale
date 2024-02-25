import './Home.css';
import SideMenu from './SideMenu';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UltimateTable from './UltimateTable';
import Form from './InputForm.js';
import { useAuth0 } from '@auth0/auth0-react';
import { Button, TableRow, tableBodyClasses } from '@mui/material';

//page for cashiers to place in store orders
//orders will be immediately tagged as fulfilled
//also allows cashier to switch between two views (ordering and order table management)
function Cashier() {

  const [category, setCategory] = useState('Cookies');
  const [categories, setCategories] = useState([]);
  const [menu2DList, setMenu2DList] = useState([[]]);

  const [tableData, setTableData] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ startDate: '', endDate: '' });
  const [error, setError] = useState(null);

  const [available, setAvailable] = useState(new Map());

  //make sure page remembers cart content
  const [cartMapCash, setcartMapCash] = useState(() => {
    const storageMapCash = localStorage.getItem('cartMapCash');
    return storageMapCash ? new Map(JSON.parse(storageMapCash)) : new Map();
  });

  //make sure page remembers which view you were on (ordering or table)
  const [view, setView] = useState(() => {
    const storeView = localStorage.getItem('view');
    return storeView ? JSON.parse(storeView) : 'ordering';
  });

  //order add, update, delete attributes
  const orderAttributes1 = ["Add", "Customer ID", "Order Content", "Price", "Order Date", "Order Status"];
  const orderAttributes2 = ["Update", "Order ID", "Customer ID", "Order Content", "Price", "Order Date", "Order Status"];
  const orderAttributes3 = ["Delete", "Order ID"];

  const orderDataBaseAttributes = ["customer_id", "order_content", "price", "order_placed_on", "status"];
  const orderDataBaseAttributesID = ["id", "customer_id", "order_content", "price", "order_placed_on", "status"];
  
  const [role, setRole] = useState(0);

  useEffect(() => {
    axios.get('/orders?table=orders')
      .then((response) => {
        setTableData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
        setError(error);
      })
    
  }, []);

  useEffect(() => {
    localStorage.setItem('cartMapCash', JSON.stringify(Array.from(cartMapCash.entries())));
  }, [cartMapCash]);

  useEffect(() => {
    localStorage.setItem('view', JSON.stringify(view));
  }, [view]);

  useEffect(() => {
    // axios.get("https://bytebendersbackend.onrender.com/categories")
    //   .then(response => {
    //     var tempCategories = response.data.map(function (item) {
    //       return item.category;
    //     });
    //     setCategories(tempCategories);
    //   }).catch(error => {
    //     console.log("error in categories call");
    //   });

    axios.get("https://bytebendersbackend.onrender.com/categories")
      .then(response => {
        var tempCategories = response.data.filter(item => item.category != "Specials").map(function (item) {
          return item.category;
        });
        setCategories(tempCategories);
      }).catch(error => {
        console.log("error in categories call");
      });

      if(category != '') {
        var categoryItemsUrl = "https://bytebendersbackend.onrender.com/categoryItems?category=" + category;
        axios.get(categoryItemsUrl)
          .then(response => {
            var tempMenu2dList = response.data.map(function (item) {
              return [item.name, item.ingredients, item.allergens, item.nutritional_content, item.price];
            });
            
            // Get available amounts from database
            response.data.map((item) => {
              setAvailable((prevAvailable) => new Map([...prevAvailable, [item.name, item.amount]]));
            });
            setMenu2DList(tempMenu2dList);
          }).catch(error => {
            console.log("error in call to get category items");
          });
      }
  }, [category]);
  
  const { isAuthenticated, user, isLoading } = useAuth0();

  if (isLoading) {
    return (
      <div className="App">
        <header className="App-header">
          <div class="lds-ellipsis greeting"><div></div><div></div><div></div><div></div></div>
        </header>
      </div>
    );
  }

  if (user) {
    axios.get('/roles?email=' + user.email)
      .then((response) => {
        setRole(response.data.role)
      })
      .catch((error) => {
        console.log('error in role call');
      });
  }

  if (role === -1 || !(role & 1)) {
    return (
      <div className="App">
        <header className="App-header">
          <p className='greeting'>
            Unauthorized Access
          </p>
        </header>
      </div>
    );
  }

  // Add item to cart
  const addToCart = (data) => {
    console.log("Trying to add to cart");
    const price = data[1];
    const name = data[0];
    // Only add to cart if amount available in database
    if (cartMapCash.get(name) && available.get(name) == cartMapCash.get(name)[0]) {
      return;
    }

    //if item is already in cart them increment count
    //otherwise simple add it to the cart with a count of 1
    if (cartMapCash.has(name)){
      setcartMapCash((prevCart) => new Map([...prevCart, [name, [cartMapCash.get(name)[0] + 1, (price * (cartMapCash.get(name)[0] + 1)).toFixed(2)]]]));
    }
    else{
      setcartMapCash((prevCart) => new Map([...prevCart, [name, [1, price]]]));
    }
  }

  const decrementCart = (name, amount, price) => {
    if(amount == 1) {
      removeFromCart(name);
    }
    else {
      setcartMapCash((prevCart) => new Map([...prevCart, [name, [cartMapCash.get(name)[0] - 1, (price * (cartMapCash.get(name)[0] - 1)).toFixed(2)]]]));
    }
  }

  //allow cashier to change between order creation and table
  const changeView = () => {
    if (view === 'ordering'){
      setView('tables');
    }
    else{
      setView('ordering');
    }
  }

  const removeFromCart = (name) => {
    const tempMap = new Map(cartMapCash);
    tempMap.delete(name);
    setcartMapCash(tempMap);
  }

  // Checkout cart
  const checkout = async () => {
    // Check if cart is empty
    if (cartMapCash.size == 0) {
      console.log("Cart is empty");
      return;
    }

    // Create post body from cart
    const postBody = {
      order: Array.from(cartMapCash, ([key, value]) => {
        return {name: key, amount: value[0]};
      }),
      phoneNumber: "cashier",
      price: Array.from(cartMapCash).reduce((total, [key, value]) => total + Number(value[1]), 0) * 1.0825,
      pointsUsed: 0,
      status: "Fulfilled"
    }

    // Send post request
    try {
      await axios.post("/order", postBody);
    } catch (e) {
      console.log(e);
    }

    // Decrement available amounts by order amounts
    Array.from(cartMapCash, ([key, value]) => {
      return { name: key, amount: value[0] };
    }).forEach((item) => {
     available.set(item.name, available.get(item.name) - item.amount);
    });

    // Clear cart
    setcartMapCash(new Map());
  }

  // Empties cart
  const emptyCart = () => {
    setcartMapCash(new Map());
  }

  //change the writing on button depending on the current view
  let changeBut;
  if (view === 'ordering'){
    changeBut = <button className='managerSwapButtons changeView' onClick={() => {changeView()}}>Show Order Management Table</button>;
  }
  else{
    changeBut = <button className='managerSwapButtons changeView' onClick={() => {changeView()}}>Show Ordering Interface</button>;
  }

  return (
    <div className="App">
      <div className="App-header">

        {view === 'ordering'
          ? <SideMenu categories={categories} categorySwap={setCategory}></SideMenu>
          : <p></p>
        }

        <div className="contentarea">
          {changeBut}
          {view === 'ordering'
            ? <React.Fragment>

            <h3>Category: <span style={{color: '#1d1d1e'}}>{category}</span> </h3>
            <div className="contentBox">
            {menu2DList.map((value, index) => (
            <div key={index}>
                <button onClick={() => addToCart([value[0], value[4]])} className="managerSwapButtons cashierButtons">{value[0]}</button>
            </div>
              ))}
          </div>

            </React.Fragment>

          : <React.Fragment>

              <TableRow>
                <Form formData={orderAttributes1} databaseAttributes={orderDataBaseAttributes} tableName={"orders"}></Form>
                <Form formData={orderAttributes2} databaseAttributes={orderDataBaseAttributesID} tableName={"orders"}></Form>
                <Form formData={orderAttributes3} databaseAttributes={["id"]} tableName={"orders"}></Form>
              </TableRow>
              <div className='managerBox'>

              <UltimateTable
                tableType="orders"
                data={tableData}
              />

              </div>

              </React.Fragment>
        }
        </div>

        {view === 'ordering'
          ? <div className='cartareacash'>
            <p>CART</p>
              <div className='cartBox cart'> 

              {[...cartMapCash].map(([key, value]) => (
                <ul className='cartl'>
                <li className='cartList'><button className='cartListButton cartX' onClick={() => {removeFromCart(key)}}>x</button> 
                {key} - ${value[1]} 
                <div className='quantityToggle'>                
                  <button className='cartListButton cartQuant' style={{color: 'red'}} onClick={() => {decrementCart(key, value[0], (value[1]/value[0]))}}>-</button> 
                  <span className='makeBlue'>{value[0]}</span>
                  <button className='cartListButton cartQuant' style={{color: 'green'}} onClick={() => {addToCart([key, (value[1]/value[0])])}}>+</button> 
                  </div></li>
              </ul>
        ))}

              </div>
              <label>Subtotal: ${(Array.from(cartMapCash).reduce((total, [key, value]) => total + Number(value[1]), 0)).toFixed(2)}</label>
              <button className="managerSwapButtons cartbutton" onClick={() => checkout()}>Checkout</button>
              <button className="managerSwapButtons cartbutton" onClick={() => emptyCart()}>Empty Cart</button>
            </div>
          : <p></p>
        }

      </div>
    </div>
  );
}

export default Cashier;