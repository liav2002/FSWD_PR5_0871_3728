import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Link, useRouteMatch } from 'react-router-dom';
import '../css/albums.css';

function Albums() {
  const user = JSON.parse(localStorage.getItem('user'));
  const [albums, setAlbums] = useState([]);
  const [filteredAlbums, setFilteredAlbums] = useState([]);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newAlbumTitle, setNewAlbumTitle] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [nextAlbumId, setNextAlbumtId] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [newPhotoTitle, setNewPhotoTitle] = useState('');
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [nextPhotoId, setNextPhotoId] = useState(null);
  const [limit, setLimit] = useState(5);
  const [password, setPassword] = useState('');
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [itemToRemove, setItemToRemove] = useState(null);
  const [itemType, setItemType] = useState('');

  const fetchAlbums = async () => {
    try {
      const response = await fetch(`http://localhost:8000/albums/?userId=${user.id}`);
      const data = await response.json();
      setAlbums(data);
      setFilteredAlbums(data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchPhotos = async (albumId) => {
    try {
      setIsLoading(true);
      const response = await fetch(`http://localhost:8000/photos/?albumId=${albumId}&_limit=${limit}`);
      const data = await response.json();
      setPhotos((prevPhotos) => {
        const newPhotos = data.filter(newPhoto => !prevPhotos.some(photo => photo.id === newPhoto.id));
        return [...prevPhotos, ...newPhotos];
      });
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const fetchAllPhotosOfAlbum = async (albumId) => {
    try {
      const response = await fetch(`http://localhost:8000/photos?albumId=${albumId}`);
      const data = await response.json();
      console.log("data:");
      console.log(data);
      setPhotos(data);
    } catch (error) {
      console.log(`Error fetching photos for album ${albumId}:`, error);
    }
  };

  const initNextAlbumId = async () => {
    try {
      const response = await fetch(`http://localhost:8000/albums/`);
      const data = await response.json();
      const maxId = Math.max(...data.map(album => parseInt(album.id, 10)));
      setNextAlbumtId(maxId >= 0 ? maxId + 1 : 1);
    } catch (error) {
      console.error('Error initializing next album id:', error);
    }
  };

  const initNextPhotoId = async () => {
    try {
      const response = await fetch(`http://localhost:8000/photos/`);
      const data = await response.json();
      const maxId = Math.max(...data.map(photo => parseInt(photo.id, 10)));
      setNextPhotoId(maxId >= 0 ? maxId + 1 : 1);
    } catch (error) {
      console.error('Error initializing next photo id:', error);
    }
  };

  const handleLinkClick = (albumId) => {
    if (isModalOpen) {
      setIsModalOpen(false);
    } else {
      setSelectedAlbum(albumId);
      setPhotos([]);
      fetchPhotos(albumId);
    }
  };

  const handleLoadMore = () => {
    setLimit(limit + 5);
    fetchPhotos(selectedAlbum);
  };

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    setFilteredAlbums(
      albums.filter(
        album =>
          album.title.toLowerCase().includes(query) ||
          album.id.toString().includes(query)
      )
    );
  };

  const createNewAlbum = async () => {
    try {
      const response = await fetch('http://localhost:8000/albums', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: nextAlbumId.toString(),
          userId: parseInt(user.id, 10),
          title: newAlbumTitle,
        }),
      });
      const data = await response.json();
      setAlbums((prevAlbums) => [...prevAlbums, data]);
      setFilteredAlbums((prevFilteredAlbums) => [...prevFilteredAlbums, data]);
      setNewAlbumTitle('');
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error creating album:', error);
    }
  };

  const addNewPhoto = async () => {
    try {
      setIsUploading(true);
      const response = await fetch('http://localhost:8000/photos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          albumId: parseInt(selectedAlbum, 10),
          id: nextPhotoId.toString(), // Ensure newPhotoId is unique for each new photo
          title: newPhotoTitle,
          url: "https://via.placeholder.com/600/" + newPhotoUrl,
          thumbnailUrl: "https://via.placeholder.com/150/" + newPhotoUrl,
        }),
      });
      const data = await response.json();
      setPhotos((prevPhotos) => [...prevPhotos, data]); // Update local state with new photo
      setIsUploading(false);
      // Optionally, clear input fields or close modal after successful upload
      setNewPhotoTitle('');
      setNewPhotoUrl('');
    } catch (error) {
      console.error('Error adding photo:', error);
      setIsUploading(false);
    }
  };

  const removeItem = async () => {
    if (!password) {
      alert("Please enter your password");
      return;
    }
  
    try {
      const authResponse = await fetch(`http://localhost:8000/users/${user.id}`);
      const authData = await authResponse.json();
  
      if (authData.password !== password) {
        alert("Incorrect password");
        return;
      }
  
      if (itemType === 'album') {
        // Fetch photos of the album to be deleted
        const photosResponse = await fetch(`http://localhost:8000/photos?albumId=${itemToRemove}`);
        const photosData = await photosResponse.json();
  
        // Delete the album
        await fetch(`http://localhost:8000/albums/${itemToRemove}`, { method: 'DELETE' });
        setAlbums(albums.filter(album => album.id !== itemToRemove));
        setFilteredAlbums(filteredAlbums.filter(album => album.id !== itemToRemove));
  
        // Delete photos associated with the album
        for (let i = 0; i < photosData.length; i++) {
          await fetch(`http://localhost:8000/photos/${photosData[i].id}`, { method: 'DELETE' });
        }
  
        // Clear photos state
        setPhotos([]);
      } else if (itemType === 'photo') {
        // Delete the photo
        await fetch(`http://localhost:8000/photos/${itemToRemove}`, { method: 'DELETE' });
        setPhotos(photos.filter(photo => photo.id !== itemToRemove));
      }
  
      setPassword('');
      setIsPasswordModalOpen(false);
      setItemToRemove(null);
      setItemType('');
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };
  

  const openPasswordModal = (itemId, type) => {
    setItemToRemove(itemId);
    setItemType(type);
    setIsPasswordModalOpen(true);
  };

  const closePasswordModal = () => {
    setPassword('');
    setIsPasswordModalOpen(false);
    setItemToRemove(null);
    setItemType('');
  };


  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
    setNewAlbumTitle('');
  };

  let { url } = useRouteMatch();

  useEffect(() => {
    fetchAlbums();
    initNextAlbumId();
    initNextPhotoId();
  }, []);

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedAlbum(null);
  };

  return (
    <div className="container_albums">
      <div className="header_albums">
        <div className="page-header">
          <h1 className="title">Albums</h1>
          <div className="search_bar_albums">
            <input
              type="text"
              className="search-input"
              placeholder="Search albums by title or ID"
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
          <button className="add-album-btn" onClick={toggleModal}>Add Album</button>
        </div>
      </div>
      <div className="album_content_container">
        <div className="album_list_container">
          {filteredAlbums.map((album) => (
            <div key={album.id} className={`album_link ${selectedAlbum === album.id ? 'selected_album' : ''}`}>
              <Link to={`${url}/links`} onClick={() => handleLinkClick(album.id)}>
                {album.title}
              </Link>
              <button className="remove_button" onClick={() => openPasswordModal(album.id, 'album')}>Remove</button>
            </div>
          ))}
        </div>
        {selectedAlbum !== null && !isModalOpen && (
          <div className="modal">
            <div className="modal-content">
              <span className="close_album" onClick={closeModal}>&times;</span>
              <h2>{albums.find(album => album.id === selectedAlbum)?.title}</h2>
              <div className="photos_container">
                <h4 className="photos_header">Photos for selected album:</h4>
                <div className="photos_list">
                  {photos.map((photo) => (
                    <div key={photo.id} className="photo_item">
                      <a href={photo.url} target="_blank" rel="noopener noreferrer">
                        <img
                          src={photo.thumbnailUrl}
                          alt={photo.title}
                          className="photo_image"
                          onError={(e) => { e.target.onerror = null; e.target.src="https://via.placeholder.com/150"; }} // Handle broken images
                        />
                        <p>{photo.title}</p>
                      </a>
                      <button className="remove_button" onClick={() => openPasswordModal(photo.id, 'photo')}>Remove</button>
                    </div>
                  ))}
                </div>
                {!isLoading && (
                  <button className="load_more_button" onClick={handleLoadMore} disabled={isLoading}>
                    Load More
                  </button>
                )}
                <div className="add-photo-section">
                  <h3>Add New Photo</h3>
                  <input
                    type="text"
                    value={newPhotoTitle}
                    onChange={(e) => setNewPhotoTitle(e.target.value)}
                    placeholder="Photo Title"
                  />
                  <input
                    type="text"
                    value={newPhotoUrl}
                    onChange={(e) => setNewPhotoUrl(e.target.value)}
                    placeholder="Photo URL"
                  />
                  <button onClick={addNewPhoto} disabled={isUploading}>
                    {isUploading ? 'Uploading...' : 'Upload Photo'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {isModalOpen && (
          <div className="modal">
            <div className="modal-content">
              <span className="close_album" onClick={closeModal}>&times;</span>
              <h2>Create New Album</h2>
              <input
                type="text"
                value={newAlbumTitle}
                onChange={(e) => setNewAlbumTitle(e.target.value)}
                placeholder="Enter album title"
              />
              <button onClick={createNewAlbum}>Create Album</button>
            </div>
          </div>
        )}
        {isPasswordModalOpen && (
          <div className="modal">
            <div className="modal-content">
              <span className="close_album" onClick={closePasswordModal}>&times;</span>
              <h2>Confirm Removal</h2>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
              />
              <button onClick={removeItem}>Confirm</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Albums;
