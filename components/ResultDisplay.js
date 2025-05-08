import { useState } from 'react';

export default function ResultDisplay({ results, onReset }) {
  const [showDetails, setShowDetails] = useState(false);
  
  if (!results || !results.identification) {
    return (
      <div className="text-center py-10">
        <div className="text-red-600 mb-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-800">No Results Available</h3>
        <p className="text-gray-600 mt-1">Unable to process the identification results</p>
        <button
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          onClick={onReset}
        >
          Try Again
        </button>
      </div>
    );
  }

  const { 
    identification: { 
      category, 
      name, 
      scientificName, 
      confidence,
      description,
      additionalInfo
    } 
  } = results;

  // Parse confidence as a percentage
  const confidencePercentage = Math.round(confidence * 100);
  
  // Determine confidence level color and message
  const getConfidenceColor = () => {
    if (confidencePercentage >= 85) return 'text-green-600';
    if (confidencePercentage >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };
  
  const getConfidenceMessage = () => {
    if (confidencePercentage >= 85) return 'Alta confiança';
    if (confidencePercentage >= 70) return 'Confiança moderada';
    if (confidencePercentage >= 50) return 'Baixa confiança';
    return 'Muito incerto';
  };

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-3xl border border-white/10 overflow-hidden">
      <div className="p-8">
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center mr-4">
            <img 
              src={category === 'plant' ? '/icons/plants.svg' : '/icons/animals.svg'} 
              alt={category}
              className="w-7 h-7"
            />
          </div>
          <div>
            <h2 className="text-2xl font-bold stripe-gradient-text">{name}</h2>
            <p className="text-white/60 italic">{scientificName}</p>
          </div>
        </div>
        
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <span className="text-sm font-medium text-gray-700 mr-2">Confiança:</span>
              <span className={`text-sm font-bold ${getConfidenceColor()}`}>{confidencePercentage}%</span>
            </div>
            <div className={`text-xs px-3 py-1 rounded-full ${
              confidencePercentage >= 85 ? 'bg-green-100 text-green-800' : 
              confidencePercentage >= 70 ? 'bg-yellow-100 text-yellow-800' : 
              'bg-red-100 text-red-800'
            }`}>
              {getConfidenceMessage()}
            </div>
          </div>
          
          <div className="w-full bg-gray-100 rounded-full h-3">
            <div 
              className={`h-3 rounded-full ${
                confidencePercentage >= 85 ? 'bg-gradient-to-r from-indigo-500 to-purple-600' : 
                confidencePercentage >= 70 ? 'bg-gradient-to-r from-yellow-400 to-orange-500' : 
                'bg-gradient-to-r from-red-400 to-red-600'
              }`}
              style={{ width: `${confidencePercentage}%` }}
            ></div>
          </div>
        </div>
        
        <div className="mb-8">
          <p className="text-gray-700 leading-relaxed">{description}</p>
        </div>
        
        {additionalInfo && (
          <div className="mb-8">
            <button
              className="flex items-center text-indigo-600 hover:text-indigo-800 font-medium"
              onClick={() => setShowDetails(!showDetails)}
            >
              <span className="mr-2">{showDetails ? 'Hide' : 'Show'} Details</span>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className={`h-5 w-5 transition-transform duration-300 ${showDetails ? 'rotate-180' : ''}`} 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {showDetails && (
              <div className="mt-4 bg-gray-50 p-6 rounded-xl shadow-sm border border-gray-100">
                {Object.entries(additionalInfo).map(([key, value]) => (
                  <div key={key} className="mb-3 last:mb-0 pb-3 last:pb-0 border-b last:border-b-0 border-gray-100">
                    <span className="font-semibold text-gray-800">{key}: </span>
                    <span className="text-gray-700">{value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <button
            className="stripe-button-outline order-2 sm:order-1"
            onClick={onReset}
          >
            Identify Another
          </button>
          
          <button
            className="stripe-button order-1 sm:order-2"
            onClick={() => {
              // This would navigate to premium for more details in a real app
              window.location.href = '/premium';
            }}
          >
            Get Premium Details
          </button>
        </div>
      </div>
    </div>
  );
}
