import './Home.css';
import SideMenu from './SideMenu';
import UltimateTable from './UltimateTable';
import React, { useState, useEffect } from 'react';
import { TableRow, tableBodyClasses } from '@mui/material';
import axios from 'axios';
import Form from './InputForm.js';
import { useAuth0 } from '@auth0/auth0-react';

//page to show customer points and order history
function UserProfile() {
  const [points, setPoints] = useState(-1);
  const [orders, setOrders] = useState('');

  const { isAuthenticated, user, isLoading } = useAuth0();

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    axios
      .get('/userPoints?email=' + user.email)
      .then((response) => {
        setPoints(response.data.points);
      })
      .catch((error) => {
        console.log('Error in user points', error);
      });

    axios
      .get('userOrders?table=orders&email=' + user.email)
      .then((response) => {
        setOrders(response.data);
        console.log(orders)
      })
      .catch((error) => {
        console.log('Error in user orders', error);
      });
  }, [isAuthenticated, user]);

  if (isLoading) {
    return (
      <div className="App">
        <header className="App-header">
          <p className="greeting">Loading</p>
        </header>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="App">
        <header className="App-header">
          <p className="greeting">Unauthorized Access</p>
        </header>
      </div>
    );
  }

  return (
    <div className="App">
      <div className="App-header">
        <div className="contentarea">
          <h3 style={{ textDecoration: 'underline' }}>
            {user.given_name}'s{' '}
            <span style={{ color: '#1d1d1e' }}>Profile</span>{' '}
          </h3>
          <h3>You currently have:</h3>
          <div className="pointsArea">
            <p className="pointCount">{points}</p>
            <p>points!</p>
          </div>

          <p className='pointExplanation'>
            Ten points are earned for every dollar spent. You may exchange your
            points at checkout with each point being equivalent to one cent.
          </p>

          <h3>Order History:</h3>
          <div className="contentBox">
            <UltimateTable tableType="orders" data={orders} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
