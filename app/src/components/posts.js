import React, { useState, useEffect } from 'react';
import '../css/posts.css';

function Posts() {
  const user = JSON.parse(localStorage.getItem('user'));
  const [nextPostId, setNextPostId] = useState(null);
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showAddPost, setShowAddPost] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostBody, setNewPostBody] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [removePostId, setRemovePostId] = useState(null);
  const [password, setPassword] = useState('');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingBody, setIsEditingBody] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedBody, setEditedBody] = useState('');

  useEffect(() => {
    fetchPosts();
    initNextPostId();
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

  const initNextPostId = async () => {
    try {
      const response = await fetch(`http://localhost:8000/posts/`);
      const data = await response.json();
      const maxId = Math.max(...data.map(post => parseInt(post.id, 10)));
      setNextPostId(maxId >= 0 ? maxId + 1 : 1);
    } catch (error) {
      console.error('Error initial next id:', error);
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
    setEditedTitle(post.title);
    setEditedBody(post.body);
    fetchComments(post.id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPost(null);
    setComments([]);
    setIsEditingTitle(false);
    setIsEditingBody(false);
  };

  const handleAddPost = async () => {
    const newPost = {
      userId: parseInt(user.id, 10),
      id: nextPostId.toString(),
      title: newPostTitle,
      body: newPostBody
    };

    try {
      const response = await fetch(`http://localhost:8000/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPost),
      });

      const addedPost = await response.json();
      setPosts([...posts, addedPost]);
      setShowAddPost(false);
      setNewPostTitle('');
      setNewPostBody('');
      setNextPostId(nextPostId + 1);
    } catch (error) {
      console.error('Error adding post:', error);
    }
  };

  const handleRemovePost = async () => {
    if (password === user.password) {
      try {
        await fetch(`http://localhost:8000/posts/${removePostId}`, {
          method: 'DELETE',
        });

        setPosts(posts.filter((post) => post.id !== removePostId));
        setRemovePostId(null);
        setPassword('');
      } catch (error) {
        console.error('Error removing post:', error);
      }
    } else {
      alert('Incorrect password');
    }
  };

  const handleSaveEdit = async () => {
    const updatedPost = {
      ...selectedPost,
      title: editedTitle,
      body: editedBody,
    };

    try {
      const response = await fetch(`http://localhost:8000/posts/${selectedPost.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedPost),
      });

      const updatedPostData = await response.json();
      setPosts(posts.map((post) => (post.id === updatedPostData.id ? updatedPostData : post)));
      setSelectedPost(updatedPostData);
      setIsEditingTitle(false);
      setIsEditingBody(false);
    } catch (error) {
      console.error('Error updating post:', error);
    }
  };

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container">
      <div className="header">
        <div className="page-header">
          <h1 className="title">Posts</h1>
          <input
            type="text"
            className="search-input"
            placeholder="Search posts by title"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="add-post-btn" onClick={() => setShowAddPost(true)}>
            Add Post
          </button>
        </div>
      </div>
      <div className="content">
        <ul className="post-list">
          {filteredPosts.map((post) => (
            <li key={post.id} className="post-item" onClick={() => handlePostClick(post)}>
              <span>{post.title}</span>
              <button className="remove-btn" onClick={(e) => {
                e.stopPropagation();
                setRemovePostId(post.id);
              }}>
                Remove
              </button>
            </li>
          ))}
        </ul>
      </div>

      {isModalOpen && selectedPost && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeModal}>&times;</span>
            <div className="modal-header">
              {isEditingTitle ? (
                <>
                  <input
                    type="text"
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    style={{ flexGrow: 1 }}
                  />
                  <button onClick={handleSaveEdit}>Save</button>
                  <button onClick={() => setIsEditingTitle(false)}>Cancel</button>
                </>
              ) : (
                <>
                  <h2>{selectedPost.title}</h2>
                  <button onClick={() => setIsEditingTitle(true)}>Edit</button>
                </>
              )}
            </div>
            <div className="modal-body">
              {isEditingBody ? (
                <>
                  <textarea
                    value={editedBody}
                    onChange={(e) => setEditedBody(e.target.value)}
                    style={{ width: '100%', height: '200px' }}
                  />
                  <button onClick={handleSaveEdit}>Save</button>
                  <button onClick={() => setIsEditingBody(false)}>Cancel</button>
                </>
              ) : (
                <>
                  <p>{selectedPost.body}</p>
                  <button onClick={() => setIsEditingBody(true)}>Edit</button>
                </>
              )}
            </div>
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

      {showAddPost && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setShowAddPost(false)}>&times;</span>
            <h2>Add New Post</h2>
            <input
              type="text"
              placeholder="Title"
              value={newPostTitle}
              onChange={(e) => setNewPostTitle(e.target.value)}
            />
            <textarea
              placeholder="Body"
              value={newPostBody}
              onChange={(e) => setNewPostBody(e.target.value)}
            />
            <button onClick={handleAddPost}>Add Post</button>
            <button onClick={() => setShowAddPost(false)}>Cancel</button>
          </div>
        </div>
      )}

      {removePostId !== null && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setRemovePostId(null)}>&times;</span>
            <h2>Confirm Removal</h2>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleRemovePost}>Confirm</button>
            <button onClick={() => setRemovePostId(null)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Posts;
