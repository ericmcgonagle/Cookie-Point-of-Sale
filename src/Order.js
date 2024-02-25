import './Home.css';
import SideMenu from './SideMenu';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CardGrid from './CardGrid.js';
import Button from '@mui/material/Button';
import {RadioGroup, Radio} from 'react-radio-group'
import FormControlLabel from '@mui/material/FormControlLabel';
import { Container, FormControl, FormHelperText, TableRow, TextField } from '@mui/material';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import { useAuth0 } from '@auth0/auth0-react';

//page for customers to make orders where they can pick between pick up or delivery
function Order() {

  const { isAuthenticated, user, isLoading } = useAuth0();

  const [category, setCategory] = useState('Cookies');
  const [categories, setCategories] = useState([]);
  const [menu2DList, setMenu2DList] = useState([[]]);
  const [loading, setLoading] = useState(true);

  //will make sure that the cart content is remembered when leaving the page
  const [cartMap, setCartMap] = useState(() => {
    const storageMap = localStorage.getItem('cartMap');
    return storageMap ? new Map(JSON.parse(storageMap)) : new Map();
  });

  useEffect(() => {
    localStorage.setItem('cartMap', JSON.stringify(Array.from(cartMap.entries())));
  }, [cartMap]);

  const [available, setAvailable] = useState(new Map());

  //message that is shown in checkout process depends on if user is logged in
  const [pointMessage, setPointMessage] = useState('Please login if you would like to use and earn points.');

  useEffect(() => {

    if (isAuthenticated) {
      setPointMessage('You currently have 0 points.')
    }
   
  });

  useEffect(() => {
    axios.get("https://bytebendersbackend.onrender.com/categories")
      .then(response => {
        //remove Specials category and then extract category from response data
        var tempCategories = response.data.filter(item => item.category != "Specials").map(function (item) {
          return item.category;
        });
        setCategories(tempCategories);
      }).catch(error => {
        console.log("error in categories call");
      });

    if (category != '') {
      var categoryItemsUrl = "/categoryItems?category=" + category;
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
          setLoading(false);
        }).catch(error => {
          console.log("error in call to get category items");
        });
    }
  }, [category]);

  // Add item to cart
  const addToCart = (data) => {
    const price = data[1];
    const name = data[0];
    // Only add to cart if amount available in database
    if (cartMap.get(name) && available.get(name) === cartMap.get(name)[0]) {
      return;
    }

    // Either increment or add to cart
    if (cartMap.has(name)) {
      setCartMap((prevCart) => new Map([...prevCart, [name, [cartMap.get(name)[0] + 1, (price * (cartMap.get(name)[0] + 1)).toFixed(2)]]]));
    }
    else {
      setCartMap((prevCart) => new Map([...prevCart, [name, [1, price]]]));
    }
  }

  const removeFromCart = (name) => {
    const tempMap = new Map(cartMap);
    tempMap.delete(name);
    setCartMap(tempMap);
  }

  const decrementCart = (name, amount, price) => {
    if (amount == 1) {
      removeFromCart(name);
    }
    else {
      setCartMap((prevCart) => new Map([...prevCart, [name, [cartMap.get(name)[0] - 1, (price * (cartMap.get(name)[0] - 1)).toFixed(2)]]]));
    }
  }

  // Empties cart
  const emptyCart = () => {
    setCartMap(new Map());
  }

  //Stuff for the checkout process
  //############################################################################################# 

  const [open, setOpen] = React.useState(false);
  const [deliveryOpen, setDeliveryOpen] = React.useState(false);
  const [orderScreen, setOrderScreen] = React.useState(false);
  const [phoneNumberScreen, setPhoneNumberScreen] = React.useState(false);
  const [confirmationScreen, setConfirmationScreen] = React.useState(false);
  const [val, setValue] = React.useState("none");
  const [error, setError] = React.useState(false);
  const [helpText, setHelpText] = React.useState('');
  const [pointsUsed, setPointsUsed] = React.useState(0.00);
  const [pointError, setPointError] = React.useState("");
  const [points, setPoints] = React.useState(0.00);
  const [phoneError, setPhoneError] = React.useState("");
  const [phoneNumber, setPhoneNumber] = React.useState("");
  const [deliveryAddress, setDeliveryAddress] = React.useState("");
  const [deliveryCityState, setDeliveryCityState] = React.useState("");
  const [deliveryZipCode, setDeliveryZipCode] = React.useState("");
  const [deliveryError, setDeliveryError] = React.useState("");
  const [role, setRole] = React.useState(-1);
  const [newUser, setNewUser] = React.useState(false);
  const [pointsEarned, setPointsEarned] = React.useState(0.00);
  const [delivery, setDelivery] = React.useState(false);

  // Checkout cart
  const checkout = async () => {
    // Check if cart is empty
    if (cartMap.size == 0) {
      console.log("Cart is empty");
      return;
    }

    var price;

    if (delivery) {
      price = (Array.from(cartMap).reduce((total, [key, value]) => total + Number(value[1]), 0) * 1.0825) + 3;
    }
    else {
      price = Array.from(cartMap).reduce((total, [key, value]) => total + Number(value[1]), 0) * 1.0825;
    }
    

    // Create post body from cart
    const postBody = {
      order: Array.from(cartMap, ([key, value]) => {
        return { name: key, amount: value[0] };
      }),
      phoneNumber: "TEST",
      price: price,
      pointsUsed: Number(pointsUsed) * 100,
      status: "Pending"
    }
    if (isAuthenticated) {
      postBody.phoneNumber = phoneNumber;
      postBody.email = user.email;
    }

    console.log(postBody);

    setPointsEarned(Array.from(cartMap).reduce((total, [key, value]) => total + Number(value[1]), 0) * 1.0825 * 10);

    // Send post request
    try {
      await axios.post("/order", postBody);
    } catch (e) {
      console.log(e);
    }

    // Decrement available amounts by order amounts
    Array.from(cartMap, ([key, value]) => {
      return { name: key, amount: value[0] };
    }).forEach((item) => {
      available.set(item.name, available.get(item.name) - item.amount);
    });

    // Clear cart
    setCartMap(new Map());
  }

  //actions to perform when checkout button is clicked
  const handleClickOpen = () => {

    if (cartMap) {
      if (cartMap.size != 0) {
        setOpen(true);
        setDelivery(false);
        console.log(cartMap.entries());
      }
    }
  };

  const handleClose = (event, reason) => {
    //stop it from closing by clicking outside of the dialogue
    if (reason == "backdropClick") {
      return;
    }
    setValue("");
    setOpen(false);
  };

  const handleOrderClose = (event, reason) => {
    //stop it from closing by clicking outside of the dialogue
    if (reason == "backdropClick") {
      return;
    }
    setOrderScreen(false);
    setPointError("");
    setPointsUsed(Number(0).toFixed(2));
  };

  const handlePhoneNumberClose = (event, reason) => {
    setPhoneNumber("");
    setPhoneError("");
    setPhoneNumberScreen(false);
  };

  const processOrder = () => {
    checkout();
    setOrderScreen(false);
    setConfirmationScreen(true);
  };

  const handleConfirmationClose = () => {
    setConfirmationScreen(false);
  };

  const handleDeliveryClose = () => {
    setDeliveryOpen(false);
  }

  const processRadio = (event) => {

    setValue(event);
    setHelpText(' ');
    setError(false);
  };

  //read in the users phone number and continue to next screen
  const processPhoneNumber = (event) => {
    if (phoneNumber === "") {
      return;
    }

    setPhoneNumberScreen(false);

    axios.post("/usersWithPhoneNumber", { email: user.email, number: phoneNumber, name: user.name });

    axios
      .get('/userPoints?email=' + user.email)
      .then(async (response) => {
        setPoints(response.data.points);
      })
      .catch((error) => {
        console.log('error in user points call');
      });

    if (val === 'deliver') {
      setDeliveryOpen(true);
    } else {
      setOrderScreen(true);
    }

  };

  //checks for changes in phone number text field and updates the corresponding variable
  const processPhoneNumberFieldChange = (event) => {

    console.log("here it is" + event.target.value);

    setPhoneNumber(event.target.value);

  };

  const processDeliveryAddressChange = (event) => {
    setDeliveryAddress(event.target.value);
  }

  const processDeliveryCityStateChange = (event) => {
    setDeliveryCityState(event.target.value);
  }

  const processDeliveryZipCodeChange = (event) => {
    setDeliveryZipCode(event.target.value);
  }

  const processDeliveryAddress = () => {
    //check if delivery is in range
    //if out of range give error and back up
    //otherwise proceed to order screen

    let temp_address = deliveryAddress + ", " + deliveryCityState + " " + deliveryZipCode;
    console.log(temp_address);

    let temp_CityState = deliveryCityState.toLowerCase();

    if (temp_CityState.includes("bryan") || temp_CityState.includes("college station")) {
      setDeliveryOpen(false);
      setDelivery(true);
      setOrderScreen(true);
    }
    else {
      alert("Sorry we can not deliver to that address. Please try another.");
    }
  }

  //reads in the amount of points the user wants to use and provides error checking
  const processPointChange = (event) => {
    //if no points entered then set points used to 0
    if (event.target.value === ""){
      var temp = 0;
      setPointsUsed(Number(temp).toFixed(2));
      setPointError("");
    }
    else{
      //if this is delivery then add 3 dollars to the total price to keep to track of
      var price = parseInt(((Array.from(cartMap).reduce((total, [key, value]) => total + Number(value[1]), 0)) * 108.25).toFixed(2));
      if (delivery) {
        price += 300;
      }
      console.log(price);
      //don't allow them to use more points than they have
      if (parseInt(event.target.value) > Number(points)){
        setPointsUsed((price / 100).toFixed(2));
        setPointError("Error: You have entered more points than you currently have.");
      }
      //don't let the price go below 0
      else if (parseInt(event.target.value) > price) {
        setPointsUsed((Number(price) / 100).toFixed(2));
        setPointError("Error: The total price may not go below 0. We will only use " + price.toString() + " points for now.");
      }
      //dont let the user use a negative amount of points
      else if (parseInt(event.target.value) < 0) {
        setPointsUsed(Number(0).toFixed(2));
        setPointError("Error: You have entered a negative amount of points.");
      }
      else{
        var temp = parseInt(event.target.value) / 100.0;
        setPointsUsed(Number(temp).toFixed(2));
        setPointError("");

      }
    }

  };

  //find out if user wants to pick up or deliver
  const processRetrievalOption = (event) => {
    event.preventDefault();

    if (val === 'deliver') {

      setOpen(false);
      
      //we will use this part to check if the user needs to enter phone number
      if (isAuthenticated) {
        axios
          .get('/roles?email=' + user.email)
          .then(async (response) => {
            if (response.data.role === -1) {
              setPhoneNumberScreen(true);
            }
            else {

              axios
                .get('/userPoints?email=' + user.email)
                .then(async (response) => {
                  setPoints(response.data.points);
                  console.log(points);
                })
                .catch((error) => {
                  console.log('error in user points call');
                });
                setDeliveryOpen(true);
            }
          })
          .catch((error) => {
            console.log('error in role call');
          });
        
      } else {
        setDeliveryOpen(true);
      }
      
    } else if (val === 'pickUp') {

      setOpen(false);

      //we will use this part to check if the user needs to enter phone number
      if (isAuthenticated) {
        axios
          .get('/roles?email=' + user.email)
          .then(async (response) => {
            if (response.data.role === -1) {
              setPhoneNumberScreen(true);
            }
            else {

              axios
                .get('/userPoints?email=' + user.email)
                .then(async (response) => {
                  setPoints(response.data.points);
                  console.log(points);
                })
                .catch((error) => {
                  console.log('error in user points call');
                });
              setOrderScreen(true);
            }
          })
          .catch((error) => {
            console.log('error in role call');
          });
        
      } else {
        setOrderScreen(true);
      }

    } else {
      setHelpText('Please choose an option.');
      setError(true);
    }
  };

  //#############################################################################################

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
      <div className="App">
        <div className="App-header">
          <SideMenu
            categories={categories}
            categorySwap={setCategory}
          ></SideMenu>
          <div className="orderArea">
            <CardGrid
              menuItemList={menu2DList}
              addToCartFunction={addToCart}
              availableItems={available}
            ></CardGrid>
          </div>
          <div className="cartarea">
            <p>CART</p>
            <div className="cartBox cart">
              {[...cartMap].map(([key, value]) => (
                <ul className="cartl">
                  <li className="cartList">
                    <button
                      className="cartListButton cartX"
                      onClick={() => {
                        removeFromCart(key);
                      }}
                    translate='no'>
                      x
                    </button>
                    {key} - ${value[1]}{' '}
                    <div className="quantityToggle">
                      <button
                        className="cartListButton cartQuant"
                        style={{ color: 'red' }}
                        onClick={() => {
                          decrementCart(key, value[0], value[1] / value[0]);
                        }}
                      >
                        -
                      </button>
                      <span className="makeBlue">{value[0]}</span>
                      <button
                        className="cartListButton cartQuant"
                        style={{ color: 'green' }}
                        onClick={() => {
                          addToCart([key, value[1] / value[0]]);
                        }}
                      >
                        +
                      </button>{' '}
                    </div>
                  </li>
                </ul>
              ))}
            </div>

            {/* Checkout windows */}

            <React.Fragment>
              <label>
                Subtotal: $
                {Array.from(cartMap)
                  .reduce((total, [key, value]) => total + Number(value[1]), 0)
                  .toFixed(2)}
              </label>

              <Button
                sx={{
                  fontSize: '3.5vmin',
                  border: '',
                  marginTop: '2%',
                  borderRadius: '10px',
                  textTransform: 'none',
                  marginRight: '5px',
                  backgroundColor: '#fafafa',
                  color: '#1d1d1e',
                  border: '2px solid #1d1d1e',
                }}
                onClick={handleClickOpen}
              >
                Checkout
              </Button>

              <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Checkout</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    Would you like to pick up your order in store or get it
                    delivered?
                  </DialogContentText>

                  <Container
                    style={{ display: 'flex', justifyContent: 'center' }}
                  >
                    <FormControl error={error}>
                      <RadioGroup
                        row
                        aria-labelledby="Choosing Retrieval Options"
                        name="retoptions"
                        value={val}
                        onChange={processRadio}
                      >
                        <FormControlLabel
                          value="pickUp"
                          control={<Radio />}
                          label="Pick Up"
                        />
                        <FormControlLabel
                          value="deliver"
                          control={<Radio />}
                          label="Deliver"
                        />
                      </RadioGroup>

                      <FormHelperText>{helpText}</FormHelperText>
                    </FormControl>
                  </Container>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleClose}>Cancel</Button>
                  <Button onClick={processRetrievalOption}>Continue</Button>
                </DialogActions>
              </Dialog>

              <Dialog open={deliveryOpen} onClose={handleDeliveryClose}>
                <DialogTitle>Delivery Address</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    Please enter your delivery address:
                  </DialogContentText>

                  <Container
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      flexDirection: 'column',
                    }}
                  >
                    <TextField
                      type="text"
                      label="Enter Address"
                      onChange={processDeliveryAddressChange}
                      style={{
                        width: '100%',
                        height: '10%',
                        marginBottom: '10px',
                      }}
                    ></TextField>

                    <TextField
                      type="text"
                      label="Enter City, State"
                      onChange={processDeliveryCityStateChange}
                      style={{
                        width: '100%',
                        height: '10%',
                        marginBottom: '10px',
                      }}
                    ></TextField>

                    <TextField
                      type="text"
                      label="Enter Zip Code"
                      onChange={processDeliveryZipCodeChange}
                      style={{
                        width: '100%',
                        height: '10%',
                        marginBottom: '10px',
                      }}
                    ></TextField>

                    <FormHelperText>{deliveryError}</FormHelperText>
                  </Container>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleDeliveryClose}>Cancel</Button>
                  <Button onClick={processDeliveryAddress}>Continue</Button>
                </DialogActions>
              </Dialog>

              <Dialog open={phoneNumberScreen} onClose={handlePhoneNumberClose}>
                <DialogTitle>Checkout</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    Since this is your first order please enter your phone
                    number:
                  </DialogContentText>

                  <Container
                    style={{ display: 'flex', justifyContent: 'center' }}
                  >
                    <TextField
                      type="number"
                      onChange={processPhoneNumberFieldChange}
                      style={{ width: '50%', height: '10%' }}
                    ></TextField>

                    <FormHelperText>{phoneError}</FormHelperText>
                  </Container>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handlePhoneNumberClose}>Cancel</Button>
                  <Button onClick={processPhoneNumber}>Continue</Button>
                </DialogActions>
              </Dialog>

              <Dialog open={orderScreen} onClose={handleOrderClose}>
                <DialogTitle>Checkout</DialogTitle>
                <DialogContent>
                  <DialogContentText>Order details:</DialogContentText>

                  <Container
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      flexDirection: 'column',
                    }}
                  >
                    {[...cartMap].map(([key, value]) => (
                      <ul className="plusList">
                        <li style={{ color: '#1d1d1e' }}>
                          {' '}
                          ${value[1]} - {key} x {value[0]}
                        </li>
                      </ul>
                    ))}

                    <h5>
                      Subtotal: $
                      {Array.from(cartMap)
                        .reduce(
                          (total, [key, value]) => total + Number(value[1]),
                          0
                        )
                        .toFixed(2)}
                    </h5>
                    <h5>
                      Tax: $
                      {(
                        Array.from(cartMap).reduce(
                          (total, [key, value]) => total + Number(value[1]),
                          0
                        ) * 0.0825
                      ).toFixed(2)}
                    </h5>

                    {delivery ? <h5>Delivery fee: $3.00</h5> : <p></p>}

                    {/*We should make it so that this part about points only shows up if the user is signed in and has at least 1 point */}

                    {/*We can update the p tag next to the textfield so that it shows the users total point count */}

                    {/*Need to add error checks to ensure the user enters a valid number*/}

                    {isAuthenticated && points > 0 ? (
                      <div>
                        <h6>How many points would you like to use?</h6>

                        <div style={{ display: 'inline-block' }}>
                          <FormHelperText>{pointError}</FormHelperText>

                          <TextField
                            type="number"
                            defaultValue={0}
                            onChange={processPointChange}
                            style={{ width: '40%', height: '30%' }}
                          ></TextField>

                          <p>/{points}</p>
                        </div>

                        <h5>Points Credit: ${pointsUsed}</h5>
                      </div>
                    ) : (
                      <p>{pointMessage}</p>
                    )}

                    <h5></h5>

                    {delivery ? (
                      <h4>
                        Total: $
                        {Number(
                          Array.from(cartMap).reduce(
                            (total, [key, value]) => total + Number(value[1]),
                            0
                          ) *
                            1.0825 -
                            pointsUsed +
                            3
                        ).toFixed(2)}
                      </h4>
                    ) : (
                      <h4>
                        Total: $
                        {Number(
                          Array.from(cartMap).reduce(
                            (total, [key, value]) => total + Number(value[1]),
                            0
                          ) *
                            1.0825 -
                            pointsUsed
                        ).toFixed(2)}
                      </h4>
                    )}
                  </Container>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleOrderClose}>Cancel</Button>
                  <Button onClick={processOrder}>Order</Button>
                </DialogActions>
              </Dialog>

              <Dialog
                open={confirmationScreen}
                onClose={handleConfirmationClose}
              >
                <DialogTitle>Confirmation</DialogTitle>
                <DialogContent>
                  <Container
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      flexDirection: 'column',
                    }}
                  >
                    <h2>Thank you for your order!</h2>

                    {isAuthenticated ? (
                      <h4>
                        You have earned {Number(pointsEarned).toFixed(0)}{' '}
                        points.
                      </h4>
                    ) : (
                      <p></p>
                    )}
                  </Container>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleConfirmationClose}>OK</Button>
                </DialogActions>
              </Dialog>
            </React.Fragment>

            <Button
              sx={{
                fontSize: '3.5vmin',
                border: '',
                marginTop: '2%',
                borderRadius: '10px',
                textTransform: 'none',
                marginRight: '5px',
                backgroundColor: '#fafafa',
                color: '#1d1d1e',
                border: '2px solid #1d1d1e',
              }}
              onClick={() => emptyCart()}
            >
              Empty Cart
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

export default Order;