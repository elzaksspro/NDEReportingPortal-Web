import React from 'react';
import './FormTabs.css'; // Import generated CSS for Material Design styling

const FormTabs = ({ currentTab, toggleTab }) => {
  return (
    <ul className="mdc-tab-bar" role="tablist">
      <li className="mdc-tab">
        <button
          className={`mdc-tab__link ${currentTab === 'formDesigner' ? 'mdc-tab--active' : ''}`}
          onClick={() => toggleTab('formDesigner')}
          role="tab"
          aria-selected={currentTab === 'formDesigner'}
        >
          <span className="mdc-tab__ripple"></span>
          <span className="mdc-tab__text-label">Form Designer</span>
        </button>
      </li>
      <li className="mdc-tab">
        <button
          className={`mdc-tab__link ${currentTab === 'formPreview' ? 'mdc-tab--active' : ''}`}
          onClick={() => toggleTab('formPreview')}
          role="tab"
          aria-selected={currentTab === 'formPreview'}
        >
          <span className="mdc-tab__ripple"></span>
          <span className="mdc-tab__text-label">Form Preview</span>
        </button>
      </li>
    </ul>
  );
};

export default FormTabs;
