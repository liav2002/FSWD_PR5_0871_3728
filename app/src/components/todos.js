import React from 'react';

function Todos() {
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <>
      <div className="container">
        <div className="content">
          <h1>Todos</h1>
          <h2>Still In Develop</h2>
        </div>
      </div>
    </>
  );
}

export default Todos;