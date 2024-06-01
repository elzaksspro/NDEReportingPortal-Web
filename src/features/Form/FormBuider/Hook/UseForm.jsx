import { useState, useEffect } from 'react';
import questionDefaults from '../constants/QuestionDefaults'
import { v4 as uuidv4 } from 'uuid'; // Import UUID library

// Custom hook for managing current tab

export const useCurrentTab = () => {
  const [currentTab, setCurrentTab] = useState('formDesigner');
  return [currentTab, setCurrentTab];
};

// Custom hook for managing form schema
export const useFormSchema = (FormName, formId, versionId) => {
  const [formSchema, setFormSchema] = useState({ title: {FormName}, questions: [] });

  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(null);

 



   // Function to update question details
   const updateQuestionDetails = (index, details) => {


    if (index < 0 || index >= formSchema.questions.length) {
        console.error('Invalid question index for update');
        return;
    }
    

    // Check if details object contains any new details
  if (Object.keys(details).length === 0) {
    console.error('No new details provided for update');
    return;
  }

  // Update the question at the specified index
  const updatedQuestions = [...formSchema.questions];

  updatedQuestions[index] = { ...updatedQuestions[index], ...details };



  /** 
    const updatedQuestions = formSchema.questions.map((question, idx) => {
        if (idx === index) {
          console.log("Index")

            // Merge existing question details with the new details
            return { ...question, ...details };
        }

        
        return question;
    });
*/
    const updatedSchema = { ...formSchema, questions: updatedQuestions }; // Assuming updatedQuestions is populated within the function

  // Save the updated schema to local storage directly
  const uniqueKey = `formSchema_${formId}_${versionId}`;
 
  localStorage.setItem(uniqueKey, JSON.stringify(updatedSchema));


  // Optionally, update the state to reflect the changes
  setFormSchema(updatedSchema);



};


  const addNewQuestion = (
    type   
  ) => {
    const newQuestion = {
        //id: `q${formSchema.questions.length + 1}`,
        id: uuidv4(), // Generate a unique ID for the new question

        type,
        ...questionDefaults[type],
        relevant: "",
        options: [], // Ensure this is always an array
        response: "", // Include the response property initialized with an empty string

        skipLogic: {
            conditions: [],
            actions: []

          
        }
    };

   
        setFormSchema(prevSchema => ({
            ...prevSchema,
            questions: [...prevSchema.questions, newQuestion]
        }));
     
        setSelectedQuestionIndex(formSchema.questions.length);
    
  };

  return [
    formSchema, 
    setFormSchema,
    selectedQuestionIndex, 
    setSelectedQuestionIndex,
    addNewQuestion,
    updateQuestionDetails, // Make sure to return the new function

    
  
  ];
};


