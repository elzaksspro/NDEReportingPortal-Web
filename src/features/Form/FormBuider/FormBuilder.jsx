import React from 'react';
import { useState, useEffect } from 'react';

import './FormBuilder.css';
import { Grid, Button } from '@mui/material';
import { AddWidgets, FormTabs, FormPreview, FormDesigner } from '.';
import questionWidgets from './constants/QuestionWidgets';
import { useCurrentTab, useFormSchema } from './Hook/UseForm';
import Swal from 'sweetalert2'; // Import SweetAlert
import axios from 'axios'; // Import Axios for API calls
import { getBaseUrl } from '@/features/Common/Utils/apiutils';
import { useAuth } from '@/features/Common/context/AuthContext';
import { FormChangeType } from './constants/FormChangeType'; // Import the FormChangeType enum

const FormBuilder = ({ formVersion }) => { // Receive formVersion object as prop
  const { userId } = useAuth();


  const [currentTab, setCurrentTab] = useCurrentTab();
  const [formSchema, setFormSchema, selectedQuestionIndex, setSelectedQuestionIndex, addNewQuestion, updateQuestionDetails] = useFormSchema(formVersion.form.name, formVersion.formId, formVersion.id);


  useEffect(() => {
    const uniqueKey = `formSchema_${formVersion.formId}_${formVersion.id}`;
    const storedSchema = localStorage.getItem(uniqueKey);

    // Load schema from local storage (if available)
    if (storedSchema) {
      //setFormSchema(JSON.parse(storedSchema));

      const parsedContent = JSON.parse(storedSchema);


      setFormSchema({
        //...parsedContent,
        title: parsedContent.title,
        questions: Array.isArray(parsedContent.questions) ? parsedContent.questions : [],

        
      });

      
    }
    else{
     

      const parsedContent = JSON.parse(formVersion.jsonContent);



      setFormSchema({
      //  ...parsedContent,
      title: formVersion.form.name,
      questions: Array.isArray(parsedContent.questions) ? parsedContent.questions : [],
      });
    }

    // Update local storage whenever the form schema changes (excluding initial load)
  //}, [formVersion.formId, formVersion.id]);
}, [formVersion.formId, formVersion.id, setFormSchema, formVersion.jsonContent, formVersion.form.name]);




  const handleSaveAsNewVersion = async () => {
    const changeTypeOptions = Object.keys(FormChangeType).map((key) => ({
      value: FormChangeType[key],
      label: key,
    }));

    const { value: changeLogAndType } = await Swal.fire({
      title: 'Save as New Version',
      html:
        '<input id="swal-input1" class="swal2-input" placeholder="Enter change log...">' +
        '<select id="swal-input2" class="swal2-select">' +
        changeTypeOptions
          .map((option) => `<option value="${option.value}">${option.label}</option>`)
          .join('') +
        '</select>',
      focusConfirm: false,
      preConfirm: () => {
        return [
          document.getElementById('swal-input1').value,
          document.getElementById('swal-input2').value,
        ];
      },
      inputValidator: (value) => {
        if (!value[0]) {
          return 'Change log is required';
        }
        if (!value[1]) {
          return 'Change type is required';
        }
      },
    });

    if (changeLogAndType) {
      const [changeLog, changeType] = changeLogAndType;
      try {
        await axios.post(getBaseUrl() + '/Forms/savenewformversion', {
          formId: formVersion.formId,
          creatorId: userId,
          ChangeLog: changeLog,
          JsonContent: JSON.stringify(formSchema),
          ChangeType: parseInt(changeType), // Change type based on user selection
        });
        Swal.fire('Success', 'Form version saved successfully', 'success');
      } catch (error) {
        console.error('Error saving form version:', error);
        Swal.fire('Error', 'Failed to save form version', 'error');
      }
    }
  };

  const handleUpdateVersion = async () => {
    const defaultChangeLog = 'Updated the form version without any specific changes.';

    try {
      await axios.post(getBaseUrl() + '/Forms/updateformversion', {
        VersionId: formVersion.id,
        ChangeLog: defaultChangeLog,
        JsonContent: JSON.stringify(formSchema),
      });
      Swal.fire('Success', 'Form version updated successfully', 'success');
    } catch (error) {
      console.error('Error updating form version:', error);
      Swal.fire('Error', 'Failed to update form version', 'error');
    }
  };
  return (
    <div className="form-builder-container">
      <Grid container spacing={2}>
        <Grid item xs={12} md={2}>
          <AddWidgets questionWidgets={questionWidgets} addNewQuestion={addNewQuestion} />
        </Grid>
        <Grid item xs={12} md={10}>
          <FormTabs currentTab={currentTab} toggleTab={setCurrentTab} />
          <div className="tab-content">
            {formSchema && ( // Conditionally render FormDesigner if formSchema is loaded
              <FormDesigner
                currentTab={currentTab}
                formSchema={formSchema}
                setFormSchema={setFormSchema}
                selectedQuestionIndex={selectedQuestionIndex}
                setSelectedQuestionIndex={setSelectedQuestionIndex}
                updateQuestionDetails={updateQuestionDetails}
                formId={formVersion.formId}
                versionId={formVersion.id}
              />
            )}



            {formSchema && ( // Conditionally render FormPreview if formSchema is loaded
              <FormPreview currentTab={currentTab} formSchema={formSchema} />
            )}
          </div>
        </Grid>
      </Grid>
      <div className="button-container">
        <Button variant="outlined" size="small" onClick={handleUpdateVersion}>Update Current Version</Button>
        <Button variant="outlined" size="small" onClick={handleSaveAsNewVersion}>Save as New Version</Button>
      </div>
    </div>
  );
};

export default FormBuilder;
