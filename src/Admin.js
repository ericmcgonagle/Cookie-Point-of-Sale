import './Home.css';
import UltimateTable from './UltimateTable';
import React, { useState, useEffect } from 'react';
import { TableRow, tableBodyClasses } from '@mui/material';
import axios from 'axios';
import Form from './InputForm.js';
import { useAuth0 } from '@auth0/auth0-react';

//page that will allow admins to modify role permissions for each user
function Admin() {
    const [role, setRole] = useState(0);
    const [users, setUsers] = useState("");
    
    useEffect(() => {

        axios.get("https://bytebendersbackend.onrender.com/users").then(response => {
            let data_list = response.data;
            data_list.forEach(data => {
                delete data.points;
                delete data.name;
                data.cashier = data.cashier.toString();
                data.manager = data.manager.toString();
                data.admin = data.admin.toString();
            });
            setUsers(data_list);
        }).catch(error => {
            console.log(error);
        });

    }, []);

    const formAttributes1 = ["Add", "ID", "Email", "Cashier", "Manager", "Admin"];
    const formAttributes2 = ["Update", "ID", "Email", "Cashier", "Manager", "Admin"];
    const formAttributes3 = ["Delete", "ID"];

    const databaseAttributes = ["customer_id", "email", "cashier", "manager", "admin"];

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

  if (role === -1 || !(role & 4)) {
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

    return (
        <div class='admin' style={{marginLeft: '50px', marginRight: '50px', justifyContent: 'center', alignItems: 'center', display: 'flex', flexDirection: 'column'}}> 
            <TableRow style={{textAlign: 'center'}}>
                <Form formData={formAttributes1} databaseAttributes={databaseAttributes} tableName={"rewards"}></Form>
                <Form formData={formAttributes2} databaseAttributes={databaseAttributes} tableName={"rewards"}></Form>
                <Form formData={formAttributes3} databaseAttributes={[databaseAttributes[0]]} tableName={"rewards"}></Form>
            </TableRow>
            <div className='managerBox'>

              <UltimateTable tableType='admin' data={users} />

            </div>  
        </div>
    );
}
export default Admin;