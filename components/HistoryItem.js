import { useState } from 'react';

export default function HistoryItem({ item }) {
  const [expandedView, setExpandedView] = useState(false);

  if (!item || !item.results || !item.results.identification) {
    return null;
  }
  
  const { 
    id, 
    timestamp, 
    imageData, 
    results: { 
      identification: { 
        category, 
        name, 
        scientificName, 
        confidence 
      } 
    } 
  } = item;
  
  // Parse confidence as a percentage
  const confidencePercentage = Math.round(confidence * 100);
  
  // Format date
  const formattedDate = new Date(timestamp).toLocaleString();
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="relative">
        <img 
          src={imageData} 
          alt={name}
          className="w-full h-36 object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-3 py-2">
          <div className="flex items-center">
            <img 
              src={category === 'plant' ? '/icons/plants.svg' : '/icons/animals.svg'} 
              alt={category}
              className="w-4 h-4 mr-1"
            />
            <span className="text-white text-sm">{category === 'plant' ? 'Plant' : 'Animal'}</span>
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-gray-800 text-lg mb-1">{name}</h3>
        <p className="text-gray-500 text-sm italic mb-2">{scientificName}</p>
        
        <div className="flex items-center mb-3">
          <span className="text-xs text-gray-500 mr-1">Confidence:</span>
          <div className="w-full bg-gray-200 rounded-full h-1.5 flex-grow mr-1">
            <div 
              className={`h-1.5 rounded-full ${confidencePercentage >= 90 ? 'bg-green-600' : confidencePercentage >= 70 ? 'bg-yellow-500' : 'bg-red-600'}`}
              style={{ width: `${confidencePercentage}%` }}
            ></div>
          </div>
          <span className="text-xs font-semibold">{confidencePercentage}%</span>
        </div>
        
        <div className="text-xs text-gray-500">
          {formattedDate}
        </div>
        
        <button
          className="mt-3 text-sm text-blue-600 hover:underline focus:outline-none flex items-center"
          onClick={() => setExpandedView(!expandedView)}
        >
          {expandedView ? 'Show Less' : 'Show More'}
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className={`h-3 w-3 ml-1 transition-transform ${expandedView ? 'rotate-180' : ''}`} 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        {expandedView && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <p className="text-sm text-gray-700">
              {item.results.identification.description || 'No additional description available.'}
            </p>
            
            <button
              className="mt-3 text-xs px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
              onClick={() => {
                // In a real app, this would reanalyze or view full details
                window.location.href = '/premium';
              }}
            >
              View Full Details
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
