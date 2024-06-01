// QuestionEditor.js
import React from 'react';
import TextQuestion from '../QuestionType/TextQuestion';
import SelectOneQuestion from '../QuestionType/SelectOneQuestion';
import SelectMultipleQuestion from '../QuestionType/SelectMultipleQuestion';
import IntegerQuestion from '../QuestionType/IntegerQuestion';
import DecimalQuestion from '../QuestionType/DecimalQuestion';
import RangeQuestion from '../QuestionType/RangeQuestion';
import GeopointQuestion from '../QuestionType/GeopointQuestion';
import DateQuestion from '../QuestionType/DateQuestion';
import ImageQuestion from '../QuestionType/ImageQuestion';
import AudioQuestion from '../QuestionType/AudioQuestion';
import VideoQuestion from '../QuestionType/VideoQuestion';
import FileQuestion from '../QuestionType/FileQuestion';

const QuestionEditor = ({ question, isSelected,selectedQuestionIndex, formSchema, updateQuestionDetails }) => {
  const renderQuestionComponent = () => {
    switch (question.type) {
      case 'text':
        return <TextQuestion 
        question={question}  
        questionIndex={selectedQuestionIndex}
        formSchema={formSchema} 
        updateQuestionDetails={updateQuestionDetails}
         />;
      case 'select_one':
        return <SelectOneQuestion
        question={question}  
        questionIndex={selectedQuestionIndex}
        formSchema={formSchema} 
        updateQuestionDetails={updateQuestionDetails}
        />;
      case 'select_multiple':
        return <SelectMultipleQuestion 
        question={question}  
        questionIndex={selectedQuestionIndex}
        formSchema={formSchema} 
        updateQuestionDetails={updateQuestionDetails}

        />;
      case 'integer':
        return <IntegerQuestion 
        question={question}  
        questionIndex={selectedQuestionIndex}
        formSchema={formSchema} 
        updateQuestionDetails={updateQuestionDetails}
        />;
      case 'decimal':
        return <DecimalQuestion 
        question={question}  
        questionIndex={selectedQuestionIndex}
        formSchema={formSchema} 
        updateQuestionDetails={updateQuestionDetails}
        />;
      case 'range':
        return <RangeQuestion 
        question={question}  
        questionIndex={selectedQuestionIndex}
        formSchema={formSchema} 
        updateQuestionDetails={updateQuestionDetails}
        />;
      case 'geopoint':
        return <GeopointQuestion 
        
        question={question}  
        questionIndex={selectedQuestionIndex}
        formSchema={formSchema} 
        updateQuestionDetails={updateQuestionDetails}
        />;
      case 'date':
        return <DateQuestion 
        question={question}  
        questionIndex={selectedQuestionIndex}
        formSchema={formSchema} 
        updateQuestionDetails={updateQuestionDetails}
        />;
      case 'image':
        return <ImageQuestion 
        question={question}  
        questionIndex={selectedQuestionIndex}
        formSchema={formSchema} 
        updateQuestionDetails={updateQuestionDetails}
        />;
      case 'audio':
        return <AudioQuestion 
        question={question}  
        questionIndex={selectedQuestionIndex}
        formSchema={formSchema} 
        updateQuestionDetails={updateQuestionDetails}
        />;
      case 'video':
        return <VideoQuestion 
        question={question}  
        questionIndex={selectedQuestionIndex}
        formSchema={formSchema} 
        updateQuestionDetails={updateQuestionDetails}
        />;
      case 'file':
        return <FileQuestion 
        
        question={question}  
        questionIndex={selectedQuestionIndex}
        formSchema={formSchema} 
        updateQuestionDetails={updateQuestionDetails}
        />;
   
     
      default:
        return null;
    }
  };

  return (
    <div className={`question-editor ${isSelected ? 'selected' : ''}`}>
      <h3>{question.title}</h3>
      {renderQuestionComponent()}
    </div>
  );
};

export default QuestionEditor;
