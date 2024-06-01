import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, TextField, Box, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import './CreateForm.css'; // Import the CSS file for styling
import { getBaseUrl } from '@/features/Common/Utils/apiutils';
import { useAuth } from '@/features/Common'; // Import useAuth hook

function EditForm() {
    const { userId } = useAuth(); // Get userId from the AuthProvider context
    const { formId } = useParams();
    const navigate = useNavigate();

    const [formDetails, setFormDetails] = useState({
        name: '',
        description: '',
        ownerId: userId // 
    });

    useEffect(() => {
        // Fetch existing form details here and set them in state for editing
        const fetchFormDetails = async () => {
            try {
                const response = await axios.get(getBaseUrl() + `/Forms/${formId}`);
                setFormDetails(response.data.data);
            } catch (error) {
                console.error('Error fetching form details:', error);
            }
        };
        fetchFormDetails();
    }, [formId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormDetails(prevDetails => ({
            ...prevDetails,
            [name]: value,
        }));
    };

    const editFormUrl = getBaseUrl() + `/Forms/${formId}`;

    const handleSubmit = (event) => {
        event.preventDefault();
        axios.put(editFormUrl, formDetails)
            .then(() => {
                navigate('/forms'); 
            })
            .catch(error => console.error('Error updating form:', error));
    };

    return (
        <div className="createFormContainer">
            <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/forms')}>
                Back to Forms 
            </Button>
            <Typography variant="h6" className="formTitle">
                Edit Form
            </Typography>
            <form onSubmit={handleSubmit} className="createFormForm">
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="name"
                    label="Form Name"
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
                    label="Form Description"
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
                    Update 
                </Button>
            </form>
        </div>
    );
}

export default EditForm;
