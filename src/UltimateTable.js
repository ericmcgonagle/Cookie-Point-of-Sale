import React from 'react';
import './Home.css';

//reusable table structure to be used to generate the manager interface tables
function UltimateTable({tableType, data, displayFormatter}){

    if(!data){
        return(<p>Error no data</p>);
    }

    let headersList;

    //use type variable to determine column names
    switch (tableType) {

        case 'orders':
            headersList = ['ID', 'Order Content', 'Total price', 'Date', 'Status'];
            break;
        case 'inventory':
            headersList = ['ID', 'Name', 'Expiration Date', 'Quantity (lbs)', 'Minimum Quantity'];
            break;
        case 'products':
            headersList = ['ID', 'Menu Item', 'Amount', 'Start Time', 'End Time'];
            break;
        case 'menu':
            headersList = ['Menu ID', 'Menu Name', 'Ingredients', 'Allergens', 'Nutritional Information', 'Price', 'Start Date', 'End Date', 'Category'];
            break;
        case 'Customers':
            headersList = ['Customer Phone Number', 'Name', 'Email', 'Points'];
            break;
        case 'sales':
            headersList = ['Menu Item', 'Total Sale Amount ($)'];
            break;
        case 'restock':
            headersList = ['Name', 'Quantity', 'Minimum Quantity'];
            break;
        case 'restockProd':
            headersList = ['Name', 'Quantity'];
            break;
        case 'prodUsage':
            headersList = ['Menu Item', 'Amount Sold'];
            break;
        case 'excess':
            headersList = ['Name', 'Percent Sold'];
            break;
        case 'admin':
            headersList = ['ID', 'Email', 'Cashier', 'Manager', 'Admin'];
            break;
        case 'trendReport':
            headersList = ['Item Pair', 'Occurrences'];
            break;
        
        default:
            headersList = ["Dogs", "Cats", "Polar Bears", "Dolphin"];
            data = [["1", "2", "3", "13"], ["4", "5", "7", "27"]];
            break;
    }

    //iterates through the passed in data to formulate the table
    return (
      <table>
        <thead>
            <tr className='ultimateTable'>
                {headersList.map((header, i) => (
                <th className='ultimateTable' key={i}>{header}</th>
                ))}
            </tr>
        </thead>

        <tbody>
            {data.map((row, i) => (
                <tr key={i}>
                    {Object.values(row).map((value, j) => (
                        <td className='ultimateTable' key={j}>{displayFormatter ? displayFormatter(value) : value}</td>
                    ))}
                </tr>
            ))}
        </tbody>
      </table>
    );
}

export default UltimateTable;