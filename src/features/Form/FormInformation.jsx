// features/ProjectManagement/ProjectInformation.js
import React from 'react';
import { Typography, Box } from '@mui/material';

function FormInformation({ projectId }) {
    // Placeholder for actual project data fetching
    const projectData = {
        name: 'Project Alpha',
        description: 'This is a sample project description.',
        startDate: '2023-01-01',
        endDate: '2023-12-31',
        // Add more project details as needed
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h6">{projectData.name}</Typography>
            <Typography variant="body1">{projectData.description}</Typography>
            <Typography variant="body2">Start Date: {projectData.startDate}</Typography>
            <Typography variant="body2">End Date: {projectData.endDate}</Typography>
            {/* Render more project details here */}
        </Box>
    );
}

export default FormInformation;
