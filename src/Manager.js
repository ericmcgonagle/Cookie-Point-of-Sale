import './Home.css';
import './Manager.css';
import SideMenu from './SideMenu';
import UltimateTable from './UltimateTable';
import React, { useState, useEffect, useRef } from 'react';
import { Button, TableRow, tableBodyClasses } from '@mui/material';
import axios from 'axios';
import Form from './InputForm.js';
import { useAuth0 } from '@auth0/auth0-react';
import DateRangeModal from './DateRangeModal.js';
import Modal from 'react-bootstrap/Modal';

//page that will show manager tables and reports
function Manager() {
  const [category, setCategory] = useState(() => {
    const storeView = localStorage.getItem('category');
    return storeView ? JSON.parse(storeView) : 'Menu';
  });

  useEffect(() => {
    localStorage.setItem('category', JSON.stringify(category));
  }, [category]);

  //const [category, setCategory] = useState('Menu');
  const [tableData, setTableData] = useState([]);
  const [attributeData, setAttributeData] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ startDate: '', endDate: '' });
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState(null);

  const startDateRef = useRef(null);
  const endDateRef = useRef(null);
  
  const [role, setRole] = useState(0);

  //data for testing purposes
  //TODO: REMOVE THESE
  const categories = ["Menu", 'Orders', "Inventory", "Products", "Customers", "Product Usage", "Sales Report", "Restock Inventory", "Restock Product", "Excess Report", "Trend Report"];

  const handleCloseModal = () => setShowForm(false);

  const handleShowForm = () => setShowForm(true);

  //menu add, update, delete attributes
  const menuAttributes1 = ["Add", "Name", "Ingredients", "Allergens", "Nutritional Content", "Price", "Category", "Amount", "Start Date", "End Date"];
  const menuAttributes2 = ["Update", "ID", "Name", "Ingredients", "Allergens", "Nutritional Content", "Price", "Category", "Amount", "Start Date", "End Date"];
  const menuAttributes3 = ["Delete", "ID"];

  const menuDatabaseAttributes = ["name", "ingredients", "allergens", "nutritional_content", "price", "category", "amount", "from_date", "to_date"];
  const menuDatabaseAttributesID = ["id", "name", "ingredients", "allergens", "nutritional_content", "price", "category", "amount", "from_date", "to_date"];

  //order add, update, delete attributes
  const orderAttributes1 = ["Add", "Customer ID", "Order Content", "Price", "Order Date", "Order Status"];
  const orderAttributes2 = ["Update", "Order ID", "Customer ID", "Order Content", "Price", "Order Date", "Order Status"];
  const orderAttributes3 = ["Delete", "Order ID"];

  const orderDataBaseAttributes = ["customer_id", "order_content", "price", "order_placed_on", "status"];
  const orderDataBaseAttributesID = ["id", "customer_id", "order_content", "price", "order_placed_on", "status"];

  //inventory add, update, delete attributes
  const inventoryAttributes1 = ["Add", "Name", "Date Received", "Expiration Date", "Quantity (lbs)", "Minimum Quantity"];
  const inventoryAttributes2 = ["Update", "ID", "Name", "Date Received", "Expiration Date", "Quantity (lbs)", "Minimum Quantity"];
  const inventoryAttributes3 = ["Delete", "ID"];

  const inventoryDataBaseAttributes = ["name", "received_date", "expiration_date", "quantity", "minimum_quant"];
  const inventoryDataBaseAttributesID = ["id", "name", "received_date", "expiration_date", "quantity", "minimum_quant"];

  //product add, update, delete attributes
  const productAttributes1 = ["Add", "Amount", "In Oven?", "Oven Start Time", "Oven End Time", "Menu ID"];
  const productAttributes2 = ["Update", "Product ID", "Amount", "In Oven?", "Oven Start Time", "Oven End Time", "Menu ID"];
  const productAttributes3 = ["Delete", "Product ID"];

  const productDataBaseAttributes = ["amount", "in_oven", "oven_start_time", "end_time", "menu_id"];
  const productDataBaseAttributesID = ["id", "amount", "in_oven", "oven_start_time", "end_time", "menu_id"];

  //customer add, update, delete attributes
  const customerAttributes1 = ["Add", "Phone Number", "Points", "Email", "Name"];
  const customerAttributes2 = ["Update", "Phone Number", "Points", "Email", "Name"];
  const customerAttributes3 = ["Delete", "Phone Number"];

  const customerDataBaseAttributes = ["customer_id", "points", "email", "name"];

  useEffect(() => {
    if (category === 'Orders') {
      axios.get('/orders?table=orders')
        .then((response) => {
          setTableData(response.data);
        })
        .catch((error) => {
          console.error("Error fetching data: ", error);
          setError(error);
        })

        axios.get('/attributes?table=orders')
        .then((response) => {
          setAttributeData(response.data);
        })
        .catch((error) => {
          console.error("Error fetching data: ", error);
          setError(error);
        });
    }
    else if (category === 'Inventory') {
      axios.get('/inventory?table=inventory')
        .then((response) => {
          setTableData(response.data);
        })
        .catch((error) => {
          console.error("Error fetching data: ", error);
          setError(error);
        });

        axios.get('/attributes?table=inventory')
        .then((response) => {
          setAttributeData(response.data);
        })
        .catch((error) => {
          console.error("Error fetching data: ", error);
          setError(error);
        });
    }
    else if (category === 'Products') {
      axios.get('/products?table=products')
        .then((response) => {
          setTableData(response.data);
        })
        .catch((error) => {
          console.error("Error fetching data: ", error);
          setError(error);
        });
        axios.get('/attributes?table=products')
        .then((response) => {
          setAttributeData(response.data);
        })
        .catch((error) => {
          console.error("Error fetching data: ", error);
          setError(error);
        });
    }
    else if (category === 'Menu') {
      axios.get('/menu?table=menu')
        .then((response) => {
          setTableData(response.data);
        })
        .catch((error) => {
          console.error("Error fetching data: ", error);
          setError(error);
        });

      axios.get('/attributes?table=menu')
      .then((response) => {
        setAttributeData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
        setError(error);
      });

    }
    else if (category === 'Customers') {
      axios.get('/customers?table=rewards')
        .then((response) => {
          setTableData(response.data);
        })
        .catch((error) => {
          console.error("Error fetching data: ", error);
          setError(error);
        });
    }
    else if (category === 'Restock Inventory') {
      axios.get('/restockInventory?table=inventory')
        .then((response) => {
          setTableData(response.data);
        })
        .catch((error) => {
          console.error("Error fetching data: ", error);
          setError(error);
        });
    }
    else if (category === 'Restock Product') {
      axios.get('/restockProducts?table=menu')
        .then((response) => {
          setTableData(response.data);
        })
        .catch((error) => {
          console.error("Error fetching data: ", error);
          setError(error);
        });
    }
    else if (category === 'Product Usage') {

      setShowForm(false);
      setTableData(null);
    }
    else if (category === 'Sales Report') {

      setShowForm(false);
      setTableData(null);
    }
    else if (category === 'Excess Report') {

      setShowForm(false);
      setTableData(null);
    }
    else if (category === 'Trend Report') {

      setShowForm(false);
      setTableData(null);
    }
  }, [category]);

  function handleSubmit(event) {
    event.preventDefault();
    console.log('Start Date: ', startDate);
    console.log('End Date: ', endDate);
  }
  const fetchProdUsageData = async (e) => {
    e.preventDefault();
    const startDate = startDateRef.current.value;
    const endDate = endDateRef.current.value;

    console.log('Start Date: ', startDate);
    console.log('End Date: ', endDate);

    axios.get(`/productUsage?table=orders&startDate=${startDate}&endDate=${endDate}`)
      .then((response) => {
        setTableData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
        setError(error);
      });

    handleCloseModal();
  }

  const fetchSalesReportData = async (e) => {
    e.preventDefault();
    const startDate = startDateRef.current.value;
    const endDate = endDateRef.current.value;

    console.log('Start Date: ', startDate);
    console.log('End Date: ', endDate);

    axios.get(`/salesReport?table=orders&startDate=${startDate}&endDate=${endDate}`)
      .then((response) => {
        setTableData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
        setError(error);
      });

    handleCloseModal();
  }

  const fetchTrendReport = async (e) => {
    e.preventDefault();
    const startDate = startDateRef.current.value;
    const endDate = endDateRef.current.value;

    console.log('Start Date: ', startDate);
    console.log('End Date: ', endDate);

    axios.get(`/trendReport?table=orders&startDate=${startDate}&endDate=${endDate}`)
      .then((response) => {
        setTableData(response.data);
      })
      .catch(error => {
        console.error("Error fetching data: ", error);
        setError(error);
      });

    handleCloseModal();
  }

  const fetchExcessReport = async (e) => {
    e.preventDefault();
    const startDate = startDateRef.current.value;
    const endDate = endDateRef.current.value;

    console.log('Start Date: ', startDate);
    console.log('End Date: ', endDate);

    axios.get(`/excessReport?table=orders&startDate=${startDate}&endDate=${endDate}`)
      .then((response) => {
        setTableData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
        setError(error);
      });

    handleCloseModal();
  }

  const showFormFields = () => {
    setShowForm(true);
  }


  function DisplayContent() {
    switch (category) {
      case 'Orders':
        if (tableData) {
          return (
            <React.Fragment>

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

          );
        }
        break;

      case 'Inventory':
        if (tableData) {
          return (
            <React.Fragment>

              <TableRow>
                <Form formData={inventoryAttributes1} databaseAttributes={inventoryDataBaseAttributes} tableName={"inventory"}></Form>
                <Form formData={inventoryAttributes2} databaseAttributes={inventoryDataBaseAttributesID} tableName={"inventory"}></Form>
                <Form formData={inventoryAttributes3} databaseAttributes={["id"]} tableName={"inventory"}></Form>
              </TableRow>
              <div className='managerBox'>

                <UltimateTable
                  tableType="inventory"
                  data={tableData}
                />

              </div>

            </React.Fragment>

          );
        }
        break;
      case 'Products':
        if (tableData) {
          return (
            <React.Fragment>

              <TableRow>
                <Form formData={productAttributes1} databaseAttributes={productDataBaseAttributes} tableName={"products"}></Form>
                <Form formData={productAttributes2} databaseAttributes={productDataBaseAttributesID} tableName={"products"}></Form>
                <Form formData={productAttributes3} databaseAttributes={["id"]} tableName={"products"}></Form>
              </TableRow>
              <div className='managerBox'>

                <UltimateTable
                  tableType="products"
                  data={tableData}
                />

              </div>

            </React.Fragment>


          );
        }
        break;
      case 'Menu':
        if (tableData) {
          return (
            <React.Fragment>

              <TableRow>
                <Form formData={menuAttributes1} databaseAttributes={menuDatabaseAttributes} tableName={"menu"}></Form>
                <Form formData={menuAttributes2} databaseAttributes={menuDatabaseAttributesID} tableName={"menu"}></Form>
                <Form formData={menuAttributes3} databaseAttributes={["id"]} tableName={"menu"}></Form>
              </TableRow>
              <div className='managerBox'>

                <UltimateTable
                  tableType="menu"
                  data={tableData}
                />

              </div>

            </React.Fragment>

          );
        }
        break;
      case 'Customers':
        if (tableData) {
          return (
            <React.Fragment>

              <TableRow>
                <Form formData={customerAttributes1} databaseAttributes={customerDataBaseAttributes} tableName={"rewards"}></Form>
                <Form formData={customerAttributes2} databaseAttributes={customerDataBaseAttributes} tableName={"rewards"}></Form>
                <Form formData={customerAttributes3} databaseAttributes={["customer_id"]} tableName={"rewards"}></Form>
              </TableRow>
              <div className='managerBox'>

                <UltimateTable
                  tableType="Customers"
                  data={tableData}
                />

              </div>

            </React.Fragment>

          );
        }
        break;
      case 'Product Usage':
        if (!tableData) {
          return (
            <>
              <DateRangeModal
                handleClose={handleCloseModal}
                handleSubmit={fetchProdUsageData}
                startDateRef={startDateRef}
                endDateRef={endDateRef}
                showForm={showForm}
              />

              <button onClick={handleShowForm} className='dateRangeButton'>Enter Date Range</button>
              <Modal show={showForm} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                  <Modal.Title>Enter Date Range</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  
                  <div className='datemodal'>

                    <label>Start Date:</label>

                    <input
                      ref={startDateRef}
                      type="date"
                    />

                    <p></p>

                    <label>End Date:</label>
                    <input
                      ref={endDateRef}
                      type="date"
                    />

                  </div>

                  
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={handleCloseModal}>
                    Close
                  </Button>
                  <Button variant="primary" onClick={fetchProdUsageData}>
                    Submit
                  </Button>
                </Modal.Footer>
              </Modal>
            </>
          );
        }
        else {
          return (
            <>
              <DateRangeModal
                handleClose={handleCloseModal}
                handleSubmit={fetchProdUsageData}
                startDateRef={startDateRef}
                endDateRef={endDateRef}
                showForm={showForm}
              />

              <Modal show={showForm} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                  <Modal.Title>Enter Date Range</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <div className='datemodal'>

                    <label>Start Date:</label>

                    <input
                      ref={startDateRef}
                      type="date"
                    />

                    <p></p>

                    <label>End Date:</label>
                    <input
                      ref={endDateRef}
                      type="date"
                    />

                  </div>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={handleCloseModal}>
                    Close
                  </Button>
                  <Button variant="primary" onClick={fetchProdUsageData}>
                    Submit
                  </Button>
                </Modal.Footer>
              </Modal>

              <button onClick={handleShowForm} className='dateRangeButton'>Enter New Date Range</button>
              <div className='managerBox'>

                <UltimateTable
                  tableType='prodUsage'
                  data={tableData}
                />

              </div>
            </>
          );
        }

      case 'Sales Report':

        if (!tableData) {
          return (
            <>
              <DateRangeModal
                handleClose={handleCloseModal}
                handleSubmit={fetchSalesReportData}
                startDateRef={startDateRef}
                endDateRef={endDateRef}
                showForm={showForm}
              />

              <button onClick={handleShowForm} className='dateRangeButton'>Enter Date Range</button>
              <Modal show={showForm} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                  <Modal.Title>Enter Date Range</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <div className='datemodal'>

                    <label>Start Date:</label>

                    <input
                      ref={startDateRef}
                      type="date"
                    />

                    <p></p>

                    <label>End Date:</label>
                    <input
                      ref={endDateRef}
                      type="date"
                    />

                  </div>
                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseModal}>
                    Close
                  </Button>
                  <Button variant="primary" onClick={fetchSalesReportData}>
                    Submit
                  </Button>
                </Modal.Footer>
              </Modal>
            </>
          );
        }
        else {
          return (
            <>
              <DateRangeModal
                handleClose={handleCloseModal}
                handleSubmit={fetchSalesReportData}
                startDateRef={startDateRef}
                endDateRef={endDateRef}
                showForm={showForm}
              />

              <Modal show={showForm} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                  <Modal.Title>Enter Date Range</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <div className='datemodal'>

                    <label>Start Date:</label>

                    <input
                      ref={startDateRef}
                      type="date"
                    />

                    <p></p>

                    <label>End Date:</label>
                    <input
                      ref={endDateRef}
                      type="date"
                    />

                  </div>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={handleCloseModal}>
                    Close
                  </Button>
                  <Button variant="primary" onClick={fetchSalesReportData}>
                    Submit
                  </Button>
                </Modal.Footer>
              </Modal>

              <button onClick={handleShowForm} className='dateRangeButton'>Enter New Date Range</button>
              <div className='managerBox'>

                <UltimateTable
                  tableType='sales'
                  data={tableData}
                />

              </div>
            </>
          );
        }

      case 'Excess Report':
        if (!tableData) {
          return (
            <>
              <DateRangeModal
                handleClose={handleCloseModal}
                handleSubmit={fetchExcessReport}
                startDateRef={startDateRef}
                endDateRef={endDateRef}
                showForm={showForm}
              />

              <button onClick={handleShowForm} className='dateRangeButton'>Enter Date Range</button>
              <Modal show={showForm} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                  <Modal.Title>Enter Date Range</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <div className='datemodal'>

                    <label>Start Date:</label>

                    <input
                      ref={startDateRef}
                      type="date"
                    />

                    <p></p>

                    <label>End Date:</label>
                    <input
                      ref={endDateRef}
                      type="date"
                    />

                  </div>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={handleCloseModal}>
                    Close
                  </Button>
                  <Button variant="primary" onClick={fetchExcessReport}>
                    Submit
                  </Button>
                </Modal.Footer>
              </Modal>
            </>
          );
        }
        else {
          return (
            <>
              <DateRangeModal
                handleClose={handleCloseModal}
                handleSubmit={fetchExcessReport}
                startDateRef={startDateRef}
                endDateRef={endDateRef}
                showForm={showForm}
              />

              <Modal show={showForm} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                  <Modal.Title>Enter Date Range</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <div className='datemodal'>

                    <label>Start Date:</label>

                    <input
                      ref={startDateRef}
                      type="date"
                    />

                    <p></p>

                    <label>End Date:</label>
                    <input
                      ref={endDateRef}
                      type="date"
                    />

                  </div>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={handleCloseModal}>
                    Close
                  </Button>
                  <Button variant="primary" onClick={fetchExcessReport}>
                    Submit
                  </Button>
                </Modal.Footer>
              </Modal>

              <button onClick={handleShowForm} className='dateRangeButton'>Enter New Date Range</button>
              <div className='managerBox'>

                <UltimateTable
                  tableType='excess'
                  data={tableData}
                />

              </div>
            </>
          );
        }

      case 'Restock Inventory':
        if (tableData) {
          return (
            <div className='managerBox'>

              <UltimateTable
                tableType="restock"
                data={tableData}
              />

            </div>

          );
        }
        break;

      case 'Restock Product':
        if (tableData) {
          return (
            <div className='managerBox'>

              <UltimateTable
                tableType="restockProd"
                data={tableData}
              />
            </div>
          );
        }
        break;

      case 'Restock Product Report':
        return (
          <p>
            Restock Product Report
          </p>
        );
        break;

      case 'Trend Report':
        if (!tableData) {
          return (
            <>
              <DateRangeModal
                handleClose={handleCloseModal}
                handleSubmit={fetchTrendReport}
                startDateRef={startDateRef}
                endDateRef={endDateRef}
                showForm={showForm}
              />

              <button onClick={handleShowForm} className='dateRangeButton'>Enter Date Range</button>
              <Modal show={showForm} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                  <Modal.Title>Enter Date Range</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <div className='datemodal'>

                    <label>Start Date:</label>

                    <input
                      ref={startDateRef}
                      type="date"
                    />

                    <p></p>

                    <label>End Date:</label>
                    <input
                      ref={endDateRef}
                      type="date"
                    />

                  </div>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={handleCloseModal}>
                    Close
                  </Button>
                  <Button variant="primary" onClick={fetchTrendReport}>
                    Submit
                  </Button>
                </Modal.Footer>
              </Modal>
            </>
          );
        }
        else {
          return (
            <>
              <DateRangeModal
                handleClose={handleCloseModal}
                handleSubmit={fetchTrendReport}
                startDateRef={startDateRef}
                endDateRef={endDateRef}
                showForm={showForm}
              />

              <Modal show={showForm} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                  <Modal.Title>Enter Date Range</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <div className='datemodal'>

                    <label>Start Date:</label>

                    <input
                      ref={startDateRef}
                      type="date"
                    />

                    <p></p>

                    <label>End Date:</label>
                    <input
                      ref={endDateRef}
                      type="date"
                    />

                  </div>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={handleCloseModal}>
                    Close
                  </Button>
                  <Button variant="primary" onClick={fetchTrendReport}>
                    Submit
                  </Button>

                </Modal.Footer>
              </Modal>

              <button onClick={handleShowForm} className='dateRangeButton'>Enter New Date Range</button>
              <div className='managerBox'>

                <UltimateTable
                  tableType='trendReport'
                  data={tableData}
                />

              </div>
            </>
          );
        }
    }

  }

  const formAttributes1 = ["Add", "Name", "Category", "Price"];
  const formAttributes2 = ["Update", "Name", "Ingredients", "Price"];
  const formAttributes3 = ["Delete", "ID", "Name"]
  const formAttributes4 = ["Seasonal Menu Item", "Name", "Price"];
  const formAttributes5 = ["Enter Date Range", "Start Date", "End Date"];

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

  if (role === -1 || !(role & 2)) {
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
    <div className="App">
      <div className="App-header">

        <SideMenu categories={categories} categorySwap={setCategory}></SideMenu>

        
        <div className='contentarea'>
          <h3>Manager: <span style={{ color: '#1d1d1e' }}>{category}</span> </h3>
          <DisplayContent></DisplayContent>
        </div>
      </div>
    </div>
  );
}

export default Manager;
