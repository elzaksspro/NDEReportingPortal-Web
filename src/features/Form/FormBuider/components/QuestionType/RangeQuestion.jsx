import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faEdit } from '@fortawesome/free-solid-svg-icons';

const RangeQuestion = ({ 
    question,
    questionIndex,
    formSchema,
    updateQuestionDetails,
    max,
    min
}) => {
    const [label, setLabel] = useState(question.label);
    const [identifier, setIdentifier] = useState(question.identifier);
    const [minValue, setMinValue] = useState(min || 0);
    const [maxValue, setMaxValue] = useState(max || 100);
    const [minValueError, setMinValueError] = useState(null);
    const [maxValueError, setMaxValueError] = useState(null);
    const [isEditing, setIsEditing] = useState(true);

    useEffect(() => {
        const question = formSchema.questions?.[questionIndex];
        if (question) {
            setLabel(question.label);
            setIdentifier(question.identifier || '');
            setMinValue(min || question.minValue || 0);
            setMaxValue(max || question.maxValue || 100);
            setIsEditing(false);

        }
    }, [formSchema, questionIndex, max, min]);

    const handleSave = () => {
        if (!validateInputs()) return; // Check for validation errors before saving
        const newDetails = {
            label: label,
            identifier: identifier,
            minValue: minValue,
            maxValue: maxValue
        };

        updateQuestionDetails(questionIndex, newDetails);
        setIsEditing(false);
    };

    const validateInputs = () => {
        let isValid = true;
        // Validate minValue
        if (minValue >= maxValue) {
            setMinValueError('Min value must be less than max value');
            isValid = false;
        } else {
            setMinValueError(null);
        }
        // Validate maxValue
        if (maxValue <= minValue) {
            setMaxValueError('Max value must be greater than min value');
            isValid = false;
        } else {
            setMaxValueError(null);
        }
        return isValid;
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    return (
        <div className="range-question-editor">
            <div className="icon-container">
                <p className="btn btn-icon" style={{ color: 'green', marginLeft: '0' }}>
                    <span className="bi bi-sliders"></span>
                    Range   
                </p>
            </div>

            <div className="form-group">
                <label>Question Label:</label>
                <input
                    type="text"
                    className="form-control"
                    value={label}
                    onChange={(e) => setLabel(e.target.value)}
                    disabled={!isEditing}
                />
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
            </div>

            <div className="form-group">
                <label>Min Value:</label>
                <input
                    type="number"
                    className="form-control"
                    value={minValue}
                    onChange={(e) => setMinValue(parseInt(e.target.value))}
                    disabled={!isEditing}
                />
                {minValueError && <div className="text-danger">{minValueError}</div>}
            </div>

            <div className="form-group">
                <label>Max Value:</label>
                <input
                    type="number"
                    className="form-control"
                    value={maxValue}
                    onChange={(e) => setMaxValue(parseInt(e.target.value))}
                    disabled={!isEditing}
                />
                {maxValueError && <div className="text-danger">{maxValueError}</div>}
            </div>

            {isEditing ? (
                <button className="btn btn-primary mr-2" onClick={handleSave}>
                    <FontAwesomeIcon icon={faSave} /> Save
                </button>
            ) : (
                <button className="btn btn-secondary mr-2" onClick={handleEdit}>
                    <FontAwesomeIcon icon={faEdit} /> Edit
                </button>
            )}
        </div>
    );
};

export default RangeQuestion;
