import React from 'react';
import UltimateTable from './UltimateTable';

function MainComponent({ tableType, data }) {
    let headersList, displayFormatter;


    switch (tableType) {
        case 'sales':
            headersList = ['Menu Item', 'Total Sale Amount'];
            displayFormatter = (value) => `$${value.toFixed(2)}`;
            break;
        case 'restock':
            headersList = ['Name', 'Quantity', 'Minimum Quantity'];
            break;

        default:
            headersList = ['Dogs', 'Cats', 'Polar Bears', 'Dolphin'];
            data = [["1", "2", "3", "13"], ["4", "5", "7", "27"]];
            break;

    }

    if (!data) {
        return <p>Error: no Data</p>
    }

    return (
        <div>
            <UltimateTable headersList={headersList} data={data} displayFormatter={displayFormatter} />
        </div>
    );
}

export default MainComponent;