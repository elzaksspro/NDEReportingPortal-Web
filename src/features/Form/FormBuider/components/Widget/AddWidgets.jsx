// components/FormBuilder/AddWidgets.jsx
import React from 'react';
import { Button } from '@mui/material'; // Import Button component from Material-UI

const AddWidgets = ({ questionWidgets, addNewQuestion }) => {
  const handleClick = (type) => {
    addNewQuestion(type);
  };

  return (
    <div className="add-widgets-container">
      <div className="row">
        {questionWidgets.map((widget, index) => (
          <div key={index} className="col-md-10 mb-1">
            <Button
              variant="contained"
              color="success"
              fullWidth // Make button width 100% of the column
              onClick={() => handleClick(widget.type)}
            >
              <i className={`bi ${widget.icon}`} style={{ fontSize: '1.0rem' }}></i> {widget.label}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AddWidgets;
