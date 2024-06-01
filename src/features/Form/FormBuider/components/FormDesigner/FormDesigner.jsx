import React, { useEffect } from 'react';

import QuestionEditor from '../QuestionEditor/QuestionEditor';
import QuestionControls from '../QuestionControls/QuestionControls';
import './FormDesigner.css'; // Import CSS for FormDesigner component

const FormDesigner = ({
  currentTab,
  formSchema,
  setFormSchema,
  selectedQuestionIndex,
  setSelectedQuestionIndex,
  updateQuestionDetails,
  formId, // Access formId from props
  versionId, // Access versionId from props
}) => {


 
  
  return (
    
    <div className={`tab-pane ${currentTab === 'formDesigner' ? 'active' : ''}`}>
               

      <h6 className="form-designer-title">Designer Mode</h6>

      <div className="question-cards-container">
        {formSchema.questions.map((question, index) => (
          <div key={index} className="question-card">
            <div className="card-body">
              <QuestionEditor

                question={question}
                isSelected={index === selectedQuestionIndex}
                formSchema={formSchema}
                updateQuestionDetails={updateQuestionDetails}
                selectedQuestionIndex={index}
              


              />

           
                <QuestionControls

                  formSchema={formSchema}
                  selectedQuestionIndex={index}
                  setFormSchema={setFormSchema}
                  setSelectedQuestionIndex={setSelectedQuestionIndex}
                  formId={formId} // Pass formId as prop
                  versionId={versionId} // Pass versionId as prop
                />
        
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default FormDesigner;
