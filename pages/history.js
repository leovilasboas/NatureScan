import { useQuery, useMutation } from 'react-query';
import Head from 'next/head';
import { useState } from 'react';
import HistoryItem from '../components/HistoryItem';

export default function History() {
  const [filter, setFilter] = useState('all');
  
  const { data: historyItems = [], isLoading, isError, refetch } = useQuery(
    ['history', filter],
    async () => {
      const response = await fetch(`/api/history?type=${filter}`);
      if (!response.ok) {
        throw new Error('Failed to fetch history');
      }
      return response.json();
    }
  );

  const clearMutation = useMutation(
    async () => {
      const response = await fetch('/api/history', {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to clear history');
      }
      return response.json();
    },
    {
      onSuccess: () => {
        refetch();
      },
    }
  );

  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to clear your history?')) {
      clearMutation.mutate();
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Head>
        <title>Identification History | NatureID</title>
        <meta name="description" content="View your plant and animal identification history" />
      </Head>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-6">
          <h1 className="text-3xl font-bold text-center mb-6 text-green-800">
            Identification History
          </h1>

          <div className="flex justify-between items-center mb-6">
            <div className="flex border rounded-lg overflow-hidden shadow-sm">
              <button
                className={`py-2 px-4 ${filter === 'all' ? 'bg-green-600 text-white' : 'bg-white text-gray-700'}`}
                onClick={() => setFilter('all')}
              >
                All
              </button>
              <button
                className={`py-2 px-4 ${filter === 'plant' ? 'bg-green-600 text-white' : 'bg-white text-gray-700'}`}
                onClick={() => setFilter('plant')}
              >
                Plants
              </button>
              <button
                className={`py-2 px-4 ${filter === 'animal' ? 'bg-green-600 text-white' : 'bg-white text-gray-700'}`}
                onClick={() => setFilter('animal')}
              >
                Animals
              </button>
            </div>
            <button
              className="text-red-600 hover:text-red-800 font-medium"
              onClick={handleClearHistory}
              disabled={historyItems.length === 0}
            >
              Clear History
            </button>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-10">
              <svg className="animate-spin h-10 w-10 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          ) : isError ? (
            <div className="p-4 mb-6 bg-red-100 text-red-700 rounded-lg">
              <p className="font-semibold">Error loading history.</p>
              <p>Please try again later.</p>
            </div>
          ) : historyItems.length === 0 ? (
            <div className="text-center py-12">
              <img src="/icons/history.svg" alt="History" className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-medium text-gray-600">No history yet</h3>
              <p className="text-gray-500 mt-2">Identify plants and animals to see your history here</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {historyItems.map((item) => (
                <HistoryItem key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
