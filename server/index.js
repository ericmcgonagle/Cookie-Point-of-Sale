import express from 'express';
import cors from 'cors';
import axios from 'axios';

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: [
      'http://localhost:3000',
      'https://bytebenders.tech',
      'https://project-3-906-04-*-andres-l-santiagos-projects.vercel.app',
      'https://www.bytebenders.tech',
    ],
  })
);
const port = 3001;

import { DatabaseAdapter } from './adapters/database.js';
const DBAdapter = new DatabaseAdapter();

// Adds entry to given table
/**
 * Function that adds entry to given table.
 * This api call is used to add entries to the database and takes 
 * in a series of input such as table name and array of attributes.
 * 
 * @route POST /entry
 * @param {string} req.body.table - Table name
 * @param {array} req.body.attributes - Array of attributes for new entry
 * @param {array} req.body.values - Array of values for new entry
 * @returns {string} 201 - Entry created
 * @returns {string} 500 - Error
 */
app.post('/entry', async (req, res) => {
  if (!req.body.table) {
    res.status(500).send('Table not defined');
    return;
  }

  if (!req.body.attributes) {
    res.status(500).send('Attributes not defined');
    return;
  }

  if (!req.body.values) {
    res.status(500).send('Values not defined');
    return;
  }

  if (req.body.attributes.length !== req.body.values.length) {
    res.status(500).send('Attributes and values do not match in length');
    return;
  }

  let query = 'insert into ' + req.body.table + ' (';

  req.body.attributes.forEach((attribute, index) => {
    if (attribute !== 'id' && req.body.values[index] !== '') {
      query += attribute;
      if (index < req.body.attributes.length - 1) {
        query += ', ';
      }
    }
  });

  if (req.body.values[req.body.values.length - 1] == '') {
    query = query.slice(0, -2);
  }

  query += ") values ('";

  req.body.values.forEach((value, index) => {
    if (req.body.attributes[index] !== 'id' && value !== '') {
      query += value;
      if (index < req.body.values.length - 1) {
        query += "', '";
      }
    }
  });

  if (req.body.values[req.body.values.length - 1] == '') {
    query = query.slice(0, -4);
  }

  query += "');";

  try {
    await DBAdapter.query(query);
    res.status(201).send('Entry created');
  } catch (e) {
    res.status(500).send(JSON.stringify(e));
  }
});

// Update entry from given table with given id and given values
/**
 * This api call is used to update entries in the database and takes in 
 * a series of input such as table name, id, array of attributes, and array of values.
 * 
 * @param {object} req.body - Request body containing all the information
 * @param {string} req.body.table - Table name for which will be updated
 * @param {string} req.body.id - ID of entry to be updated
 * @param {array} req.body.attributes - Array of attributes to be updated
 * @param {array} req.body.values - Array of values to be updated
 * @returns {string} 201 - Entry updated
 * @throws {string} 500 - Error
 */
app.patch('/entry', async (req, res) => {
  if (!req.body.table) {
    res.status(500).send('Table not defined');
    return;
  }

  if (!req.body.id) {
    res.status(500).send('ID not defined');
  }

  if (!req.body.attributes) {
    res.status(500).send('Attributes not defined');
    return;
  }

  if (!req.body.values) {
    res.status(500).send('Values not defined');
    return;
  }

  if (req.body.attributes.length !== req.body.values.length) {
    res.status(500).send('Attributes and values do not match in length');
    return;
  }

  let query = 'update ' + req.body.table + ' set ';

  req.body.attributes.forEach((attribute, index) => {
    if (attribute !== 'id') {
      query += attribute + " = '" + req.body.values[index] + "'";
      if (index < req.body.attributes.length - 1) {
        query += ', ';
      }
    }
  });

  query += " where id = '" + req.body.id + "';";


  try {
    await DBAdapter.query(query);
    res.status(201).send('Entry updated');
  } catch (e) {
    res.status(500).send(JSON.stringify(e));
  }
});

// Update entry from given table with given id and given values
/**
 * This api call is used to update entries in the database and takes in
 * a series of input such as table name, id, array of attributes, and array of values. 
 * In addition to this the column names for which need to be updated are also passed in
 * and added to a string that is eventually run as a sql statement to update the table.
 * 
 * @param {object} req.body - Request body containing all the information
 * @param {string} req.body.table - Table name for which will be updated
 * @param {string} req.body.colname - Column name of entry to be updated
 * @param {string} req.body.id - ID of entry to be updated
 * @param {array} req.body.attributes - Array of attributes to be updated
 * @param {array} req.body.values - Array of values to be updated
 * @returns {string} 201 - Entry updated
 * @throws {string} 500 - Error
 */
app.patch('/entrycolname', async (req, res) => {

  if (!req.body.table) {
    res.status(500).send('Table not defined');
    return;
  }

  if (!req.body.colname) {
    res.status(500).send('ID column name not defined');
    return;
  }

  if (!req.body.id) {
    res.status(500).send('ID not defined');
    return;
  }

  if (!req.body.attributes) {
    res.status(500).send('Attributes not defined');
    return;
  }

  if (!req.body.values) {
    res.status(500).send('Values not defined');
    return;
  }

  if (req.body.attributes.length !== req.body.values.length) {
    res.status(500).send('Attributes and values do not match in length');
    return;
  }


  let query = 'update ' + req.body.table + ' set ';

  req.body.attributes.forEach((attribute, index) => {
    if (attribute !== req.body.colname && req.body.values[index] !== '') {
      query += attribute + " = '" + req.body.values[index] + "'";
      if (index < req.body.attributes.length - 1) {
        query += ', ';
      }
    }
  });

  if (req.body.values[req.body.values.length - 1] == '') {
    query = query.slice(0, -2);
  }


  query += " where " + req.body.colname + " = '" + req.body.id + "';";

  try {
    await DBAdapter.query(query);
    res.status(201).send('Entry updated');
  } catch (e) {
    res.status(500).send(JSON.stringify(e));
  }
});

// Deletes entry from given table with given id
/**
 * This api call is used to delete entries in the database.
 * The table name is passed in as well as the id of the entry to be deleted.
 * Error is thrown if either table or id is not passed in.
 * 
 * @param {object} req.query - Request query containing all the information
 * @param {string} req.query.table - Table name for which will be deleted
 * @param {string} req.query.id - ID of entry to be deleted
 * @returns {string} 200 - Entry deleted
 * @throws {string} 500 - Error
 * @throws {string} 500 - Table not defined
 * @throws {string} 500 - ID not defined
 */
app.delete('/entry', async (req, res) => {
  if (!req.query.table) {
    res.status(500).send('Table not defined');
    return;
  }

  if (!req.query.id) {
    res.status(500).send('ID not defined');
    return;
  }

  const query =
    'delete from ' + req.query.table + ' where id = ' + req.query.id + ';';


  try {
    await DBAdapter.query(query);
    res.status(200).send('Entry deleted');
  } catch (e) {
    res.status(500).send(JSON.stringify(e));
  }
});

// Deletes entry from given table with given id
/**
 * This api call is used to delete entries in the database.
 * The table name is passed in as well as the id of the entry to be deleted.
 * Error is thrown if either table or id is not passed in.
 * 
 * @param {object} req.query - Request query containing all the information
 * @param {string} req.query.table - Table name for which will be deleted
 * @param {string} req.query.colname - Column name of entry to be deleted
 * @param {string} req.query.id - ID of entry to be deleted
 * @returns {string} 200 - Entry deleted
 * @throws {string} 500 - Error
 * @throws {string} 500 - Table not defined
 * @throws {string} 500 - Column name not defined
 * @throws {string} 500 - ID not defined
 */
app.delete('/entrycolname', async (req, res) => {
  if (!req.query.table) {
    res.status(500).send('Table not defined');
    return;
  }

  if (!req.query.colname) {
    res.status(500).send('Column name not specified');
    return;
  }

  if (!req.query.id) {
    res.status(500).send('ID not defined');
    return;
  }

  const query = "delete from " + req.query.table + " where " + req.query.colname + " = '" + req.query.id + "';";


  try {
    await DBAdapter.query(query);
    res.status(200).send('Entry deleted');
  } catch (e) {
    res.status(500).send(JSON.stringify(e));
  }
});

/**
 * This api call is used to retrieve the attributes of a given table.
 * This api helps get the column names of a specified table.
 * 
 * @param {object} req.query - Request query containing all the information
 * @param {string} req.query.table - Table name for which will be deleted
 * @throws {string} 500 - Error
 * @throws {string} 500 - Table not defined
 * @throws {string} 500 - Column name not defined
 * @throws {string} 500 - ID not defined
 * @returns {array} 200 - Array of attributes
 */
app.get('/attributes', async (req, res) => {
  if (!req.query.table) {
    res.status(500).send('Table not defined');
    return;
  }

  try {
    const result = await DBAdapter.query(
      'select * from ' + req.query.table + ' limit 1;'
    );

    let attributes = [];

    result.fields.forEach((field) => {
      attributes.push(field.name);
    });

    res.status(200).send(attributes);
  } catch (e) {
    res.status(500).send(JSON.stringify(e));
  }
});

/** 
 * This api call retrieves orders from the database.
 * This api call then uses the current date to be added
 * to a string that is later used in a sql statement thus 
 * retrieving all orders from the current date.
 * 
 * @group Orders - Operations about orders
 * @param {object} req.query - Request query containing all the information
 * @param {string} req.query.table - Table name for which will be deleted
 * @param {string} 500 - Error
 * @param {string} 500 - Table not defined
 * @param {string} 200 - Array of orders on current date
 */
app.get('/orders', async (req, res) => {
  if (!req.query.table) {
    res.status(500).send('Table not defined');
    return;
  }

  try {
    const formatData = (input) => {
      if (input > 9) {
        return input;
      } else return `0${input}`;
    };

    const date = new Date();
    const format = {
      dd: formatData(date.getDate()),
      mm: formatData(date.getMonth() + 1),
      yyyy: formatData(date.getFullYear()),
    };

    const formatFullStart = ({ dd, mm, yyyy }) => {
      return `${yyyy}/${mm}/${dd} 00:00:00`;
    };

    const formatFullEnd = ({ dd, mm, yyyy }) => {
      return `${yyyy}/${mm}/${dd} 23:59:59`;
    };

    // query currently is set to hard coded date, once functionality for ordering is put into place, then the commented code will display the orders on a given day
    // will also add functionality to specify a specific date after ordering is implemented as well as viewing all orders from current date
    const result = await DBAdapter.query(
      //"SELECT order_content, price FROM orders WHERE order_placed_on BETWEEN  $1 AND $2",
      "SELECT id, order_content, price, TO_CHAR(order_placed_on::date, 'YYYY-MM-DD') AS order_placed_on, status FROM orders WHERE order_placed_on BETWEEN  $1 AND $2",
      [
        formatFullStart(format),
        formatFullEnd(format)
      ]
    );

    res.status(200).send(result.rows);
  } catch (e) {
    res.status(500).send(JSON.stringify(e));
  }
});

/**
 * This api call retrieves orders from the database.
 * Using the email and table name passed in, the api call retrieves
 * an order placed by a user with the matching email.
 * 
 * @route GET/userOrders
 * @param {object} req.query - Request query containing all the information
 * @param {string} req.query.table - Table name for which will be deleted
 * @param {string} req.query.email - Email of user to retrieve orders from
 * @throws {string} 500 - Error
 * @throws {string} 500 - Table not defined
 * @throws {string} 500 - Email not defined
 * @throws {string} 500 - User not found
 * @returns {array} 200 - Array of orders from user
 */
app.get('/userOrders', async (req, res) => {
  if (!req.query.table) {
    res.status(500).send('Table not defined');
    return;
  }

  if (!req.query.email) {
    res.status(500).send('Email not defined');
    return;
  }

  try {
    // query currently is set to hard coded date, once functionality for ordering is put into place, then the commented code will display the orders on a given day
    // will also add functionality to specify a specific date after ordering is implemented as well as viewing all orders from current date
    const idResult = await DBAdapter.query("select customer_id from rewards where email ilike '" + req.query.email + "';");

    if (idResult.rowCount == 0) {
      res.status(500).send("User not found");
      return;
    }

    const result = await DBAdapter.query(
      "SELECT id, order_content, price, TO_CHAR(order_placed_on::date, 'YYYY-MM-DD') AS order_placed_on, status FROM orders WHERE customer_id = '" + idResult.rows[0].customer_id + "';");

    res.status(200).send(result.rows);
  } catch (e) {
    res.status(500).send(JSON.stringify(e));
  }
});

/**
 * This api call retrieves details from the inventory table.
 * The api call retrieves the id, name, expiration date, quantity, and minimum quantity
 * from the inventory table and returns it as an array.
 * 
 * @route GET /inventory
 * @param {object} req.query - Request query containing all the information
 * @param {string} req.query.table - Table name for which will be deleted
 * @throws {string} 500 - Error
 * @throws {string} 500 - Table not defined
 * @returns {array} 200 - Array of inventory details
 */
app.get('/inventory', async (req, res) => {
  if (!req.query.table) {
    res.status(500).send('Table not defined');
    return;
  }

  try {
    const result = await DBAdapter.query(
      "SELECT id, name, TO_CHAR(expiration_date::date, 'YYYY-MM-DD') AS exp_date, quantity, minimum_quant FROM inventory"
    );

    // console.log(result.rows);
    res.status(200).send(result.rows);
  } catch (e) {
    res.status(500).send(JSON.stringify(e));
  }
});

/**
 * This api call retrieves details from the products table.
 * From the products table, the api call retrieves information from
 * the product tables as well as the menu id from the menu table.
 * 
 * @route GET /products
 * @param {object} req.query - Request query containing all the information
 * @param {string} req.query.table - Table name for which will be deleted
 * @throws {string} 500 - Error
 * @throws {string} 500 - Table not defined
 * @returns {array} 200 - Array of product details
 */
app.get('/products', async (req, res) => {
  if (!req.query.table) {
    res.status(500).send('Table not defined');
  }

  try {
    const result = await DBAdapter.query(
      "SELECT r.id, m.name AS menu_name, r.amount, TO_CHAR(r.oven_start_time, 'HH:MI:SS') AS start_time, TO_CHAR(r.end_time, 'HH:MI:SS') AS end_time FROM products r JOIN menu m ON r.menu_id = m.id"
    );

    res.status(200).send(result.rows);
  } catch (e) {
    res.status(500).send(JSON.stringify(e));
  }
});

app.get('/menu', async (req, res) => {
  if (!req.query.table) {
    res.status(500).send('Table not defined');
  }

  try {
    const result = await DBAdapter.query(
      "SELECT id, name, ingredients, allergens, nutritional_content, price, from_date, to_date, category FROM menu"
    );

    res.status(200).send(result.rows);
  } catch (e) {
    res.status(500).send(JSON.stringify(e));
  }
});

app.get('/customers', async (req, res) => {
  if (!req.query.table) {
    res.status(500).send('Table not defined');
  }
  try {
    const result = await DBAdapter.query(
      "SELECT CONCAT(SUBSTRING(customer_id, 1, 3), '-', SUBSTRING(customer_id, 4, 3), '-', SUBSTRING(customer_id, 7, 4)) AS formatted_phone, name, email, points FROM REWARDS WHERE email IS NOT NULL ORDER BY points DESC"
    );

    res.status(200).send(result.rows);
  } catch (e) {
    res.status(500).send(JSON.stringify(e));
  }
});

app.get('/restockInventory', async (req, res) => {
  try {
    const result = await DBAdapter.query(
      'SELECT name, quantity, minimum_quant FROM inventory WHERE quantity <= minimum_quant'
    );

    res.status(200).send(result.rows);
  } catch (e) {
    res.status(500).send(JSON.stringify(e));
  }
});

app.get('/restockProducts', async (req, res) => {
  try {
    const result = await DBAdapter.query(
      "SELECT name, amount FROM menu WHERE amount <= 24"
    )

    res.status(200).send(result.rows);
  } catch (e) {
    res.status(500).send(JSON.stringify(e));
  }
});

app.get('/productUsage', async (req, res) => {
  const startDate = req.query.startDate;
  const endDate = req.query.endDate;

  try {
    const result = await DBAdapter.query(
      `SELECT order_content FROM orders WHERE order_placed_on > $1 AND order_placed_on < $2`,
      [startDate, endDate]
    );

    const productContents = {};
    const resultList = [];

    result.rows.forEach((row) => {
      const orderContents = row.order_content.split(',').map((item) => item.trim());

      orderContents.forEach((item) => {
        const parts = item.split(' ');
        const count = parseInt(parts[0]);
        const product = parts.slice(1).join(' ');

        if (productContents.hasOwnProperty(product)) {
          productContents[product] += count;
        } else {
          productContents[product] = count;
        }
      });
    });

    for (const menuItem of Object.keys(productContents)) {
      if (productContents.hasOwnProperty(menuItem)) {
        resultList.push({
          name: menuItem,
          amount_sold: productContents[menuItem],
        });
      }
    }

    res.status(200).send(resultList);
  } catch (e) {
    res.status(500).send(JSON.stringify(e));
  }
});

app.get('/salesReport', async (req, res) => {

  const startDate = req.query.startDate;
  const endDate = req.query.endDate;
  try {
    // find order content from specified date
    const result = await DBAdapter.query(
      `SELECT order_content FROM orders WHERE order_placed_on > $1 AND order_placed_on < $2`,
      [startDate, endDate]
    );

    // store the product counts
    const productOrdered = {};

    // split the order contents to retreive what menu items were ordered by a given customer in a given order
    // and store into productOrdered to view what was ordered and by what amount on that day
    result.rows.forEach((row) => {
      const orderContents = row.order_content
        .split(',')
        .map((item) => item.trim());

      orderContents.forEach((item) => {
        const parts = item.split(' ');
        const count = parseInt(parts[0]);
        const product = parts.slice(1).join(' ');

        if (productOrdered.hasOwnProperty(product)) {
          productOrdered[product] += count;
        } else {
          productOrdered[product] = count;
        }
      });
    });

    // store menu item name and the total sale value computed by quantity sold and price on menu
    const saleAmount = [];

    // iterate through productOrdered array and retrieve the price from the menu table to multiply by
    // quantity retrieved from the above query
    for (const menuItem of Object.keys(productOrdered)) {
      if (productOrdered.hasOwnProperty(menuItem)) {
        const priceResult = await DBAdapter.query(
          "SELECT price FROM menu WHERE name = '" + menuItem.substring(0) + "'"
        );
        if (priceResult.rows.length > 0) {
          const price = parseFloat(priceResult.rows[0].price);
          const quantity = productOrdered[menuItem];
          const totalSale = (quantity * price).toFixed(2);
          // saleAmount[menuItem] = totalSale;

          saleAmount.push({
            name: menuItem,
            total_amount: totalSale,
          });
        }
      } else {
        console.log('Item ' + menuItem + ' not found in the menu');
      }
    }

    res.status(200).send(saleAmount);
  } catch (e) {
    res.status(500).send(JSON.stringify(e));
  }
});

app.get('/excessReport', async (req, res) => {

  const startDate = req.query.startDate;
  // const endDate = req.query.endDate;

  try {
    // retrieve current stock list for items
    const result = await DBAdapter.query(
      "SELECT name, amount FROM menu WHERE amount is not null"
    );

    // two maps one to store amount of stock that item had at time of specified timestamp
    // other to hold how many have hold since that chnage of time

    const stockAmount = {};
    const saleAmount = {};

    // fill stock stockAmount with current stock values
    result.rows.forEach((row) => {
      const itemName = row.name;
      const stockValue = parseInt(row.amount);

      stockAmount[itemName] = stockValue;
      saleAmount[itemName] = 0;
    });

    // retrieve list of all orders since the given date
    const ordersList = await DBAdapter.query(
      `SELECT order_content FROM orders WHERE order_placed_on > $1`, [startDate]
    );

    const orderContents = [];

    // make array containing each item being ordered
    // parse each part of the string separate out by commas
    const excessReport = [];

    ordersList.rows.forEach((row) => {
      orderContents[row] = row.order_content.split(',').map((item) => item.trim());

      // parse through details of each item in orderContents
      // number before the first space in string will be count that was purchased
      // rest of the string after space is the item that was purchased

      // count = 0;
      // item = "";
      // shiftindex = 0;

      orderContents[row].forEach((item) => {
        if (item.charAt(0) == ' ') {
          item = item.substring(1);
        }

        let shiftindex = item.indexOf(' ');

        let count = parseInt(item.substring(0, shiftindex));

        // get the actual name of the item without the count in front
        let menuName = item.substring(shiftindex + 1);
        // console.log(item.substring(shiftindex + 1));
        if (!stockAmount.hasOwnProperty(menuName)) {
          return;
        }

        stockAmount[menuName] += count;
        saleAmount[menuName] += count;
      });
    });

    // const excessReport = [];

    for (const itemName in stockAmount) {
      if (stockAmount.hasOwnProperty(itemName)) {
        const percentSold = saleAmount[itemName] / stockAmount[itemName];

        if (percentSold * 100 < 10) {
          const s_percentSold = `${saleAmount[itemName]} / ${stockAmount[itemName]} = ${percentSold.toFixed(2)}%`;
          // const s_percentSold = `${percentSold.toFixed(2)}%`;

          excessReport.push({
            name: itemName,
            percent_sold: s_percentSold,
          });
        }
      }
    }

    res.status(200).send(excessReport);
  } catch (e) {
    res.status(500).send(JSON.stringify(e));
  }
});

app.get('/trendReport', async (req, res) => {
  const startDate = req.query.startDate;
  const endDate = req.query.endDate;

  // MAKE SURE TO REMOVE CONSTANTS FOR START AND END DATE
  // const startDate = "2022-01-10";
  // const endDate = "2022-06-11";

  // get order content 
  try {
    const orders = await DBAdapter.query(
      `SELECT order_content FROM orders WHERE order_placed_on > $1 AND order_placed_on < $2`,
      [startDate, endDate]
    );

    const ordersList = orders.rows.map(order => ({ order_content: order.order_content }));
    const pairMap = {};

    ordersList.forEach(entry => {
      const orderContents = entry.order_content.split(', ');

      for (let i = 0; i < orderContents.length - 1; i++) {
        for (let j = i + 1; j < orderContents.length; j++) {
          let iProd = orderContents[i].substring(orderContents[i].indexOf(' '));
          let jProd = orderContents[j].substring(orderContents[j].indexOf(' '));

          if (iProd.localeCompare(jProd) > 0) {
            [iProd, jProd] = [jProd, iProd];
          }

          const pairKey = `${iProd} ${jProd}`;
          pairMap[pairKey] = pairMap[pairKey] ? pairMap[pairKey] + 1 : 1;
        }
      }


    });

    const pairCounts = [];

    for (const [key, value] of Object.entries(pairMap)) {
      const pair = {
        type: key,
        count: value
      };

      pairCounts.push(pair);
    }

    pairCounts.sort((a, b) => b.count - a.count);

    res.status(200).send(pairCounts);
  }
  catch (e) {
    res.status(500).send(JSON.stringify(e));
  }
});

// Get all entries from given table
app.get('/table', async (req, res) => {
  if (!req.query.table) {
    res.status(500).send('Table not defined');
    return;
  }

  try {
    const result = await DBAdapter.query(
      'select * from ' + req.query.table + ';'
    );

    let table = [];

    result.rows.forEach((row) => {
      table.push(row);
    });

    res.status(200).send(table);
  } catch (e) {
    res.status(500).send(JSON.stringify(e));
  }
});

// Get menu categories
app.get('/categories', async (req, res) => {
  const query =
    "select distinct(category) from menu where category not like 'specials';";

  try {
    const result = await DBAdapter.query(query);
    res.status(200).send(result.rows);
  } catch (e) {
    res.status(500).send(JSON.stringify(e));
  }
});

app.get('/cookieItems', async (req, res) => {
  const query = "select name, price from menu where category like 'Cookies'";

  try {
    const result = await DBAdapter.query(query);

    res.status(200).send(result.rows);
  } catch (e) {
    res.status(500).send(JSON.stringify(e));
  }
});

app.get('/brownieItems', async (req, res) => {
  const query = "select name, price from menu where category like 'Brownies'";

  try {
    const result = await DBAdapter.query(query);

    res.status(200).send(result.rows);
  } catch (e) {
    res.status(500).send(JSON.stringify(e));
  }
});

app.get('/iceCreamItems', async (req, res) => {
  const query = "select name, price from menu where category like 'Ice Cream'";

  try {
    const result = await DBAdapter.query(query);

    res.status(200).send(result.rows);
  } catch (e) {
    res.status(500).send(JSON.stringify(e));
  }
});

app.get('/beverageItems', async (req, res) => {
  const query = "select name, price from menu where category like 'Beverages'";

  try {
    const result = await DBAdapter.query(query);

    res.status(200).send(result.rows);
  } catch (e) {
    res.status(500).send(JSON.stringify(e));
  }
});

// Get menu items by category
app.get('/categoryItems', async (req, res) => {
  if (!req.query.category) {
    res.status(500).send('Category not defined');
    return;
  }

  let query =
    "select * from menu where category like '" + req.query.category + "'";

  const currentDate = new Date().toISOString().slice(0, 10);

  query += " AND (from_date IS NULL OR to_date IS NULL OR (from_date <= '" + currentDate + "' AND to_date >= '" + currentDate + "'))";

  try {
    const result = await DBAdapter.query(query);

    // console.log(result.rows);
    res.status(200).send(result.rows);
  } catch (e) {
    res.status(500).send(JSON.stringify(e));
  }
});

// Submit order to database
app.post('/order', async (req, res) => {
  if (!req.body.order) {
    res.status(500).send('Order not defined');
    return;
  }

  if (!req.body.price) {
    res.status(500).send('Price not defined');
    return;
  }

  if (!req.body.status) {
    res.status(500).send('Status not defined');
    return;
  }

  if (req.body.pointsUsed === undefined) {
    res.status(500).send('Points used not defined');
    return;
  }

  // Tranform order into comma separated string
  let orderContent = '';
  for (let i = 0; i < req.body.order.length; i++) {
    orderContent += req.body.order[i].amount + ' ' + req.body.order[i].name;
    if (i < req.body.order.length - 1) {
      orderContent += ', ';
    }
  }

  let phoneCheckQuery = "select * from rewards where customer_id = ";
  if (req.body.phoneNumber) {
    phoneCheckQuery += "'" + req.body.phoneNumber + "';";
  } else {
    phoneCheckQuery += "null;"
  }

  // Check if phone number exists in rewards table
  // If not, add it with 0 points
  try {
    const result = await DBAdapter.query(phoneCheckQuery);
    if (result.rowCount == 0 && req.body.phoneNumber) {
      const insertQuery =
        "INSERT INTO rewards VALUES ('" + req.body.phoneNumber + "', 0);";
      await DBAdapter.query(insertQuery);
    }
    else if (req.body.email) {
      const updateQuery = "UPDATE rewards SET points = points + " + (req.body.price * 10 - req.body.pointsUsed) + "::NUMERIC::INTEGER WHERE email = '" + req.body.email + "';";
      await DBAdapter.query(updateQuery);
    } else if (req.body.phoneNumber) {
      const updateQuery = "UPDATE rewards SET points = points + " + (req.body.price * 10 - req.body.pointsUsed) + "::NUMERIC::INTEGER WHERE customer_id = '" + req.body.email + "';";
      await DBAdapter.query(updateQuery);
    }
  } catch (e) {
    res.status(500).send(JSON.stringify(e));
    return;
  }

  let insertQuery = "INSERT INTO orders (customer_id, order_content, price, order_placed_on, status) VALUES ('";
  if (req.body.phoneNumber) {
    insertQuery += req.body.phoneNumber + "', '" + orderContent + "', '" + req.body.price + "', NOW(), '" + req.body.status + "');";
  } else {
    let phoneNumberQuery = "select customer_id from rewards where email ilike '" + req.body.email + "';";

    try {
      const result = await DBAdapter.query(phoneNumberQuery);
      if (result.rowCount == 0) {
        res.status(500).send("Phone number not found");
        return;
      }
      insertQuery += result.rows[0].customer_id + "', '" + orderContent + "', '" + req.body.price + "', NOW(), '" + req.body.status + "');";
    } catch (e) {
      res.status(500).send(JSON.stringify(e));
      return;
    }
  }

  // Insert order into orders table
  try {
    await DBAdapter.query(insertQuery);
  } catch (e) {
    res.status(500).send(JSON.stringify(e));
    return;
  }

  // Loop through order and decrement amount in menu table
  try {
    req.body.order.forEach(async (item) => {
      const name = item.name;
      const amount = item.amount;

      const checkAmount = "select amount from menu where name ='" + name + "';";
      let menuAmount = 0;

      // Check if menu item exists
      const result = await DBAdapter.query(checkAmount);
      if (result.rowCount > 0) {
        menuAmount = result.rows[0].amount;
      } else {
        return;
      }

      // Prevent negatives amounts
      if (menuAmount - amount < 0) {
        return;
      }

      const updateAmount =
        'update menu set amount = ' +
        (menuAmount - amount) +
        " where name = '" +
        name +
        "';";
      await DBAdapter.query(updateAmount);
    });
  } catch (e) {
    res.status(500).send(JSON.stringify(e));
    return;
  }

  res.status(200).send('Order placed');
  return;
});

app.get('/roles', async (req, res) => {
  if (!req.query.email) {
    res.status(500).send('Email not defined');
    return;
  }

  let permissions = 0;

  const query =
    "select * from rewards where email = '" + req.query.email + "' limit 1;";

  try {
    const result = await DBAdapter.query(query);

    if (result.rowCount == 0) {
      res.status(200).send(JSON.stringify({ role: -1 }));
      return;
    }

    if (result.rows[0].admin) {
      permissions |= 4;
    }
    if (result.rows[0].manager) {
      permissions |= 2;
    }
    if (result.rows[0].cashier) {
      permissions |= 1;
    }

    res.status(200).send(JSON.stringify({ role: permissions }));
  } catch (e) {
    res.status(500).send(JSON.stringify(e));
    return;
  }
});

app.get('/userPoints', async (req, res) => {
  if (!req.query.email) {
    res.status(500).send('Email not defined');
    return;
  }

  const query =
    "select * from rewards where email ilike '" + req.query.email + "' limit 1;";

  try {
    const result = await DBAdapter.query(query);

    if (result.rowCount == 0) {
      res.status(200).send(JSON.stringify({ points: 0 }));
      return;
    }

    res.status(200).send(JSON.stringify({ points: result.rows[0].points }));
  } catch (e) {
    res.status(500).send(JSON.stringify(e));
    return;
  }
});

app.post('/usersWithPhoneNumber', async (req, res) => {
  if (!req.body.number) {
    res.status(500).send('Phone number not defined');
    return;
  }
  if (!req.body.email) {
    res.status(500).send('Email not defined');
    return;
  }
  if (!req.body.name) {
    res.status(500).send('Name not defined');
    return;
  }

  const query =
    "select * from rewards where customer_id ilike '" + req.body.number + "' limit 1;";

  try {
    const result = await DBAdapter.query(query);

    if (result.rowCount == 0) {
      const insertQuery = "INSERT INTO rewards VALUES ('" + req.body.number + "', 0, '" + req.body.email + "', false, false, false, '" + req.body.name + "');";
      await DBAdapter.query(insertQuery);

      res.status(200).send("User created");
      return;
    }

    if (result.rows[0].email !== email) {
      res.status(200).send("Phone number already in use");
      return;
    }

  } catch (e) {
    res.status(500).send(JSON.stringify(e));
    return;
  }
});

app.get("/users", async (req, res) => {
  const query = "select * from rewards where admin = true or cashier = true or manager = true;";

  try {
    const result = await DBAdapter.query(query);

    res.status(200).send(result.rows);
  } catch (e) {
    res.status(500).send(JSON.stringify(e));
    return;
  }
});

app.get("/weather", async (req, res) => {

  try {
    axios.get("https://api.openweathermap.org/data/2.5/weather?lat=30.624240&lon=-96.339180&appid=" + process.env.WEATHER_API_KEY).then(response => {
      res.status(200).send(response.data.weather[0].main);
    })
  } catch (e) {
    res.status(500).send(JSON.stringify(e));
    return;
  }
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
