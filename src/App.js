import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { AuthProvider, useAuth } from './features/Common/context/AuthContext';

import PrivateRoute from './features/Auth/components/PrivateRoute/PrivateRoute';

import {TopNavBar,Sidebar,Footer} from './features/Common';
import {Login, ForgetPassword,ResetPassword} from './features/Auth';
import {ActivateProfile,UpdateProfile} from './features/Profile';
import {DepartmentManagement} from './features/Department';
import {FormManagement,CreateForm,EditForm,FormDetails} from './features/Form';

import {SubmissionManagement,} from './features/Submission';


import { UserManagement, CreateUser, UserEdit } from './features/User';
import MainLayout from './MainLayout'; // Import MainLayout from the separate file

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
         

          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgetPassword />} />

          <Route path="/reset-password" element={<ResetPassword />} />


          <Route path="/activate" element={<ActivateProfile />} />



          <Route path="/profile/update/:userId" element=
          {<PrivateRoute><MainLayout><UpdateProfile /></MainLayout></PrivateRoute>} />
                      
          <Route path="/" element={<PrivateRoute><MainLayout><SubmissionManagement /></MainLayout></PrivateRoute>} />


          <Route path="/submissions" element={<PrivateRoute><MainLayout><SubmissionManagement /></MainLayout></PrivateRoute>} />

          <Route path="/forms" element={<PrivateRoute><MainLayout><FormManagement /></MainLayout></PrivateRoute>} />
          <Route path="forms/create" element={<PrivateRoute><MainLayout><CreateForm /></MainLayout></PrivateRoute>} />
          <Route path="forms/edit/:formId" element={<PrivateRoute><MainLayout><EditForm /></MainLayout></PrivateRoute>} />
          <Route path="forms/form-details/:formId" element={<PrivateRoute><MainLayout><FormDetails /></MainLayout></PrivateRoute>} />
         
         

          

          <Route path="/users" element={<PrivateRoute><MainLayout><UserManagement /></MainLayout></PrivateRoute>} />
          <Route path="/users/create" element={<PrivateRoute><MainLayout><CreateUser/></MainLayout></PrivateRoute>} />
          <Route path="/users/edit/:userId" element={<PrivateRoute><MainLayout><UserEdit /></MainLayout></PrivateRoute>} />

          
         

          <Route path="/department" element={<PrivateRoute><MainLayout><DepartmentManagement /></MainLayout></PrivateRoute>} />

          

       
          {/* Define other protected routes similarly */}
        </Routes>
      

      </Router>
    </AuthProvider>
  );
}

export default App;
