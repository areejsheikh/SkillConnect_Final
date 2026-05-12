import React from 'react';
import styles from './styles/HowItWorks.css';
import { FaUserPlus, FaFileUpload, FaSearch, FaCheckCircle } from 'react-icons/fa';

// Individual SVG components for each arrow
const Arrow1 = () => (
  <svg className="hiw-svg" style={{ left: '45px' }} viewBox="0 0 1000 300" preserveAspectRatio="none">
    <defs>
      <marker id="arrow1" markerWidth="7" markerHeight="7" refX="7" refY="3.5" orient="auto" markerUnits="strokeWidth">
        <path d="M0,0 L0,7 L7,3.5 z" fill="#007bff" />
      </marker>
    </defs>
    <path
      d="M 150 100 C 200 0, 250 0, 300 100"
      stroke="#007bff" /* Changed to blue */
      strokeWidth="3"
      strokeDasharray="6,6"
      fill="none"
      markerEnd="url(#arrow1)"
    />
  </svg>
);

const Arrow2 = () => (
  <svg className="hiw-svg" style={{ left: '273px' }} viewBox="0 0 1000 300" preserveAspectRatio="none">
    <defs>
      <marker id="arrow2" markerWidth="7" markerHeight="7" refX="7" refY="3.5" orient="auto" markerUnits="strokeWidth">
        <path d="M0,0 L0,7 L7,3.5 z" fill="#007bff" />
      </marker>
    </defs>
    <path
      d="M 150 100 C 200 200, 250 200, 300 100"
      stroke="#007bff" /* Changed to blue */
      strokeWidth="3"
      strokeDasharray="6,6"
      fill="none"
      markerEnd="url(#arrow2)"
    />
  </svg>
);

const Arrow3 = () => (
  <svg className="hiw-svg" style={{ left: '510px' }} viewBox="0 0 1000 300" preserveAspectRatio="none">
    <defs>
      <marker id="arrow3" markerWidth="7" markerHeight="7" refX="7" refY="3.5" orient="auto" markerUnits="strokeWidth">
        <path d="M0,0 L0,7 L7,3.5 z" fill="#007bff" />
      </marker>
    </defs>
    <path
      d="M 150 100 C 200 0, 250 0, 300 100"
      stroke="#007bff" /* Changed to blue */
      strokeWidth="3"
      strokeDasharray="6,6"
      fill="none"
      markerEnd="url(#arrow3)"
    />
  </svg>
);

const steps = [
  { icon: <FaUserPlus />, title: 'Create account', desc: 'Create your account and complete your profile with relevant details.' },
  { icon: <FaFileUpload />, title: 'Upload CV/Resume', desc: 'Upload your updated resume in a few clicks.' },
  { icon: <FaSearch />, title: 'Find suitable job', desc: 'Use our search to find jobs that match your skills and interests.' },
  { icon: <FaCheckCircle />, title: 'Apply job', desc: 'Submit applications directly through our platform.' }
];

const HowItWorks = () => {
  return (
    <section className="hiw-section">
      <h2 className="hiw-heading">How Skill Connect works</h2>

      <div className="hiw-visual">
        {/* Separate SVG components for each arrow */}
        <Arrow1 />
        <Arrow2 />
        <Arrow3 />

        <div className="hiw-steps">
          {steps.map((step, index) => (
            <div key={index} className="hiw-step">
              <div className="hiw-circle">{step.icon}</div>
              <h4 className="hiw-title">{step.title}</h4>
              <p className="hiw-desc">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;