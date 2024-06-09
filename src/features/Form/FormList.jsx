import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField } from '@mui/material';
import Swal from 'sweetalert2';
import axios from 'axios';
import { getBaseUrl } from '@/features/Common/Utils/apiutils';
import './FormList.css'; // Ensure this is the correct path to your CSS

function FormList({ forms, setForms, onPageChange }) {
    const itemsPerPage = 10; // Number of items per page
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredForms = forms.filter(form =>
        form.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredForms.length / itemsPerPage);

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    const currentForms = filteredForms.slice(startIndex, endIndex);

    const fetchForms = async () => {
        try {
            const response = await axios.get(getBaseUrl() + `/Forms`);
            if (response.data && response.data.status) {
                setForms(response.data.data.items.$values);
            }
            onPageChange(currentPage);
        } catch (error) {
            console.error('Failed to fetch forms:', error);
        }
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
        onPageChange(page);
    };

    const handleStatusChange = async (formId, newStatus) => {
        try {
            await axios.put(getBaseUrl() + `/Forms/${formId}/status`, { formId, newStatus });
            let statusLabel = newStatus === 1 ? 'Published' : 'Unpublished';
            Swal.fire(`Form ${statusLabel}!`, `The form has been set to ${statusLabel.toLowerCase()} status.`, 'success');
            fetchForms();
        } catch (error) {
            console.error('Error updating form status:', error);
            Swal.fire('Error!', 'An error occurred while updating the form status.', 'error');
        }
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
                            <TableCell>Status</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {currentForms.map((form) => (
                            <TableRow key={form.id}>
                                <TableCell>{form.name}</TableCell>
                                <TableCell>{form.description}</TableCell>
                           
                                <TableCell>
                                    {form.status === 0 || form.status === 2 ? (
                                        <Button onClick={() => handleStatusChange(form.id, 1)} variant="outlined" size="small"
                                        style={{ marginLeft: '10px' }}>
                                            Publish
                                        </Button>
                                    ) : (
                                        <Button onClick={() => handleStatusChange(form.id, 0)} variant="outlined" size="small"
                                        style={{ marginLeft: '10px' }}>
                                            Unpublish
                                        </Button>
                                    )}
                                </TableCell>

                                <TableCell>

                                    <Button component={Link} to={`/forms/edit/${form.id}`} variant="outlined" size="small" style={{ marginLeft: '10px' }}>
                                        Edit
                                    </Button>
                                    <Button component={Link} to={`/forms/form-details/${form.id}`} variant="outlined" size="small" style={{ marginLeft: '10px' }}>
                                        Design Form
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
        case 2:
            return 'Unpublished';
        case 1:
            return 'Published';
        default:
            return '';
    }
}

export default FormList;
