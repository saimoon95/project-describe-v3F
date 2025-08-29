import React, { useState } from 'react';
import './App.css';
import logo from './logo.svg';

function App() {
  const [image, setImage] = useState(null);
  const [titleLength, setTitleLength] = useState(120);
  const [descriptionLength, setDescriptionLength] = useState(600);
  const [tagsLength, setTagsLength] = useState(60);
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
      setResults(null); // Clear previous results
      setError(null); // Clear previous errors
    }
  };

  const handleGenerateResults = async () => {
    if (!image) {
      setError('Please upload an image first!');
      return;
    }

    setIsProcessing(true);
    setError(null);
    
    try {
      // First, test if backend is reachable
      console.log('Testing backend connectivity...');
      try {
        const testResponse = await fetch('/api/test');
        console.log('Backend test response:', testResponse.status);
        if (testResponse.ok) {
          const testData = await testResponse.json();
          console.log('Backend is reachable:', testData);
        }
      } catch (testError) {
        console.error('Backend connectivity test failed:', testError);
      }

      // Get the file from the input
      const fileInput = document.getElementById('image-upload');
      const file = fileInput.files[0];
      
      if (!file) {
        throw new Error('No file selected');
      }

      console.log('File selected:', file.name, file.size, 'bytes');

      // Convert image to base64 for API
      const base64Image = await convertFileToBase64(file);
      
      // Call the backend API
      const results = await analyzeImageWithAPI(base64Image, file.type);
      
      setResults(results);
    } catch (error) {
      console.error('Error processing image:', error);
      setError(`Error processing image: ${error.message}. Please try again.`);
    } finally {
      setIsProcessing(false);
    }
  };

  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result.split(',')[1]; // Remove data:image/...;base64, prefix
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const analyzeImageWithAPI = async (base64Image, mimeType) => {
    // Use the backend server for Google Gemini Vision API
    try {
      console.log('Sending request to backend...');
      console.log('Image size:', base64Image.length, 'characters');
      
      const requestBody = {
        image: base64Image,
        mimeType: mimeType,
        titleLength: titleLength,
        descriptionLength: descriptionLength,
        tagsLength: tagsLength
      };
      
      console.log('Request body prepared, sending fetch...');
      
      const response = await fetch('/api/analyze-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      console.log('Response received:', response.status, response.statusText);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Server error response:', errorData);
        throw new Error(`Server error: ${response.status} - ${errorData.error || 'Unknown error'}`);
      }

      const result = await response.json();
      console.log('Success! Received result:', result);
      return result;
    } catch (error) {
      console.error('Error calling backend API:', error);
      console.error('Error details:', error.message);
      // Provide clearer message for common network issues
      const isNetworkError = /Failed to fetch|NetworkError|TypeError: Failed to fetch/i.test(error?.message || '');
      if (isNetworkError) {
        throw new Error('Cannot reach the AI server. Make sure it is running (npm run server) and that you opened the app via npm start, not the HTML file.');
      }
      throw error;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex flex-col items-center justify-center mb-4">
            <img src={logo} alt="Describe Logo" className="h-20 w-20 mb-4" />
            <h1 className="text-4xl font-bold text-gray-800">Describe</h1>
          </div>
          <p className="text-gray-600">Upload an image and get AI-powered analysis with Google Gemini</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Left Column - Upload and Settings */}
          <div className="space-y-6">
            {/* Upload Section */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Upload Image</h2>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <div className="text-gray-500 mb-2">
                    <svg className="mx-auto h-12 w-12" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                  <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 10MB</p>
                </label>
              </div>
              
              {image && (
                <div className="mt-4">
                  <img 
                    src={image} 
                    alt="Uploaded" 
                    className="w-full h-64 object-cover rounded-lg shadow-md" 
                  />
                </div>
              )}
            </div>

            {/* Settings Section */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Settings</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title Length: {titleLength} characters
                  </label>
                  <input
                    type="range"
                    value={titleLength}
                    onChange={(e) => setTitleLength(Number(e.target.value))}
                    min="10"
                    max="300"
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description Length: {descriptionLength} characters
                  </label>
                  <input
                    type="range"
                    value={descriptionLength}
                    onChange={(e) => setDescriptionLength(Number(e.target.value))}
                    min="100"
                    max="2000"
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags Length: {tagsLength} characters
                  </label>
                  <input
                    type="range"
                    value={tagsLength}
                    onChange={(e) => setTagsLength(Number(e.target.value))}
                    min="10"
                    max="150"
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>
              </div>
            </div>

            {/* Generate Button */}
            <button 
              onClick={handleGenerateResults}
              disabled={!image || isProcessing}
              className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-all duration-200 ${
                !image || isProcessing 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700 transform hover:scale-105'
              }`}
            >
              {isProcessing ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Analyzing with Gemini AI...
                </div>
              ) : (
                'Generate Results'
              )}
            </button>
          </div>

          {/* Right Column - Results */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Results</h2>
            
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <div className="flex">
                  <svg className="h-5 w-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <p className="text-red-800 text-sm">{error}</p>
                </div>
              </div>
            )}
            
            {!results && !isProcessing && !error && (
              <div className="text-center text-gray-500 py-8">
                <svg className="mx-auto h-12 w-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p>Upload an image and click "Generate Results" to see AI analysis</p>
              </div>
            )}

            {isProcessing && (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Analyzing your image with Gemini AI...</p>
                <p className="text-xs text-gray-500 mt-2">This may take a few seconds</p>
              </div>
            )}

            {results && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">Title</h3>
                  <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{results.title}</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">Description</h3>
                  <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{results.description}</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {results.tags.map((tag, index) => (
                      <span 
                        key={index}
                        className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
