import React from 'react';

function Todos() {
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <>
      <div className="container">
        <div className="content">
            <h1>Still In Develop</h1>
        </div>
      </div>
    </>
  );
}

export default Todos;