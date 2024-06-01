import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField } from '@mui/material';
import axios from 'axios';
import Swal from 'sweetalert2';
import './SubmissionList.css'; // Ensure this is the correct path to your CSS
import { getBaseUrl } from '@/features/Common/Utils/apiutils';

function SubmissionList({ forms, setForms, onPageChange }) {
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

    const fetchForms = async () => {
        try {
            const response = await axios.get(getBaseUrl() + `/Forms/DataCollectionForms`);
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

    const downloadFile = async (formId, versionId,versionNumber, type) => {
        try {
            Swal.fire({
                title: 'Preparing your download...',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            const endpoint = type === 'excel'
                ? `${getBaseUrl()}/Forms/submission/${formId}/${versionId}/${versionNumber}`
                : `${getBaseUrl()}/Forms/export/${formId}/${versionId}/${versionNumber}`;

            const response = await axios.get(endpoint, {
                responseType: 'blob',
                onDownloadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    Swal.update({
                        title: `Downloading... ${percentCompleted}%`
                    });
                }
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', type === 'excel'
                ? `FormSubmissions_${formId}_${versionNumber}.xlsx`
                : `form_${formId}_version_${versionNumber}.zip`);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);

            Swal.close(); // Close the loading indicator
        } catch (error) {
            Swal.fire('Error', `Failed to download ${type === 'excel' ? 'Excel' : 'media'} file: ${error.message}`, 'error');
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
                            <TableCell>Form Version</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell>Download Excel</TableCell>
                            <TableCell>Download Media</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {currentForms.map((form) => (
                            <TableRow key={form.formId}>
                                <TableCell>{form.name}</TableCell>
                            
                                <TableCell>{form.versionNumber}</TableCell>
                                <TableCell>{form.description}</TableCell>
                                <TableCell>
                                    <Button
                                        onClick={() => downloadFile(form.formId, form.versionId,form.versionNumber, 'excel')}
                                        variant="outlined"
                                        size="small"
                                    >
                                        Download Excel
                                    </Button>
                                </TableCell>
                                <TableCell>
                                    <Button
                                        onClick={() => downloadFile(form.formId, form.versionId,form.versionNumber, 'media')}
                                        variant="outlined"
                                        size="small"
                                    >
                                        Download Media
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

export default SubmissionList;
