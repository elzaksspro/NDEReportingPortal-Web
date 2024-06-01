import React, { useState } from 'react';
import CreateDepartment from './CreateDepartment';
import DepartmentList from './DepartmentList';
import EditDepartment from './EditDepartment'; // Import the EditDepartment component
import { Container, Box } from '@mui/material';
import './DepartmentManagement.css'; // Ensure this path is correct

function DepartmentManagement() {
    const [updateFlag, setUpdateFlag] = useState(false);
    const [selectedDepartment, setSelectedDepartment] = useState(null);

    const refreshDepartmentList = () => {
        setUpdateFlag(!updateFlag); // Toggle to refresh the list
    };

    const handleEditDepartment = (department) => {
        setSelectedDepartment(department);
    };

    return (
        <Container>
            <Box id="DepartmentManagement" sx={{ width: '100%' }}>
                <CreateDepartment onDepartmentCreated={refreshDepartmentList} />
                <DepartmentList onEdit={handleEditDepartment} key={updateFlag} />
                {selectedDepartment && (
                    <EditDepartment
                        department={selectedDepartment}
                        onClose={() => setSelectedDepartment(null)}
                        onUpdate={refreshDepartmentList}
                    />
                )}
            </Box>
        </Container>
    );
}

export default DepartmentManagement;
