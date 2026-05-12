import React from 'react';
import './styles/BreadcrumNavbar.css'; // Ensure the correct path for styles

const BreadcrumbNavbar = ({ currentPage, breadcrumbs }) => {
  return (
    <div className="breadcrumb-navbar">
      <div className="breadcrumb-left">
        <h2>{currentPage}</h2>
      </div>
      <div className="breadcrumb-right">
        {breadcrumbs.map((breadcrumb, index) => (
          <span key={index} className="breadcrumb-item">
            {breadcrumb.link ? (
              <a href={breadcrumb.link}>{breadcrumb.label}</a> // Dynamic link
            ) : (
              <span>{breadcrumb.label}</span>
            )}
            {index < breadcrumbs.length - 1 && <span className="breadcrumb-separator">/</span>}
          </span>
        ))}
      </div>
    </div>
  );
};

export default BreadcrumbNavbar;