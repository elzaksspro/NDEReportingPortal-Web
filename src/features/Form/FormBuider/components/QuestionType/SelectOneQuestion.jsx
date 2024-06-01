import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash, faSave, faEdit } from '@fortawesome/free-solid-svg-icons';

const SelectOneQuestion = ({ 
    question,
    questionIndex,
    formSchema,
    updateQuestionDetails
}) => {
    const [label, setLabel] = useState(question.label);
    const [identifier, setIdentifier] = useState(question.identifier);
    const [newOption, setNewOption] = useState('');
    const [options, setOptions] = useState([]);
    const [isEditing, setIsEditing] = useState(true); // Flag to control edit mode
    const [labelError, setLabelError] = useState(null); // State for label validation error
    const [identifierError, setIdentifierError] = useState(null); // State for identifier validation error

    useEffect(() => {
        // Assuming formSchema has a questions array
        const question = formSchema.questions?.[questionIndex];
        if (question) {
            setIdentifier(question.identifier);
            setLabel(question.label);
            setOptions(question.options || []);
            setIsEditing(false);

        }
    }, [formSchema, questionIndex]);

    const handleAddOption = () => {
        if (!newOption.trim()) return;
        setOptions([...options, newOption]);
        setNewOption('');
    };

    const handleDeleteOption = (optionIndex) => {
        setOptions(options.filter((_, idx) => idx !== optionIndex));
    };

    const handleSave = () => {
        if (options.length === 0) {
            alert('Please provide at least one option.'); // Display an alert if no options are provided
            return;
        }

        // Validate label
        if (!label.trim()) {
            setLabelError('Label is required.');
            return;
        } else {
            setLabelError(null);
        }

        // Validate identifier
        if (!identifier.trim()) {
            setIdentifierError('Identifier is required.');
            return;
        } else {
            setIdentifierError(null);
        }

        setIsEditing(false); // Exit edit mode

        // Update question details
        const newDetails = {
            label: label,
            identifier: identifier,
            options: options
        };
        updateQuestionDetails(questionIndex, newDetails);
    };

    const handleEdit = () => {
        setIsEditing(true); // Enter edit mode
    };

    return (
        <div className="select-one-question-editor">
            
            <div className="icon-container">
                <p className="btn btn-icon" style={{ color: 'green', marginLeft: '0' }}>
                    <span className="bi bi-ui-radios-grid"></span>
                    Select One Options    
                </p>
            </div>


            <div className="form-group">
                <label> Label:</label>
                <input
                    type="text"
                    className="form-control"
                    value={label}
                    onChange={(e) => setLabel(e.target.value)}
                    disabled={!isEditing} // Disable input when not editing
                />
                {labelError && <div className="text-danger">{labelError}</div>} {/* Display label error message */}
            </div>

            <div className="form-group">
                <label>Identifier:</label>
                <input
                    type="text"
                    className="form-control"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    disabled={!isEditing} // Disable input when not editing
                />
                {identifierError && <div className="text-danger">{identifierError}</div>} {/* Display identifier error message */}
            </div>

            <div className="form-group">
                <label>Options:</label>
                <div className="input-group mb-2">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Add new option"
                        value={newOption}
                        onChange={(e) => setNewOption(e.target.value)}
                        disabled={!isEditing} // Disable input when not editing
                    />
                    <div className="input-group-append">
                        <button className="btn btn-outline-primary" type="button" onClick={handleAddOption} disabled={!isEditing}>
                            <FontAwesomeIcon icon={faPlus} />
                        </button>
                    </div>
                </div>
                <ul className="list-group">
                    {options.map((option, index) => (
                        <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                            {option}
                            <p onClick={() => handleDeleteOption(index)} disabled={!isEditing}
                            style={{ color: 'red', cursor: 'pointer' }} // Apply red color and change cursor to pointer

                            >
                                <FontAwesomeIcon icon={faTrash} />
                            </p>
                        </li>
                    ))}
                </ul>
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

export default SelectOneQuestion;
