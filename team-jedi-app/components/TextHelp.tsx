"use client";

// Author: Calis W
// This item is to gain extra credit for final project
// Demonstrate a link you have created to in-App Text Help. This link will
// allow App users to ask questions from online text-based Tech Support staff. The link
// should include the stipulation of the hours (M-F 7 am – 7 pm) when in-App text help is
// available. It should also include a privacy warning that warns users that the Tech
// Support staff can view the data that the user has entered into the system.

import { useState } from 'react';

interface TextHelpProps {
  userData?: any;
}

export default function TextHelp({ userData }: TextHelpProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [question, setQuestion] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // In production, this would send to a backend service
    console.log('Support question:', question);
    console.log('User data (for support reference):', userData);
    setSubmitted(true);
    setTimeout(() => {
      setIsOpen(false);
      setSubmitted(false);
      setQuestion('');
    }, 3000);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-blue-600 text-white rounded-full p-4 shadow-lg hover:bg-blue-700 transition-all z-40"
        aria-label="Get help"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-black">Text-Based Support</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>

              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                <p className="text-yellow-800 text-sm">
                  <strong>Privacy Warning:</strong> Support staff can view the data you have entered 
                  into this application to better assist you. For privacy concerns, please review 
                  our privacy policy.
                </p>
              </div>

              <div className="bg-blue-50 p-3 rounded mb-4">
                <p className="text-blue-800 text-sm">
                  <strong>Support Hours:</strong> Monday-Friday, 7:00 AM - 7:00 PM CST
                </p>
              </div>

              {!submitted ? (
                <form onSubmit={handleSubmit}>
                  <label className="block mb-2 text-black font-medium">
                    How can we help you today?
                  </label>
                  <textarea
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    className="w-full p-3 border rounded-md text-black mb-4"
                    rows={4}
                    placeholder="Describe your question or issue..."
                    required
                  />
                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                  >
                    Send Message
                  </button>
                </form>
              ) : (
                <div className="text-center py-4">
                  <p className="text-green-600 mb-2">✓ Message sent!</p>
                  <p className="text-gray-600">A support agent will respond within 24 hours.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}