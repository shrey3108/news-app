import React, { useEffect, useState, useCallback } from 'react';
import ErrorBoundary from './ErrorBoundary';
import { useDispatch, useSelector } from 'react-redux';
import socket from './socket';
import { addNews, setNews, changeCategory, clearNews } from './features/news/newsSlice';

function App() {
  const dispatch = useDispatch();
  const [connectionStatus, setConnectionStatus] = useState('Connecting...');

  // Ensure default state
  const newsState = useSelector(state => state.news);
  const news = newsState?.items || [];
  const currentCategory = newsState?.currentCategory || 'Tech';
  const categories = newsState?.categories || ['Tech', 'Business', 'Sports', 'Entertainment', 'General'];
  const [selectedCategory, setSelectedCategory] = useState(currentCategory);

  useEffect(() => {
    // Initial dummy data
    dispatch(setNews([
      { _id: '1', title: 'Welcome to News Feed', category: 'General' },
      { _id: '2', title: 'Waiting for real-time updates', category: 'Tech' }
    ]));

    // Socket connection handling
    const handleConnect = () => {
      console.log('Socket connected');
      setConnectionStatus('Connected');
      socket.emit('subscribe', currentCategory);
    };

    const handleDisconnect = () => {
      console.log('Socket disconnected');
      setConnectionStatus('Disconnected');
    };

    const handleNewsUpdate = (data) => {
      console.log('Received news:', data);
      dispatch(addNews(data));
    };

    const handleNewsError = (error) => {
      console.error('News Error:', error);
      alert(`News Update Error: ${error.message}`);
    };

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('news_error', handleNewsError);

    // Cleanup
    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('news_error', handleNewsError);
    };
  }, [dispatch, currentCategory]);

  useEffect(() => {
    socket.on('news', (data) => {
      dispatch(addNews({
        ...data,
        category: currentCategory // Ensure category matches
      }));
    });

    return () => {
      socket.off('news');
    };
  }, [dispatch, currentCategory]);

  const handleCategoryClick = (category) => {
    dispatch(changeCategory(category));
    dispatch(clearNews()); // Clear existing news
    setSelectedCategory(category);
    socket.emit('subscribe', category);
  };

  const filteredNews = news.slice(0, 10);

  return (
    <div style={{ 
      fontFamily: 'Arial', 
      maxWidth: '800px', 
      margin: '0 auto', 
      padding: '20px',
      minHeight: '100vh',
      backgroundColor: '#f4f4f4'
    }}>
      <h1 style={{ 
              textAlign: 'center', 
              color: '#333', 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center',
              fontWeight: 'bold',
              textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
            }}>
              🌐 Real-Time News Feed 
              <span 
                style={{ 
                  marginLeft: '10px', 
                  fontSize: '0.5em', 
                  backgroundColor: selectedCategory === 'Tech' ? '#007bff' : '#6c757d', 
                  color: 'white', 
                  padding: '5px 10px', 
                  borderRadius: '15px' 
                }}
              >
                {selectedCategory} Category
              </span>
            </h1>
      
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
        {categories.map((category) => (
          <button
            key={category}
            style={{
              margin: '0 10px',
              padding: '10px',
              backgroundColor: currentCategory === category ? '#007bff' : '#f8f9fa',
              color: currentCategory === category ? 'white' : 'black',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
            onClick={() => handleCategoryClick(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <p style={{ textAlign: 'center' }}>Connection Status: 
        <span style={{ 
          color: connectionStatus === 'Connected' ? 'green' : 'red',
          fontWeight: 'bold'
        }}>
          {connectionStatus}
        </span>
      </p>

      {news.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#666' }}>No news available. Waiting for updates...</p>
      ) : (
        <div>
          <p style={{ textAlign: 'center', color: '#888', fontSize: '0.8em' }}>
            Showing latest 10 news items in {selectedCategory} category
          </p>
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            {news
              .filter(n => n.category === selectedCategory)
              .slice(0, 10)
              .map((n, index) => (
              <li 
                key={`news-${n._id || 'default'}-${n.title.replace(/\s+/g, '-').slice(0, 20)}`} 
                onClick={() => {
                  // Encode the title for URL
                  const searchQuery = encodeURIComponent(n.title);
                  // Open Google search in new tab
                  window.open(`https://www.google.com/search?q=${searchQuery}`, '_blank');
                }}
                style={{ 
                  border: '1px solid #ddd', 
                  margin: '10px 0', 
                  padding: '10px', 
                  borderRadius: '5px',
                  backgroundColor: 'white',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  position: 'relative',
                  cursor: 'pointer',
                  transition: 'background-color 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f0f0f0';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'white';
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <strong style={{ color: '#333', marginRight: '10px' }}>{n.title}</strong> 
                    <span style={{ color: '#666' }}>- {n.category}</span>
                  </div>
                  <span style={{ 
                    color: '#999', 
                    fontSize: '0.7em',
                    marginLeft: '10px'
                  }}>
                    {new Date(n.createdAt).toLocaleTimeString()}
                  </span>
                </div>
                <div style={{ 
                  position: 'absolute', 
                  bottom: '5px', 
                  right: '10px', 
                  color: '#007bff',
                  fontSize: '0.8em'
                }}>
                  🔍 Click to search on Google
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
