import React from 'react';
import './styles/ProviderProfileManage.css';

const ProviderProfileManageForm = () => {
  return (
    <form className="provider-profile-form">
      <div className="form-row">
        <div className="form-group">
          <label>First Name</label>
          <input type="text" defaultValue="Ayan" />
          <i className="fas fa-pen icon-input"></i>
        </div>
        <div className="form-group">
          <label>Last Name</label>
          <input type="text" defaultValue="Haseeb" />
          <i className="fas fa-pen icon-input"></i>
        </div>
      </div>

      <div className="form-group">
        <label>Email</label>
        <input type="email" defaultValue="ayanHaseeb.business@gmail.com" />
        <i className="fas fa-pen icon-input"></i>
      </div>

      <div className="form-group">
        <label>Postal Address</label>
        <input type="text" defaultValue="7675, Allama Iqbal Town" />
        <i className="fas fa-pen icon-input"></i>
      </div>

      <div className="form-group">
        <label>Contact Number</label>
        <input type="text" defaultValue="042-11244622" />
        <i className="fas fa-pen icon-input"></i>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>City</label>
          <select defaultValue="Lahore">
            <option value="Lahore">Lahore</option>
            <option value="Karachi">Karachi</option>
          </select>
        </div>
        <div className="form-group">
          <label>Country</label>
          <select defaultValue="Pakistan">
            <option value="Pakistan">Pakistan</option>
            <option value="India">India</option>
          </select>
        </div>
      </div>

      <div className="form-group password-group">
        <label>Password</label>
        <input type="password" defaultValue="sbdffnd65sfdvb s" />
        <i className="fas fa-check-circle icon-success"></i>
        <i className="fas fa-pen icon-input"></i>
      </div>

      <div className="button-group">
        <button type="button" className="cancel-button">Cancel</button>
        <button type="submit" className="save-button">Save</button>
      </div>
    </form>
  );
};

export default ProviderProfileManageForm;
