import React, { useState, useEffect } from 'react';
import '../css/posts.css';

function Posts() {
  const user = JSON.parse(localStorage.getItem('user'));
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch(`http://localhost:8000/posts?userId=${user.id}`);
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const fetchComments = async (postId) => {
    try {
      const response = await fetch(`http://localhost:8000/comments?postId=${postId}`);
      const data = await response.json();
      setComments(data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handlePostClick = (post) => {
    setSelectedPost(post);
    fetchComments(post.id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPost(null);
    setComments([]);
  };

  return (
    <div className="container">
      <div className="content">
        <h1>Posts</h1>
        <ul className="post-list">
          {posts.map((post) => (
            <li key={post.id} className="post-item" onClick={() => handlePostClick(post)}>
              {post.title}
            </li>
          ))}
        </ul>
      </div>

      {isModalOpen && selectedPost && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeModal}>&times;</span>
            <h2>{selectedPost.title}</h2>
            <p>{selectedPost.body}</p>
            <h3>Comments</h3>
            <ul className="comment-list">
              {comments.map((comment) => (
                <li key={comment.id} className="comment-item">
                  <p><strong>{comment.name}</strong> ({comment.email})</p>
                  <p>{comment.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default Posts;
