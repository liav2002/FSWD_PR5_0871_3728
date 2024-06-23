import React from 'react';

function Home() {
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <>
      <div className="container">
        <div className="content">
            <h1>Hello</h1>
        </div>
      </div>
    </>
  );
}

export default Home;
