import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Button } from '@mui/material';
import axios from 'axios';
import { getBaseUrl } from '@/features/Common/Utils/apiutils';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useAuth } from '@/features/Common/context/AuthContext';
import { FormBuilder } from './FormBuider';
import './FormVersionsList.css'; // Import the CSS file



function FormVersionsList({ formId }) {
    const [formVersions, setFormVersions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedFormVersion, setSelectedFormVersion] = useState(null);

    const { logout } = useAuth();

    useEffect(() => {
        fetchFormVersions();
    }, [formId]);

    const getFormsVersionsUrl = getBaseUrl() + `/Forms/${formId}/versions`;

    const fetchFormVersions = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(getFormsVersionsUrl);
            setFormVersions(response.data.data.items.$values);
        } catch (error) {
            if (error.response.status === 401) {
                logout();
            }
            console.error('Error fetching form versions:', error);
            setError('An error occurred while fetching form versions.');
        } finally {
            setLoading(false);
        }
    };

    const handleDesignForm = (formVersion) => {
        setSelectedFormVersion(formVersion);
    };

    const handleSetActiveFormVersion = async (formVersionId) => {
        const confirmResult = await Swal.fire({
            title: 'Set Active Version',
            text: 'Are you sure you want to set this version as active?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes',
        });

        if (confirmResult.isConfirmed) {
            try {
                await axios.put(getBaseUrl() + `/Forms/${formId}/setactiveversion`, { versionId: formVersionId });
                fetchFormVersions();
                Swal.fire('Success!', 'Active form version set successfully.', 'success');
            } catch (error) {
                console.error('Error setting active form version:', error);
                Swal.fire('Error!', 'An error occurred while setting active form version.', 'error');
            }
        }
    };

    if (loading) {
        return <CircularProgress />;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (selectedFormVersion) {
        return <FormBuilder formVersion={selectedFormVersion} />;
    }

    return (
        <div className="form-versions-container">
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Version Number</TableCell>
                            <TableCell>Change Log</TableCell>
                            <TableCell>Created Date</TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {formVersions.map((version) => (
                            <TableRow key={version.id}>
                                <TableCell>{version.versionNumber}</TableCell>
                                <TableCell>{version.changeLog}</TableCell>
                                <TableCell>{new Date(version.createdDate).toLocaleString()}</TableCell>
                                <TableCell>
                                    <Button variant="outlined" onClick={() => handleDesignForm(version)}>Form Designer</Button>
                                </TableCell>
                                <TableCell>
                                    <Button variant="outlined" onClick={() => handleSetActiveFormVersion(version.id)} disabled={version.isActiveVersion}>Set Active Version</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}

export default FormVersionsList;