import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faEdit } from '@fortawesome/free-solid-svg-icons';

const TextQuestion = ({ 
    question,
    questionIndex,
    formSchema,
    updateQuestionDetails
}) => {
    const [label, setLabel] = useState(question.label);
    const [identifier, setIdentifier] = useState(question.identifier);
    const [labelError, setLabelError] = useState(null);
    const [identifierError, setIdentifierError] = useState(null);
    const [isEditing, setIsEditing] = useState(true); // Flag to control edit mode

    useEffect(() => {
        const question = formSchema.questions?.[questionIndex];
        if (question) {
            setLabel(question.label);
            setIdentifier(question.identifier || '');
            setIsEditing(false);

        }
    }, [formSchema, questionIndex]);

    const handleSave = () => {
        if (!validateInputs()) return; // Check for validation errors before saving
        const newDetails = {
            label: label,
            identifier: identifier,
        };
        updateQuestionDetails(questionIndex, newDetails);
        setIsEditing(false); // Exit edit mode
    };

    const validateInputs = () => {
        let isValid = true;
        // Validate label
        if (!label.trim()) {
            setLabelError('Question Label is required');
            isValid = false;
        } else {
            setLabelError(null);
        }
        // Validate identifier (assuming alphanumeric)
        if (!identifier.trim() || !/^[a-zA-Z0-9]+$/.test(identifier)) {
            setIdentifierError('Identifier must be alphanumeric');
            isValid = false;
        } else {
            setIdentifierError(null);
        }
        return isValid;
    };

    const handleEdit = () => {
        setIsEditing(true); // Enter edit mode
    };

    return (
        <div className="text-question-editor">
            {/* ... other elements */}

            <div className="form-group">
                <label>Question Label:</label>
                <input
                    type="text"
                    className="form-control"
                    value={label}
                    onChange={(e) => setLabel(e.target.value)}
                    disabled={!isEditing}
                />
                {labelError && <div className="text-danger">{labelError}</div>}
            </div>

            <div className="form-group">
                <label>Identifier:</label>
                <input
                    type="text"
                    className="form-control"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    disabled={!isEditing}
                />
                {identifierError && <div className="text-danger">{identifierError}</div>}
            </div>

            {/* Wrap the buttons in a container */}
            {isEditing ? (
                <button className="btn btn-primary mr-2 save-button" onClick={handleSave}>
                    <FontAwesomeIcon icon={faSave} /> Save
                </button>
            ) : (
                <button className="btn btn-secondary mr-2 edit-button" onClick={handleEdit}>
                    <FontAwesomeIcon icon={faEdit} /> Edit
                </button>
            )}
        </div>
    );
};

export default TextQuestion;
