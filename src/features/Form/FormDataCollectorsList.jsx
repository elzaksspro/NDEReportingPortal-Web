import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
  Box,
  Tabs,
  Tab,
  Pagination,
  Checkbox,
} from '@mui/material';
import axios from 'axios';
import Swal from 'sweetalert2';
import { getBaseUrl } from '@/features/Common/Utils/apiutils';

function FormDataCollectorsList({ formId }) {
  const [users, setUsers] = useState([]);
  const [selectedActiveUsers, setSelectedActiveUsers] = useState([]);
  const [selectedNewUsers, setSelectedNewUsers] = useState([]);
  const [filter, setFilter] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [dataCollectors, setDataCollectors] = useState([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    fetchDataCollectors();
    fetchUsers();
  }, [page, rowsPerPage]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        `${getBaseUrl()}/Profiles/${formId}/datacollectors?pageNumber=${page}&pageSize=${rowsPerPage}`
      );
      const userData = response.data.data.items.$values;
      setUsers(userData);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchDataCollectors = async () => {
    try {
      const response = await axios.get(
        `${getBaseUrl()}/Forms/${formId}/datacollectors?pageNumber=${page}&pageSize=${rowsPerPage}`
      );
      const dataCollectors = response.data.data.items.$values.map(
        (dc) => dc.user
      );

      setDataCollectors(dataCollectors);
    } catch (error) {
      console.error('Error fetching data collectors:', error);
    }
  };

  const handleCheckboxChange = (userId) => {
    if (tabValue === 0) {
      const updatedSelectedActiveUsers = selectedActiveUsers.includes(userId)
        ? selectedActiveUsers.filter((selectedUserId) => selectedUserId !== userId)
        : [...selectedActiveUsers, userId];
      setSelectedActiveUsers(updatedSelectedActiveUsers);
    } else {
      const updatedSelectedNewUsers = selectedNewUsers.includes(userId)
        ? selectedNewUsers.filter((selectedUserId) => selectedUserId !== userId)
        : [...selectedNewUsers, userId];
      setSelectedNewUsers(updatedSelectedNewUsers);
    }
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const handleDataCollectorsForm = async () => {
    try {
      await axios.post(`${getBaseUrl()}/Forms/assigndatacollectors`, {
        UserIds: selectedNewUsers,
        formId: formId,
      });
      fetchUsers();
      fetchDataCollectors();
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Data collectors added successfully!',
      });
    } catch (error) {
      console.error('Error sharing form:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to add data collectors. Please try again later.',
      });
    }
  };

  const handleRemoveDataCollectors = async () => {
    try {
      await axios.post(`${getBaseUrl()}/Forms/removedatacollectors`, {
        UserIds: selectedActiveUsers,
        formId: formId,
      });
      fetchDataCollectors();
      setSelectedActiveUsers([]); // Clear selected users after removal
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Data collectors removed successfully!',
      });
    } catch (error) {
      console.error('Error removing data collectors:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to remove data collectors. Please try again later.',
      });
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(1);
  };

  const filteredData = tabValue === 0 ? dataCollectors : users;

  const filteredItems = filteredData.filter(
    (item) =>
      item?.firstName.toLowerCase().includes(filter.toLowerCase()) ||
      item?.lastName.toLowerCase().includes(filter.toLowerCase()) ||
      item?.emailAddress.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={tabValue}
          onChange={(e, newValue) => setTabValue(newValue)}
          aria-label="Form Sharing Tabs"
          variant="fullWidth"
        >
          <Tab label="Activate Data Collectors " />
          <Tab label="Add New Data Collectors" />
        </Tabs>
      </Box>
      <TabPanel>
        <TextField
          label="Filter by Name or Email"
          variant="outlined"
          fullWidth
          value={filter}
          onChange={handleFilterChange}
          mb={2}
        />
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>First Name</TableCell>
                <TableCell>Last Name</TableCell>
                <TableCell>Email Address</TableCell>
                <TableCell>Select</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(rowsPerPage > 0
                ? filteredItems.slice(
                    (page - 1) * rowsPerPage,
                    (page - 1) * rowsPerPage + rowsPerPage
                  )
                : filteredItems
              ).map((item) => (
                <TableRow key={item?.id}>
                  <TableCell>{item?.firstName}</TableCell>
                  <TableCell>{item?.lastName}</TableCell>
                  <TableCell>{item?.emailAddress}</TableCell>
                  <TableCell>
                    <Checkbox
                      checked={
                        tabValue === 0
                          ? selectedActiveUsers.includes(item?.userId)
                          : selectedNewUsers.includes(item?.userId)
                      }
                      onChange={() => handleCheckboxChange(item?.userId)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
          <Pagination
            count={Math.ceil(filteredItems.length / rowsPerPage)}
            page={page}
            onChange={handleChangePage}
            color="primary"
            variant="outlined"
            shape="rounded"
          />
        </Box>

        {tabValue === 0 && (
          <Box sx={{ mt: 2 }}>
            <Button
              variant="outlined"
              color="error"
              onClick={handleRemoveDataCollectors}
              disabled={selectedActiveUsers.length === 0}
            >
              Remove Data Collectors
            </Button>
          </Box>
        )}
        {tabValue === 1 && (
          <Box sx={{ mt: 2 }}>
            <Button
              variant="outlined"
              onClick={handleDataCollectorsForm}
              disabled={selectedNewUsers.length === 0}
            >
              Add Data Collectors
            </Button>
          </Box>
        )}
      </TabPanel>
    </div>
  );
}

function TabPanel(props) {
  const { children } = props;

  return <div>{children}</div>;
}

export default FormDataCollectorsList;
