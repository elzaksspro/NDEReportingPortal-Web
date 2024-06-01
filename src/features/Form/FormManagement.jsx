import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FormList from './FormList'; // Assuming you have a component named FormList
import { Link } from 'react-router-dom';
import { Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import './FormManagement.css'; // Make sure to import the correct CSS file
import { getBaseUrl } from '@/features/Common/Utils/apiutils';


function FormManagement() {
    const [forms, setForms] = useState([]); // Changed users to forms
    const [filter, setFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const fetchForms = async () => { // Changed fetchUsers to fetchForms
            try {
                const response = await axios.get(getBaseUrl()+`/Forms`); // Changed Profiles to Forms
                if (response.data && response.data.status) {
                    setForms(response.data.data.items.$values); // Adjust based on actual API response
                }

            } catch (error) {
                console.error('Failed to fetch forms:', error); // Changed users to forms
            }
        };

        fetchForms(); // Changed fetchUsers to fetchForms
    }, []);

    const handleFilterChange = (event) => {
        setFilter(event.target.value);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <div id='FormManagement'> 
            <Button  
                id="createFormButton"
                variant="contained"
                component={Link} 
                to="/forms/create" // Changed users to forms
                startIcon={<AddCircleOutlineIcon />}
            >
                Create
            </Button>
            
            <FormList // Assuming this component is for displaying forms
                forms={forms} // Changed users to forms
                setForms={setForms}
                filter={filter}
                currentPage={currentPage}
                onPageChange={handlePageChange}
            />
        </div>
    );
}

export default FormManagement;
