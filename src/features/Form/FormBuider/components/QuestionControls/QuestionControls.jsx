import React from 'react';
import { IconButton } from '@mui/material';
import { ArrowUpward, ArrowDownward, Delete } from '@mui/icons-material';
import './QuestionControls.css';

const QuestionControls = ({
  formSchema,
  setFormSchema,
  selectedQuestionIndex,
  setSelectedQuestionIndex,
  setIsEditing,
  formId, // Access formId from props
  versionId, // Access versionId from props
}) => {
  const handleDeleteClick = () => {
    const isConfirmed = window.confirm('Are you sure you want to delete this question?');
    if (isConfirmed) {
      const updatedQuestions = formSchema.questions.filter((_, index) => index !== selectedQuestionIndex);
      const updatedFormSchema = {
        ...formSchema,
        questions: updatedQuestions
      };
      setFormSchema(updatedFormSchema);
      setSelectedQuestionIndex(null);

      // Update local storage
      const uniqueKey = `formSchema_${formId}_${versionId}`;
      localStorage.setItem(uniqueKey, JSON.stringify(updatedFormSchema));
    }
  };


  const handleMoveUpClick = () => {
    if (selectedQuestionIndex > 0) {
      const updatedFormSchema = {
        ...formSchema,
        questions: arrayMove(formSchema.questions, selectedQuestionIndex, selectedQuestionIndex - 1)
      };
      setFormSchema(updatedFormSchema);
      setSelectedQuestionIndex(selectedQuestionIndex - 1);
    }
  };

  const handleMoveDownClick = () => {
    if (selectedQuestionIndex < formSchema.questions.length - 1) {
      const updatedFormSchema = {
        ...formSchema,
        questions: arrayMove(formSchema.questions, selectedQuestionIndex, selectedQuestionIndex + 1)
      };
      setFormSchema(updatedFormSchema);
      setSelectedQuestionIndex(selectedQuestionIndex + 1);
    }
  };

  const arrayMove = (arr, oldIndex, newIndex) => {
    const result = Array.from(arr);
    const [removed] = result.splice(oldIndex, 1);
    result.splice(newIndex, 0, removed);
    return result;
  };

  return (
    <div className="question-controls">
      <IconButton
        className="control-btn move-up-btn"
        onClick={handleMoveUpClick}
        disabled={selectedQuestionIndex === 0}
      >
        <ArrowUpward />
      </IconButton>
      <IconButton
        className="control-btn move-down-btn"
        onClick={handleMoveDownClick}
        disabled={selectedQuestionIndex === formSchema.questions.length - 1}
      >
        <ArrowDownward />
      </IconButton>
      <IconButton
        className="control-btn delete-btn"
        onClick={handleDeleteClick}
      >
        <Delete />
      </IconButton>
    </div>
  );
};

export default QuestionControls;
