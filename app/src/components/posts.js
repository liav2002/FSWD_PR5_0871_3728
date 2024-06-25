import React, { useState, useEffect } from 'react';
import '../css/posts.css';

function Posts() {
  const user = JSON.parse(localStorage.getItem('user'));
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [showAddPost, setShowAddPost] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostBody, setNewPostBody] = useState('');
  const [nextPostId, setNextPostId] = useState(null);

  const [removePostId, setRemovePostId] = useState(null);
  const [password, setPassword] = useState('');

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingBody, setIsEditingBody] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedBody, setEditedBody] = useState('');

  const [isAddingComment, setIsAddingComment] = useState(false);
  const [nextCommentId, setNextCommentId] = useState(null);
  const [commentUserName, setCommentUserName] = useState('');
  const [commentPassword, setCommentPassword] = useState('');
  const [commentBody, setCommentBody] = useState('');

  const [commentId, setCommentId] = useState(null);
  const [isEditingComment, setIsEditingComment] = useState(false);
  const [showCommentAuthenticatorBeforeEdit, setShowCommentAuthenticatorBeforeEdit] = useState(false);

  useEffect(() => {
    fetchPosts();
    initNextPostId();
    initNextCommentId();
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
      console.error('Error initial next post id:', error);
    }
  };

  const initNextCommentId = async () => {
    try {
      const response = await fetch(`http://localhost:8000/comments/`);
      const data = await response.json();
      const maxId = Math.max(...data.map(post => parseInt(post.id, 10)));
      setNextCommentId(maxId >= 0 ? maxId + 1 : 1);
    } catch (error) {
      console.error('Error initial next comment id:', error);
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

  const fetchUserByEmail = async (email) => {
    try {
      const response = await fetch(`http://localhost:8000/users?email=${email}`);
      const [userData] = await response.json();
      return userData;
    } catch (error) {
      console.error('Error fetching user by email:', error);
    }
  };

  const fetchUserByUsername = async (username) => {
    try {
      const response = await fetch(`http://localhost:8000/users?username=${username}`);
      const [userData] = await response.json();
      return userData;
    } catch (error) {
      console.error('Error fetching user by username:', error);
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
    setIsAddingComment(false); // Reset adding comment state on modal close
    setCommentUserName('');
    setCommentPassword('');
    setCommentBody('');
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

  const handleAddComment = async () => {
    const userData = await fetchUserByUsername(commentUserName);

    if (!userData) {
      alert('Username not found.');
      return;
    }

    if (userData.username === commentUserName && userData.password === commentPassword) {
      try {
        const response = await fetch(`http://localhost:8000/comments`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            postId: parseInt(selectedPost.id, 10),
            id: nextCommentId.toString(),
            name: userData.name,
            email: userData.email,
            body: commentBody
          }),
        });

        const addedComment = await response.json();
        setComments([...comments, addedComment]);
        setIsAddingComment(false);
        setCommentUserName('');
        setCommentPassword('');
        setCommentBody('');
        setNextCommentId(nextCommentId + 1);
      } catch (error) {
        console.error('Error adding comment:', error);
      }
    } else {
      alert('Incorrect username or password');
    }
  };

  const handleRemoveComment = async (commentId) => {
    const comment = comments.find((comment) => comment.id === commentId);
    const userData = await fetchUserByEmail(comment.email);

    if (password === userData.password) {
      try {
        await fetch(`http://localhost:8000/comments/${commentId}`, {
          method: 'DELETE',
        });

        setComments(comments.filter((comment) => comment.id !== commentId));
      } catch (error) {
        console.error('Error removing comment:', error);
      }
    } else {
      alert('Incorrect password');
    }
  };

  const handleEditComment = async () => {
    try {
      const response = await fetch(`http://localhost:8000/comments/${commentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...comments.find((comment) => comment.id === commentId),
          body: commentBody,
        }),
      });

      const updatedComment = await response.json();
      setComments(comments.map((comment) =>
        comment.id === updatedComment.id ? updatedComment : comment
      ));
      setIsEditingComment(false);
    } catch (error) {
      console.error('Error updating comment:', error);
    }
  };


  const handleEditCommentAuth = async (id) => {
    const comment = comments.find((comment) => comment.id === id);

    // Set initial comment body for editing
    setCommentBody(comment.body);
    setCommentId(id);
    setShowCommentAuthenticatorBeforeEdit(true);
  };

  const handleAuthenticatorForEditComments = async () => {
    const comment = comments.find((comment) => comment.id === commentId);

    // Fetch user data to authenticate
    try {
      const response = await fetch(`http://localhost:8000/users?email=${comment.email}`);
      const [userData] = await response.json();
      
      if (!userData) {
        alert('User not found');
      }
      if (userData.password === commentPassword) {
        setIsEditingComment(true);
        setShowCommentAuthenticatorBeforeEdit(false);
      } else {
        alert('Incorrect password');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
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
            {user && (
              <button onClick={() => setIsAddingComment(true)}>New Comment</button>
            )}
            <ul className="comment-list">
              {comments.map((comment) => (
                <li key={comment.id} className="comment-item">
                  {isEditingComment && comment.id === commentId ? (
                    <>
                      <textarea
                        placeholder="Your Comment"
                        value={commentBody}
                        onChange={(e) => setCommentBody(e.target.value)}
                        style={{ width: '100%', height: '100px' }}
                      />
                      <button onClick={handleEditComment}>Save</button>
                      <button onClick={() => setIsEditingComment(false)}>Cancel</button>
                    </>
                  ) : (
                    <>
                      <p><strong>{comment.name}</strong> ({comment.email})</p>
                      <p>{comment.body}</p>
                      <button onClick={() => handleEditCommentAuth(comment.id)}>Edit</button>
                      <button onClick={() => handleRemoveComment(comment.id)}>Remove</button>
                    </>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {isAddingComment && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setIsAddingComment(false)}>&times;</span>
            <h2>Add Comment</h2>
            <input
              type="text"
              placeholder="Your Username"
              value={commentUserName}
              onChange={(e) => setCommentUserName(e.target.value)}
            />
            <input
              type="password"
              placeholder="Your Password"
              value={commentPassword}
              onChange={(e) => setCommentPassword(e.target.value)}
            />
            <textarea
              placeholder="Your Comment"
              value={commentBody}
              onChange={(e) => setCommentBody(e.target.value)}
              style={{ width: '100%', height: '100px' }}
            />
            <button onClick={handleAddComment}>Add Comment</button>
            <button onClick={() => setIsAddingComment(false)}>Cancel</button>
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

      {showCommentAuthenticatorBeforeEdit && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setShowCommentAuthenticatorBeforeEdit(false)}>&times;</span>
            <h2>Authenticate Yourself</h2>
            <input
              type="password"
              placeholder="Your Password"
              value={commentPassword}
              onChange={(e) => setCommentPassword(e.target.value)}
            />
            <button onClick={handleAuthenticatorForEditComments}>Authenticate</button>
            <button onClick={() => setShowCommentAuthenticatorBeforeEdit(false)}>Cancel</button>
          </div>
        </div>
      )}

    </div>
  );
}

export default Posts;
