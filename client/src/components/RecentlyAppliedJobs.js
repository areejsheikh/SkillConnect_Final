import React from 'react';
import './styles/RecentlyAppliedJobs.css';

const RecentlyAppliedJobs = ({ jobs = [] }) => {
  return (
    <div className="recently-applied">
      <h3>Recently Applied</h3>
      <table>
        <thead>
          <tr>
            <th>Job</th>
            <th>Company</th>
            <th>Location</th>
            <th>Salary</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {jobs.length > 0 ? (
            jobs.map((job) => (
              <tr key={job.id}>
                <td>{job.title}</td>
                <td>{job.company}</td>
                <td>{job.location}</td>
                <td>{job.salary ? `$${job.salary}` : 'N/A'}</td> {/* Add dollar sign */}
                <td>
                  <span className={`status-${job.status.toLowerCase()}`}>{job.status}</span>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" style={{ textAlign: 'center' }}>
                No recently applied jobs found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default RecentlyAppliedJobs;