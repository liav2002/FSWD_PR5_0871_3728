import React from 'react';

function Posts() {
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <>
      <div className="container">
        <div className="content">
          <h1>Posts</h1>
          <h2>Still In Develop</h2>
        </div>
      </div>
    </>
  );
}

export default Posts;