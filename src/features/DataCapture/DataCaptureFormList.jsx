import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField, MenuItem } from '@mui/material';
import Swal from 'sweetalert2';
import './DataCaptureFormList.css'; // Ensure this is the correct path to your CSS
import axios from 'axios';
import { getBaseUrl } from '@/features/Common/Utils/apiutils';

function DataCaptureFormList({ forms, setForms,onPageChange }) {
    const itemsPerPage = 10; // Number of items per page
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('all'); // Default filter

    const handleFilterChange = (event) => {
        setFilter(event.target.value);
    };

    const filteredForms = forms.filter(form => {
        if (filter === 'all') {
            return true; // Return all forms
        } else {
            return form.status === parseInt(filter); // Filter forms based on status
        }
    }).filter(form =>
        form.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredForms.length / itemsPerPage);

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    const currentForms = filteredForms.slice(startIndex, endIndex);

    const fetchForms = async () => { // Changed fetchUsers to fetchForms
        try {
            const response = await axios.get(getBaseUrl()+`/Forms/DataCollectionForms`); // Changed Profiles to Forms
            if (response.data && response.data.status) {
                setForms(response.data.data.items.$values); // Adjust based on actual API response
            }
            onPageChange(currentPage);


        } catch (error) {
            console.error('Failed to fetch forms:', error); // Changed users to forms
        }
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
        onPageChange(page);
    };

  

    return (
        <div>
            
          

            <TextField
                label="Search by Form Name"
                variant="outlined"
                fullWidth
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-field"
            />
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Form Name</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell>Actions </TableCell>


                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {currentForms.map((form) => (
                            <TableRow key={form.formId}>
                                <TableCell>{form.name}</TableCell>
                                <TableCell>{form.description}</TableCell>

                                <TableCell>
                                <Button component={Link} to={`/datacapture/${form.formId}`} variant="outlined" size="small">
                                 Submit Data 
                                </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <div className="pagination">
                {Array.from({ length: totalPages }, (_, i) => (
                    <Button key={i} onClick={() => handlePageChange(i + 1)}>{i + 1}</Button>
                ))}
            </div>
        </div>
    );
}



export default DataCaptureFormList;
