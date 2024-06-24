import React from 'react';

function Albums() {
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <>
      <div className="container">
        <div className="content">
          <h1>Albums</h1>
          <h2>Still In Develop</h2>
        </div>
      </div>
    </>
  );
}

export default Albums;