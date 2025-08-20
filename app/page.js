"use client"; // This is a Next.js directive to make the component interactive on the client side.

import { useState } from 'react';


export default function Home() {
  const [message, setmessage] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!message.trim()) return;

    setIsLoading(true);
    setResponse(''); // Clear previous response

    try {
      // Make a POST request to your API route.
      const res = await fetch("/api/chat", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });

      const data = await res.json();

      if (res.ok) {
        setResponse(data.message);
      } else {
        setResponse(`Error: ${data.error}`);
      }
    } catch (error) {
      setResponse('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-2xl w-full">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">RAG Chatbot</h1>
        
        {/* Input form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mb-6">
          <input
            type="text"
            value={message}
            onChange={(e) => setmessage(e.target.value)}
            placeholder="Ask me about the documents..."
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-3 rounded-md hover:bg-blue-700 transition duration-300 disabled:bg-blue-400"
            disabled={isLoading}
          >
            {isLoading ? 'Thinking...' : 'Get Response'}
          </button>
        </form>

        {/* Response display */}
        <div className="bg-gray-50 p-6 rounded-md border border-gray-200">
          <p className="text-gray-700 whitespace-pre-line">
            {response || (isLoading ? "Please wait while I process your request..." : "Your answer will appear here.")}
          </p>
        </div>
      </div>
    </div>
  );
}
