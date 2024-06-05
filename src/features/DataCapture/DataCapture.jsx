import React, { useState, useEffect, useRef } from 'react';
import './DataCapture.css'; // Import the CSS file
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { getBaseUrl } from '@/features/Common/Utils/apiutils';
import { useAuth } from '@/features/Common/context/AuthContext'; // Adjust the import based on the actual file location

const DataCapture = () => {
  const FormName = "Default";
  const [formSchema, setFormSchema] = useState({ title: { FormName }, questions: [] });
  const [initialFormSchema, setInitialFormSchema] = useState(null);
  const [formId, setFormId] = useState(null);
  const [versionId, setVersionId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [files, setFiles] = useState({});
  
  const { formId: paramFormId } = useParams(); // Changed from projectId to formId
  const { userId } = useAuth(); // Retrieve user ID from AuthContext
  const fileInputRefs = useRef({}); // Create refs for file inputs

  useEffect(() => {
    fetchFormSchema(); // Fetch form schema on component mount
  }, []);

  const fetchFormSchema = async () => {
    try {
      const response = await axios.get(getBaseUrl() + `/Forms/DataCollectionForms/${paramFormId}`);
      const { formId, versionId, jsonContent } = response.data.data;
      const parsedSchema = JSON.parse(jsonContent);
      setFormId(formId);
      setVersionId(versionId);
      setFormSchema(parsedSchema);
      setInitialFormSchema(parsedSchema); // Save the initial schema for resetting
      setLoading(false);
    } catch (error) {
      console.error('Error fetching form schema:', error);
      setLoading(false);
    }
  };

  const handleInputChange = (questionId, event) => {
    const { value, type, checked, files: inputFiles } = event.target;

    if (type === 'file') {
      setFiles((prevFiles) => ({
        ...prevFiles,
        [questionId]: inputFiles[0],
      }));
    } else if (type === 'checkbox') {
      setFormSchema((prevData) => ({
        ...prevData,
        questions: prevData.questions.map((question) => 
          question.id === questionId
            ? { ...question, response: { ...question.response, [event.target.name]: checked } }
            : question
        ),
      }));
    } else {
      setFormSchema((prevData) => ({
        ...prevData,
        questions: prevData.questions.map((question) =>
          question.id === questionId
            ? { ...question, response: value }
            : question
        ),
      }));
    }
  };

  const uploadFile = async (file, questionId) => {
    try {
      const formData = new FormData();
      formData.append('FileData', file);
      formData.append('FormId', formId);
      formData.append('VersionId', versionId);

      const response = await axios.post(getBaseUrl() + '/Forms/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        return response.data.data; // Assuming the response contains the file path or URL
      } else {
        console.error('Failed to upload file');
        return null;
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      return null;
    }
  };

  const handleSubmitForm = async () => {
    setSubmitting(true);

    // Upload files before form submission
    const uploadedFiles = {};
    for (const questionId of Object.keys(files)) {
      const fileUrl = await uploadFile(files[questionId], questionId);
      if (fileUrl) {
        uploadedFiles[questionId] = fileUrl;
      }
    }

    // Update form schema with the uploaded file URLs
    const updatedFormSchema = { ...formSchema };
    updatedFormSchema.questions = updatedFormSchema.questions.map((question) => {
      if (uploadedFiles[question.id]) {
        return { ...question, response: uploadedFiles[question.id] };
      }
      return question;
    });

    try {
      const submissionData = {
        FormId: formId,
        JsonSubmission: JSON.stringify(updatedFormSchema),
        UserId: userId, // Use user ID from AuthContext
        VersionId: versionId,
      };

      const response = await axios.post(getBaseUrl() + '/Forms/submit', submissionData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        console.log('Form submitted successfully');
        Swal.fire({
          title: 'Success!',
          text: 'Form submitted successfully!',
          icon: 'success',
          confirmButtonText: 'OK',
        });
        resetForm(); // Reset form for next submission
      } else {
        console.error('Failed to submit form');
        Swal.fire({
          title: 'Error!',
          text: 'Failed to submit form. Please try again.',
          icon: 'error',
          confirmButtonText: 'OK',
        });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      Swal.fire({
        title: 'Error!',
        text: 'Error submitting form. Please try again.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormSchema(initialFormSchema); // Reset form schema to initial state
    setFiles({});
    // Clear all file inputs
    Object.values(fileInputRefs.current).forEach((input) => {
      if (input) {
        input.value = '';
      }
    });
  };

  if (loading) {
    return <p>Loading form...</p>;
  }

  if (!formSchema) {
    return <p>Form schema not available.</p>;
  }

  return (
    <div className="data-capture-container">
      <div className="data-capture-card">
        <h1>{formSchema.title.FormName}</h1>
        <div>
          {formSchema.questions.map((question) => (
            <div key={question.id} className="form-group">
              <label>{question.label}</label>
              {question.type === 'text' && (
                <input
                  type="text"
                  className="form-control"
                  name={question.identifier}
                  value={question.response || ''}
                  onChange={(event) => handleInputChange(question.id, event)}
                />
              )}
              {question.type === 'select_one' && (
                <select
                  className="form-control"
                  name={question.identifier}
                  value={question.response || ''}
                  onChange={(event) => handleInputChange(question.id, event)}
                >
                  <option value="">Select One</option>
                  {question.options.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              )}
              {question.type === 'select_multiple' && (
                <div>
                  {question.options.map((option, index) => (
                    <div key={index} className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        name={option}
                        checked={(question.response && question.response[option]) || false}
                        onChange={(event) => handleInputChange(question.id, event)}
                      />
                      <label className="form-check-label" htmlFor={`option-${question.id}-${index}`}>
                        {option}
                      </label>
                    </div>
                  ))}
                </div>
              )}
              {question.type === 'integer' && (
                <input
                  type="number"
                  className="form-control"
                  name={question.identifier}
                  value={question.response || ''}
                  onChange={(event) => handleInputChange(question.id, event)}
                />
              )}
              {question.type === 'decimal' && (
                <input
                  type="number"
                  step="0.01"
                  className="form-control"
                  name={question.identifier}
                  value={question.response || ''}
                  onChange={(event) => handleInputChange(question.id, event)}
                />
              )}
              {question.type === 'range' && (
                <div>
                  <input
                    type="range"
                    className="form-control-range"
                    name={question.identifier}
                    min={question.minValue}
                    max={question.maxValue}
                    value={question.response || ''}
                    onChange={(event) => handleInputChange(question.id, event)}
                  />
                  <span className="range-values">
                    Min: {question.minValue} | Max: {question.maxValue}
                  </span>
                </div>
              )}
              {question.type === 'geopoint' && (
                <div>
                  <input
                    type="text"
                    className="form-control mb-2"
                    placeholder="Latitude"
                    name="latitude"
                    value={(question.response && question.response.latitude) || ''}
                    onChange={(event) => handleInputChange(question.id, event)}
                  />
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Longitude"
                    name="longitude"
                    value={(question.response && question.response.longitude) || ''}
                    onChange={(event) => handleInputChange(question.id, event)}
                  />
                </div>
              )}
              {question.type === 'date' && (
                <input
                  type="date"
                  className="form-control"
                  name={question.identifier}
                  value={question.response || ''}
                  onChange={(event) => handleInputChange(question.id, event)}
                />
              )}
              {['image', 'audio', 'video', 'file'].includes(question.type) && (
                <input
                  type="file"
                  accept={`${
                    question.type === 'image'
                      ? 'image/*'
                      : question.type === 'audio'
                      ? 'audio/*'
                      : question.type === 'video'
                      ? 'video/*'
                      : '*'
                  }`}
                  className="form-control-file"
                  name={question.identifier}
                  onChange={(event) => handleInputChange(question.id, event)}
                  ref={(el) => (fileInputRefs.current[question.id] = el)} // Attach ref
                />
              )}
            </div>
          ))}
        </div>
        <button disabled={submitting} onClick={handleSubmitForm}>
          {submitting ? 'Submitting...' : 'Submit'}
        </button>
      </div>
    </div>
  );
};

export default DataCapture;
