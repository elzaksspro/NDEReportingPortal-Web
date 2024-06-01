import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField, MenuItem } from '@mui/material';
import Swal from 'sweetalert2';
import './FormList.css'; // Ensure this is the correct path to your CSS
import axios from 'axios';
import { getBaseUrl } from '@/features/Common/Utils/apiutils';

function FormList({ forms, setForms,onPageChange }) {
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
            const response = await axios.get(getBaseUrl()+`/Forms`); // Changed Profiles to Forms
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

    const handleStatusChange = async (formId, newStatus) => {
        try {
          
            await axios.put(getBaseUrl()+`/Forms/${formId}/status`,
             { formId:formId, newStatus: newStatus });
            let statusLabel = '';
            switch (newStatus) {

                case 0:
                    statusLabel = 'Draft';
                    break;
                case 1:
                    statusLabel = 'Published';
                    break;
                case 2:
                    statusLabel = 'Archived';
                    break;
                default:
                    statusLabel = '';
            }
            Swal.fire(`Form ${statusLabel}!`, `The form has been set to ${statusLabel.toLowerCase()} status.`, 'success');
            // You may want to update the forms state here to reflect the changes immediately
            fetchForms()
            console.log("Hello")


        } catch (error) {
            console.error('Error updating form status:', error);
            Swal.fire('Error!', 'An error occurred while updating the form status.', 'error');
        }
    };

    return (
        <div>
            
            <TextField
                select
                label="Filter by Status"
                value={filter}
                onChange={handleFilterChange}
                variant="outlined"
                fullWidth
                className="filter-field"
            >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="0">Draft</MenuItem>
                <MenuItem value="1">Published</MenuItem>
                <MenuItem value="2">Archived</MenuItem>
            </TextField>

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
                            <TableCell>Status</TableCell>
                            <TableCell></TableCell>
                            <TableCell>Actions </TableCell>
                            <TableCell></TableCell>


                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {currentForms.map((form) => (
                            <TableRow key={form.id}>
                                <TableCell>{form.name}</TableCell>
                                <TableCell>{form.description}</TableCell>
                                <TableCell>{getStatusLabel(form.status)}</TableCell>
                                <TableCell>
                                <Button component={Link} to={`/forms/edit/${form.id}`} variant="outlined" size="small">
                                    Edit
                                </Button>
                                </TableCell>
                            

                                <TableCell>
                                {form.status === 0 ? (
                                // If the status is Draft, display the Publish button
                                <Button onClick={() => handleStatusChange(form.id, 1)} variant="outlined" size="small" >
                                    Publish
                                </Button>
                            ) : form.status === 1 ? (
                                // If the status is Published, display the Archive button
                                <Button onClick={() => handleStatusChange(form.id, 2)} variant="outlined" size="small">
                                    Archive
                                </Button>
                            ) : (
                                // If the status is Archived or any other value, display the Draft button
                                <Button onClick={() => handleStatusChange(form.id, 0)} variant="outlined" size="small">
                                    Draft
                                </Button>
                            )}


                                </TableCell>
                                <TableCell>
                                <Button component={Link} to={`/forms/form-details/${form.id}`} variant="outlined" size="small">
                                    Design  Form
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

function getStatusLabel(status) {
    switch (status) {
        case 0:
            return 'Draft';
        case 1:
            return 'Published';
        case 2:
            return 'Archived';
        default:
            return '';
    }
}

export default FormList;
