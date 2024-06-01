import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Tab, Typography } from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import FormVersionsList from './FormVersionsList';
import FormDataCollectorsList from './FormDataCollectorsList';
import FormCollaboratorsList from './FormCollaboratorsList';
import './FormDetails.css'; // Import the CSS file

function FormDetails() {
    const { formId } = useParams(); // Changed from projectId to formId
    const [value, setValue] = useState('1');

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <Box className="form-details-container"> {/* Add className for styling */}
            <TabContext value={value}>
                <Box className="sidebar"> {/* Add className for styling */}
                    <TabList orientation="vertical" onChange={handleChange} aria-label="Project Details Tabs">
                        <Tab label="Manage Form Versions" value="1" />
                        <Tab label="Manage Data Collectors" value="2" />
                        <Tab label="Manage Collaborators" value="3" />
                    </TabList>
                </Box>
                <Box className="main-content"> {/* Add className for styling */}
                    <TabPanel value="1" className="tab-panel">
                        <FormVersionsList formId={formId} />
                    </TabPanel>
                    <TabPanel value="2" className="tab-panel">
                        <FormDataCollectorsList formId={formId} />
                    </TabPanel>
                    <TabPanel value="3" className="tab-panel">
                        <FormCollaboratorsList formId={formId} />
                    </TabPanel>
                </Box>
            </TabContext>
        </Box>
    );
}

export default FormDetails;
