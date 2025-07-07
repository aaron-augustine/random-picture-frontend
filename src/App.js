import React, { useState, useEffect } from 'react';
import './App.css';
import { faro } from '@grafana/faro-react';

function App() {
  const [imageData, setImageData] = useState(null);
  const [originalImage, setOriginalImage] = useState(null); // Store the original image
  const [loading, setLoading] = useState({ status: false, type: null });
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Filter state
  const [filters, setFilters] = useState({
    preset: ''
  });

  // Available preset filters
  const presetFilters = [
    { value: '', label: 'No Preset' },
    { value: 'vintage', label: '📸 Vintage' },
    { value: 'bw', label: '⚫ Black & White' },
    { value: 'sepia', label: '🟤 Sepia' },
    { value: 'vibrant', label: '🌈 Vibrant' },
    { value: 'cool', label: '❄️ Cool' },
    { value: 'warm', label: '🔥 Warm' },
    { value: 'dramatic', label: '🎭 Dramatic' }
  ];

  // API URLs
  const IMAGE_PROCESSOR_URL = process.env.REACT_APP_IMAGE_PROCESSOR_URL || 'http://localhost:3002';
  const BACKEND_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';
  const API_KEY = process.env.REACT_APP_API_KEY || 'default-api-key';

  const processImage = async (appliedFilters = filters, forceNewImage = false, imageOverride = null) => {
    let localError = null;
    try {
      setLoading({ 
        status: true, 
        type: forceNewImage ? 'new-image' : 'filter' 
      });
      setError(null);
      setSuccessMessage("");
      
      const requestBody = {
        filters: appliedFilters
      };
      
      if (imageOverride) {
        requestBody.imageData = imageOverride;
      } else if (imageData && !forceNewImage) {
        requestBody.imageData = imageData;
      }
      
      const response = await fetch(`${IMAGE_PROCESSOR_URL}/process`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setImageData(`data:image/jpeg;base64,${data.image}`);
        if (forceNewImage || imageOverride) {
          setOriginalImage(`data:image/jpeg;base64,${data.image}`);
        }
      } else {
        throw new Error(data.error || 'Failed to process image');
      }
    } catch (err) {
      setError(err.message);
      localError = err;
      console.error('Error processing image:', err);
    } finally {
      setLoading({ status: false, type: null });
      if (!localError) {
        if (forceNewImage) {
          setSuccessMessage("New image loaded!");
        } else {
          setSuccessMessage("Filters applied!");
        }
        setTimeout(() => setSuccessMessage(""), 2000);
      }
    }
  };

  const fetchNewImage = async () => {
    const resetFilters = {
      preset: ''
    };
    setFilters(resetFilters);
    await processImage(resetFilters, true);
  };

  const handleFilterChange = (filterName, value) => {
    const newFilters = { ...filters, [filterName]: value };
    setFilters(newFilters);
  };

  const applyFilters = () => {
    processImage();
  };

  const resetFilters = () => {
    const resetFilters = {
      preset: ''
    };
    setFilters(resetFilters);
    // Use the original image for removing all filters
    if (originalImage) {
      processImage(resetFilters, false, originalImage);
    } else {
      processImage(resetFilters, true);
    }
  };

  const testBackendEndpoint = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/hello`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': API_KEY
        }
      });
      const data = await response.json();
      alert(`Backend hello: ${data.message}`);
    } catch (err) {
      alert(`Backend Error: ${err.message}`);
    }
  };

  const testProcessorEndpoint = async () => {
    try {
      const response = await fetch(`${IMAGE_PROCESSOR_URL}/health`);
      const data = await response.json();
      alert(`Image Processor is ${data.status}! Service: ${data.service}`);
    } catch (err) {
      alert(`Processor Error: ${err.message}`);
    }
  };

  const triggerBackendError = async () => {
    try {
      const response = await fetch(`${IMAGE_PROCESSOR_URL}/error`);
      const data = await response.json();
      alert(`Backend Error Response (via Image Processor): ${data.error || data.message}`);
    } catch (err) {
      alert(`Error calling image processor: ${err.message}`);
    }
  };

  const triggerFrontendError = () => {
    const err = new Error('This is a simulated frontend error for testing Faro error tracking');
    setError(`Frontend Error: ${err.message}`);
    throw err;
  };

  const hasFiltersApplied = () => {
    return filters.preset !== '';
  };

  // User name state for popup
  const [userName, setUserName] = useState(() => localStorage.getItem('userName') || '');
  const [showNamePrompt, setShowNamePrompt] = useState(!userName);

  useEffect(() => {
    if (userName && faro) {
      faro.api.setUser({ id: userName, username: userName });
    }
  }, [userName]);

  const handleNameSubmit = (e) => {
    e.preventDefault();
    if (userName.trim()) {
      localStorage.setItem('userName', userName);
      setShowNamePrompt(false);
      if (faro) {
        faro.api.setUser({ id: userName, name: userName });
      }
    }
  };

  useEffect(() => {
    fetchNewImage();
  }, []);

  return (
    <div className="App">
      {showNamePrompt && (
        <div className="modal-overlay">
          <form className="modal-content" onSubmit={handleNameSubmit}>
            <h2>Welcome!</h2>
            <label>
              Please enter your name to continue:
              <input
                type="text"
                value={userName}
                onChange={e => setUserName(e.target.value)}
                required
                autoFocus
              />
            </label>
            <button type="submit">Continue</button>
          </form>
        </div>
      )}
      {!showNamePrompt && (
        <header className="App-header">
          <h1>🎨 Image Processing App</h1>
          <p>React Frontend + Image Processor + AWS Lambda Backend</p>
          
          <div className="content-container">
            {successMessage && (
              <div className="success-message">{successMessage}</div>
            )}
            {loading.status && (
              <div className="loader">
                {loading.type === 'new-image' ? 'Getting random image...' : 
                 loading.type === 'filter' ? 'Applying filters to current image...' : 
                 'Loading...'}
              </div>
            )}
            
            {error && (
              <div className="error-container">
                <h3>❌ Error</h3>
                <p>{error}</p>
                <div className="setup-instructions">
                  <h4>Troubleshooting:</h4>
                  <ol>
                    <li>Make sure all services are running (npm run dev)</li>
                    <li>Check that image processor is available at {IMAGE_PROCESSOR_URL}</li>
                    <li>Verify backend is running at {BACKEND_URL}</li>
                  </ol>
                </div>
              </div>
            )}
            
            {imageData && (
              <div className="image-container">
                <div className="image-display">
                  <img 
                    src={imageData} 
                    alt="Processed content"
                    className="processed-image"
                  />
                </div>
              </div>
            )}
            
            <div className="controls-container">
              <div className="button-container">
                <button 
                  onClick={fetchNewImage}
                  disabled={loading.status}
                  className="fetch-button"
                >
                  🖼️ Get New Random Image
                </button>
                
                <button 
                  onClick={() => setShowFilters(!showFilters)}
                  className={`filter-toggle-button ${showFilters ? 'active' : ''}`}
                >
                  🎨 Filters {filters.preset !== '' ? '●' : ''}
                </button>

                {showFilters && (
                  <div className="filters-panel">
                    <h3>🎨 Image Filters</h3>
                    
                    <div className="filter-group">
                      <label>Preset Filters:</label>
                      <select 
                        value={filters.preset} 
                        onChange={(e) => handleFilterChange('preset', e.target.value)}
                        className="preset-select"
                      >
                        {presetFilters.map(preset => (
                          <option key={preset.value} value={preset.value}>
                            {preset.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="filter-actions">
                      <button 
                        onClick={applyFilters}
                        disabled={loading.status}
                        className="apply-button"
                      >
                        ✨ Apply Filters to Current Image
                      </button>
                      <button 
                        onClick={resetFilters}
                        disabled={loading.status}
                        className="reset-button"
                      >
                        🔄 Remove All Filters
                      </button>
                    </div>
                  </div>
                )}

                <button 
                  onClick={testBackendEndpoint}
                  className="test-button"
                >
                  🚀 Test Backend
                </button>
                
                <button 
                  onClick={testProcessorEndpoint}
                  className="test-button"
                >
                  🔧 Test Processor
                </button>
                
                <button 
                  onClick={triggerBackendError}
                  className="test-button error-button"
                >
                  💥 Trigger Backend Error
                </button>
                
                <button 
                  onClick={triggerFrontendError}
                  className="test-button error-button"
                >
                  ⚠️ Trigger Frontend Error
                </button>
              </div>
            </div>
            
            <div className="info-container">
              <h4>🏗️ Architecture:</h4>
              <div className="architecture-flow">
                <div className="service-box">React Frontend</div>
                <div className="arrow">→</div>
                <div className="service-box">Image Processor</div>
                <div className="arrow">→</div>
                <div className="service-box">AWS Lambda</div>
              </div>
              <ul>
                <li>Frontend sends filter preferences to image processor</li>
                <li>Image processor fetches images from Lambda backend</li>
                <li>Processed images returned to frontend for display</li>
              </ul>
            </div>
          </div>
        </header>
      )}
    </div>
  );
}

export default App;
