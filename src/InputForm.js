import React from 'react';
import './Home.css';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import axios from 'axios';


function InputForm({ formData, databaseAttributes, tableName }) {

  const [open, setOpen] = React.useState(false);

  if (!formData) {
    return (<p>Error no data</p>);
  }

  const label = formData[0];

  const attributesList = formData.slice(1);

  const resultsList = new Array(attributesList.length).fill("");

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const enterResponse = async () => {
    if (formData[0] === 'Add') {
      const payload = {
        table: tableName,
        attributes: databaseAttributes,
        values: resultsList,
      };

      if (payload.attributes[2] === "oven_start_time") {
        console.log(payload.attributes[2]);
        const currentDate = new Date().toISOString().slice(0, 10);
        payload.values[2] = currentDate + " " + payload.values[2];
        payload.values[3] = currentDate + " " + payload.values[3];
      }

      try {
        const response = await axios.post('/entry', payload);

        console.log(response.headers);
        console.log('API response: ', response.data);

        setOpen(false);
      } catch (error) {
        console.error('Error', error);
      }

    }
    else if (formData[0] === 'Update') {
      const payload = {
        table: tableName,
        attributes: databaseAttributes,
        values: resultsList,
        colname: databaseAttributes[0],
        id: resultsList[0]
      };

      try {
        const response = await axios.patch('/entrycolname', payload);

        console.log('API response: ', response.data);

        setOpen(false);
      } catch (error) {
        console.error('Error', error);
      }
    }
    else if (formData[0] === 'Delete') {
      const colname = databaseAttributes[0];
      const id = resultsList[0];
      const deletePath = `/entrycolname?table=${tableName}&colname=${colname}&id=${id}`;
      try {
        const response = await axios.delete(deletePath);

        console.log('API response: ', response.data);

        setOpen(false);
      } catch (error) {
        console.error('Error', error);
      }
    }

    {/*We can add the database handling here and maybe also add a function to regenerate tables. Simply take a list with each new value from the resultsList*/ }
    setOpen(false);
    window.location.reload();
  };

  return (

    <React.Fragment>
      <Button style={{ backgroundColor: '#fafafa', color: '#000892', border: '2px solid #000892', marginLeft: '2px', marginRight: '2px', marginBottom: '2px' }} variant="outlined" onClick={handleClickOpen}>
        {label}
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{label} Entry</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter attributes for this entry.
          </DialogContentText>

          {attributesList.map((value, index) => (
            <div key={index}>
              <TextField
                autoFocus
                margin="dense"
                id={value}
                label={value}
                fullWidth
                variant="standard"
                autoComplete='off'
                onChange={(e) => {
                  resultsList[index] = e.target.value;
                }}

              />

            </div>
          ))}

        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={enterResponse}>
            {formData[0] === 'Add' && 'Add'}
            {formData[0] === 'Update' && 'Update'}
            {formData[0] === 'Delete' && 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>

  );
}

export default InputForm;