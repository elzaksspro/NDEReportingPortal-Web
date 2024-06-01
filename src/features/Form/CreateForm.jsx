import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Button, TextField, Box, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import './CreateForm.css'; // Import the CSS file for styling
import { getBaseUrl } from '@/features/Common/Utils/apiutils';
import { useAuth } from '@/features/Common'; // Import useAuth hook

function CreateForm() {
    const { userId } = useAuth(); // Get userId from the AuthProvider context

    const [formDetails, setFormDetails] = useState({
        name: '',
        description: '',
        ownerId: userId // 

    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormDetails(prevDetails => ({
            ...prevDetails,
            [name]: value,
        }));
    };

    const create_forms_Url = getBaseUrl()+`/Forms`;


    const handleSubmit = (event) => {
        event.preventDefault();
        axios.post(create_forms_Url, formDetails)
            .then(() => {
                navigate('/forms'); 
            })
            .catch(error => console.error('Error creating project:', error));
    };

    return (
        <div className="createFormContainer">
            <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/forms')}>
                Back to Forms 
            </Button>
            <Typography variant="h6" className="formTitle">
                Create New Form
            </Typography>
            <form onSubmit={handleSubmit} className="createFormForm">
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="name"
                    label="Project Name"
                    name="name"
                    autoComplete="off"
                    value={formDetails.name}
                    onChange={handleChange}
                />
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="description"
                    label="Project Description"
                    name="description"
                    autoComplete="off"
                    value={formDetails.description}
                    onChange={handleChange}
                    multiline
                    rows={4}
                />
                {/* Add more input fields as required */}
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    className="createButton"
                    style={{float: 'right'}}

                >
                    Create 
                </Button>

             
            </form>
        </div>
    );
}

export default CreateForm;
