import { useState, useRef } from 'react';

export default function ImageUploader({ onImageSelect }) {
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleFile = (file) => {
    setError(null);
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file (JPEG, PNG, etc.)');
      return;
    }
    
    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('Image size should be less than 10MB');
      return;
    }

    const reader = new FileReader();
    
    reader.onload = (e) => {
      const dataUrl = e.target.result;
      setPreview(dataUrl);
      onImageSelect(dataUrl);
    };
    
    reader.onerror = () => {
      setError('Failed to read the file. Please try again.');
    };
    
    reader.readAsDataURL(file);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="w-full">
      {error && (
        <div className="p-4 mb-6 bg-red-50 text-red-600 rounded-lg shadow-sm border border-red-100">
          <p className="font-medium">{error}</p>
        </div>
      )}
      
      {preview ? (
        <div className="mb-6">
          <div className="relative rounded-xl overflow-hidden shadow-lg">
            <img 
              src={preview} 
              alt="Preview" 
              className="w-full h-80 object-contain bg-gray-50 p-2" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none"></div>
            <button
              className="absolute bottom-4 right-4 bg-white text-red-500 rounded-full p-2 shadow-lg hover:bg-red-50 transition-colors"
              onClick={() => {
                setPreview(null);
                onImageSelect(null);
              }}
              aria-label="Remove image"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      ) : (
        <div 
          className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center h-80 transition-all duration-300 ${
            dragActive ? 'border-indigo-400 bg-indigo-50/50 shadow-lg' : 'border-gray-200 hover:border-indigo-300 bg-white'
          }`}
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
        >
          <div className="w-16 h-16 mb-4 rounded-full bg-indigo-100 flex items-center justify-center">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 16V8M8 12L12 8L16 12" stroke="#635bff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M3 15V16C3 18.2091 4.79086 20 7 20H17C19.2091 20 21 18.2091 21 16V15" stroke="#635bff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          
          <p className="mb-1 text-lg text-gray-700 font-medium">
            Drag and drop your image here
          </p>
          <p className="mb-6 text-sm text-gray-500">
            PNG, JPG, GIF up to 10MB
          </p>
          
          <button
            type="button"
            onClick={handleButtonClick}
            className="stripe-button"
          >
            Select Image
          </button>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleChange}
            className="hidden"
          />
        </div>
      )}
    </div>
  );
}
