import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import axios from 'axios';
import { getBaseUrl } from '@/features/Common/Utils/apiutils';


function EditDepartment({ department, onClose, onUpdate }) {
    const [name, setName] = useState(department.name);

    const handleUpdate = () => {
        const updateDeptUrl = getBaseUrl()+`/Department/${department.id}`;

        axios.put(updateDeptUrl, { newname: name })
            .then(response => {
                onUpdate(); // Callback to refresh the department list
                onClose(); // Close the dialog
            })
            .catch(error => console.error('Error updating department:', error));
    };

    return (
        <Dialog open={true} onClose={onClose}>
            <DialogTitle>Edit Department</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="name"
                    label="Department Name"
                    name="name"
                    autoComplete="off"
                    value={name || ''}
                    onChange={e => setName(e.target.value)}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    Cancel
                </Button>
                <Button onClick={handleUpdate} color="primary">
                    Update
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default EditDepartment;
