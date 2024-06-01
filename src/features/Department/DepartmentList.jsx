import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { getBaseUrl } from '@/features/Common/Utils/apiutils';


function DepartmentList({ onEdit }) {
    const [departments, setDepartments] = useState([]);

    useEffect(() => {
        const list_dept_Url = getBaseUrl()+`/Department`;

        axios.get(list_dept_Url)
            .then(response => {
                if (response.data && response.data.status) {
                    setDepartments(response.data.data.$values);
                }
            })
            .catch(error => console.error('Error fetching departments:', error));
    }, []);

    return (
        <TableContainer component={Paper}>
            <Table aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Department ID</TableCell>
                        <TableCell>Department Name</TableCell>
                        <TableCell align="right">Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {departments.map((department) => (
                        <TableRow key={department.id}>
                            <TableCell>{department.id}</TableCell>
                            <TableCell>{department.name}</TableCell>
                            <TableCell align="right">
                              
                            

                                <Button  startIcon={<EditIcon />}onClick={() => onEdit(department)} variant="contained" color="primary" size="small">
                                        Edit
                                    </Button>


                                

                                {/* Add Delete functionality as needed */}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default DepartmentList;
