import React from 'react';

function Info() {
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <>
      <div className="container">
        <div className="content">
          <h1>Info</h1>
          <h2>Still In Develop</h2>
        </div>
      </div>
    </>
  );
}

export default Info;