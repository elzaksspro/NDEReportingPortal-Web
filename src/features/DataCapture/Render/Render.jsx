import React, { useState } from 'react';
import './Render.css'; // Import CSS for FormPreview component

const Render = ({ formSchema, currentTab }) => {
  // State to hold responses for each question
  const [responses, setResponses] = useState({});


  // Function to handle input change and update responses
  const handleInputChange = (index, event) => {
    const { value, type, checked } = event.target;

    // Update the response object based on input type
    if (type === 'checkbox') {
      const currentResponse = responses[index] || [];
      let updatedResponse;
      if (checked) {
        updatedResponse = [...currentResponse, value];
      } else {
        updatedResponse = currentResponse.filter((item) => item !== value);
      }
      setResponses({ ...responses, [index]: updatedResponse });
    } else {
      setResponses({ ...responses, [index]: value });
    }
  };

  return (
    <div className={`tab-pane ${currentTab === 'formPreview' ? 'active' : ''}`}>
      <h6 className="form-preview-title"> Preview Mode</h6>
      <div className="preview-question-container">
        {formSchema.questions.map((question, index) => (
          <div key={index} className="card mb-2 preview-question-card">
            <div className="card-body">
              <h5 className="card-title">{question.label}</h5>
              {question.type === 'text' && (
                <input
                  type="text"
                  className="form-control"
                  placeholder="Type your answer here"
                  value={responses[index] || ''}
                  onChange={(event) => handleInputChange(index, event)}
                />
              )}
              {question.type === 'select_one' && (
                <select
                  className="form-control"
                  value={responses[index] || ''}
                  onChange={(event) => handleInputChange(index, event)}
                >
                  <option value="">Select One</option>
                  {question.options.map((option, optionIndex) => (
                    <option key={optionIndex} value={option}>{option}</option>
                  ))}
                </select>
              )}
              {question.type === 'select_multiple' && (
                <div>
                  {question.options.map((option, optionIndex) => (
                    <div key={optionIndex} className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        value={option}
                        id={`option-${index}-${optionIndex}`}
                        checked={(responses[index] || []).includes(option)}
                        onChange={(event) => handleInputChange(index, event)}
                      />
                      <label className="form-check-label" htmlFor={`option-${index}-${optionIndex}`}>{option}</label>
                    </div>
                  ))}
                </div>
              )}
              {question.type === 'integer' && (
                <input
                  type="number"
                  className="form-control"
                  placeholder="Enter an integer"
                  value={responses[index] || ''}
                  onChange={(event) => handleInputChange(index, event)}
                />
              )}
              {question.type === 'decimal' && (
                <input
                  type="number"
                  step="0.01"
                  className="form-control"
                  placeholder="Enter a decimal number"
                  value={responses[index] || ''}
                  onChange={(event) => handleInputChange(index, event)}
                />
              )}
           
              {question.type === 'range' && (
                <div>
                <input
                  type="range"
                  className="form-control-range"
                  min={question.minValue}
                  max={question.maxValue}
                  value={responses[index] || ''}
                  onChange={(event) => handleInputChange(index, event)}
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
                    value={(responses[index] && responses[index][0]) || ''}
                    onChange={(event) => handleInputChange(index, event)}
                  />
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Longitude"
                    value={(responses[index] && responses[index][1]) || ''}
                    onChange={(event) => handleInputChange(index, event)}
                  />
                </div>
              )}
              {question.type === 'date' && (
                <input
                  type="date"
                  className="form-control"
                  value={responses[index] || ''}
                  onChange={(event) => handleInputChange(index, event)}
                />
              )}
              {['image', 'audio', 'video', 'file'].includes(question.type) && (
                <input
                  type="file"
                  accept={`${
                    question.type === 'image' ? 'image/*' :
                    question.type === 'audio' ? 'audio/*' :
                    question.type === 'video' ? 'video/*' :
                    '*'
                  }`}
                  className="form-control-file"
                  onChange={(event) => handleInputChange(index, event)}
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Render;
