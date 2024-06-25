import React from 'react';
import '../css/info.css';

function Info() {
  const user = JSON.parse(localStorage.getItem("user"));
  return (
    <>
      <div id="card">
        <h2 className="title">Your Information</h2>
        <p><span className="info-label">Name:</span> {user.name}</p>
        <p><span className="info-label">Phone:</span> {user.phone}</p>
        <p><span className="info-label">Email:</span> {user.email}</p>
        <p>
          <span className="info-label">Address:</span> {user.address.city}, {user.address.street}
        </p>
        <p><span className="info-label">Company Name:</span> {user.company.name}</p>
        <p><span className="info-label">Website:</span> {user.website}</p>
      </div>
    </>
  );
}

export default Info;
