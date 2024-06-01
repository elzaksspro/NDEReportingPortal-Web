import React, { useState } from 'react';
import axios from 'axios';
import { Button, TextField, Grid, Box } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { getBaseUrl } from '@/features/Common/Utils/apiutils';

function CreateDepartment({ onDepartmentCreated }) {
    const [name, setName] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        const create_dept_Url = getBaseUrl()+`/Department`;

        axios.post(create_dept_Url, { name })
            .then(response => {
                onDepartmentCreated(); // Callback to refresh the department list
                setName(''); // Reset field after successful creation
            })
            .catch(error => console.error('Error creating department:', error));
    };

    return (
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <Grid container spacing={2} alignItems="center">
                <Grid item xs>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="name"
                        label="Department Name"
                        name="name"
                        autoComplete="off"
                        value={name}
                        onChange={e => setName(e.target.value)}
                    />
                </Grid>
                <Grid item>
                    <Button
                        type="submit"
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        startIcon={<AddCircleOutlineIcon />}
                    >
                        Create
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
}

export default CreateDepartment;
