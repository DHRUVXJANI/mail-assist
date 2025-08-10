import React, { useState, useEffect } from 'react';
import { Send, Mail, Sparkles, Copy, Check, Moon, Sun, Menu } from 'lucide-react';
import Sidebar from './Sidebar';

const EmailResponseGenerator = () => {
  const [inputEmail, setInputEmail] = useState('');
  const [selectedTone, setSelectedTone] = useState('professional');
  const [generatedResponse, setGeneratedResponse] = useState('');
  const [editableResponse, setEditableResponse] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [customPrompt, setCustomPrompt] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'signup'
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [emails, setEmails] = useState([]);
  const [selectedEmailId, setSelectedEmailId] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toneOptions = [
    { value: 'professional', label: 'Professional', description: 'Formal and business-appropriate' },
    { value: 'casual', label: 'Casual', description: 'Friendly and relaxed' },
    { value: 'apologetic', label: 'Apologetic', description: 'Expressing regret or understanding' },
    { value: 'enthusiastic', label: 'Enthusiastic', description: 'Positive and energetic' },
    { value: 'concise', label: 'Concise', description: 'Brief and to the point' },
    { value: 'diplomatic', label: 'Diplomatic', description: 'Tactful and considerate' }
  ];

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Fetch history when logged in
  useEffect(() => {
    if (token) {
      fetch('https://mailassist-backend.onrender.com/history', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => setEmails(data.emails || []));
    }
  }, [token]);

  // Auth handlers
  const handleAuth = async (e) => {
    e.preventDefault();
    setAuthError('');
    try {
      const res = await fetch(`https://mailassist-backend.onrender.com/${authMode}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: authEmail, password: authPassword })
      });
      const data = await res.json();
      if (res.ok && data.token) {
        setToken(data.token);
        localStorage.setItem('token', data.token);
        setAuthEmail('');
        setAuthPassword('');
      } else {
        setAuthError(data.error || 'Authentication failed');
      }
    } catch (err) {
      setAuthError('Network error');
    }
  };

  const handleLogout = () => {
    setToken('');
    localStorage.removeItem('token');
    setEmails([]);
    setSelectedEmailId(null);
  };

  const generateResponse = async () => {
    if (!inputEmail.trim()) {
      alert('Please paste an email to respond to');
      return;
    }
    setIsGenerating(true);
    const emailText = inputEmail;
    const tone = selectedTone;
    try {
      const response = await fetch('https://mailassist-backend.onrender.com/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ emailText, tone, customPrompt })
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setGeneratedResponse(data.response);
      setEditableResponse(data.response);
      setIsEditMode(false);
      // Refresh history
      const histRes = await fetch('https://mailassist-backend.onrender.com/history', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const histData = await histRes.json();
      setEmails(histData.emails || []);
    } catch (error) {
      alert('Failed to generate response. Please check if the backend server is running on port 5000.');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(editableResponse);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const clearAll = () => {
    setInputEmail('');
    setGeneratedResponse('');
    setSelectedTone('professional');
    setCustomPrompt('');
  };

  // Sidebar select handler
  const handleSelectEmail = (email) => {
    setSelectedEmailId(email._id);
    setInputEmail('');
    setGeneratedResponse(email.response);
    setEditableResponse(email.response);
    setIsEditMode(false);
    setCustomPrompt('');
    setSelectedTone('professional');
    setIsSidebarOpen(false); // close drawer on select
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-indigo-50 to-purple-100">
        <form onSubmit={handleAuth} className="bg-white/80 dark:bg-gray-900/90 p-10 rounded-3xl shadow-2xl w-full max-w-sm space-y-6 border border-blue-100 dark:border-gray-800">
          <div className="flex flex-col items-center mb-2">
            <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-2">
              <Mail className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-1">{authMode === 'login' ? 'Login' : 'Sign Up'}</h2>
          </div>
          {authError && <div className="text-red-500 text-sm text-center">{authError}</div>}
          <input type="email" required placeholder="Email" value={authEmail} onChange={e => setAuthEmail(e.target.value)} className="w-full p-3 border border-blue-100 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-white/80 dark:bg-gray-800/80 text-gray-800 dark:text-gray-100 placeholder-gray-400" />
          <input type="password" required placeholder="Password" value={authPassword} onChange={e => setAuthPassword(e.target.value)} className="w-full p-3 border border-blue-100 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent bg-white/80 dark:bg-gray-800/80 text-gray-800 dark:text-gray-100 placeholder-gray-400" />
          <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold text-lg shadow-md hover:from-blue-700 hover:to-purple-700 transition-all duration-200">{authMode === 'login' ? 'Login' : 'Sign Up'}</button>
          <div className="text-center text-sm text-gray-500 dark:text-gray-400">
            {authMode === 'login' ? (
              <>Don't have an account? <button type="button" className="text-blue-600 underline font-medium" onClick={() => setAuthMode('signup')}>Sign Up</button></>
            ) : (
              <>Already have an account? <button type="button" className="text-blue-600 underline font-medium" onClick={() => setAuthMode('login')}>Login</button></>
            )}
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex transition-all duration-300 ${isDarkMode ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-black' : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'}`}>
      {/* Sidebar Drawer */}
      <Sidebar
        emails={emails}
        onSelect={handleSelectEmail}
        selectedId={selectedEmailId}
        isDarkMode={isDarkMode}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      {/* Main Content */}
      <div className="flex-1 p-4">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center gap-1"
              aria-label="Open history sidebar"
            >
              <Menu className="w-6 h-6" />
              <span className="hidden sm:inline font-medium"></span>
            </button>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">MailAssist</h1>
          </div>
          <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold">Logout</button>
        </div>
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4 relative">
              <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full">
                <Mail className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                MailAssist
              </h1>
              
              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className={`absolute right-0 p-3 rounded-full transition-all duration-200 hover:scale-110 ${
                  isDarkMode 
                    ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600' 
                    : 'bg-white text-gray-600 hover:bg-gray-100 shadow-lg'
                }`}
              >
                {isDarkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
              </button>
            </div>
            <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Generate professional email responses with the perfect tone using Google Gemini AI
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Input Section */}
            <div className="space-y-6">
              <div className={`rounded-2xl shadow-xl p-6 border transition-all duration-300 ${
                isDarkMode 
                  ? 'bg-gray-800 border-gray-700' 
                  : 'bg-white border-gray-100'
              }`}>
                <h2 className={`text-2xl font-semibold mb-4 flex items-center gap-2 ${
                  isDarkMode ? 'text-gray-100' : 'text-gray-800'
                }`}>
                  <Sparkles className="w-6 h-6 text-blue-600" />
                  Input Email
                </h2>
                
                <textarea
                  value={inputEmail}
                  onChange={(e) => setInputEmail(e.target.value)}
                  placeholder="Paste the email you want to respond to here..."
                  className={`w-full h-64 p-4 border rounded-xl resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400' 
                      : 'bg-white border-gray-200 text-gray-700 placeholder-gray-500'
                  }`}
                />
              </div>

              <div className={`rounded-2xl shadow-xl p-6 border transition-all duration-300 ${
                isDarkMode 
                  ? 'bg-gray-800 border-gray-700' 
                  : 'bg-white border-gray-100'
              }`}>
                <h3 className={`text-xl font-semibold mb-4 ${
                  isDarkMode ? 'text-gray-100' : 'text-gray-800'
                }`}>Custom Instructions <span className="text-sm font-normal text-gray-400">(Optional)</span></h3>
                <textarea
                  value={customPrompt}
                  onChange={e => setCustomPrompt(e.target.value)}
                  placeholder="e.g., Make it concise and friendly"
                  className={`w-full h-20 p-3 border rounded-xl resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400' 
                      : 'bg-white border-gray-200 text-gray-700 placeholder-gray-500'
                  }`}
                />
              </div>

              <div className={`rounded-2xl shadow-xl p-6 border transition-all duration-300 ${
                isDarkMode 
                  ? 'bg-gray-800 border-gray-700' 
                  : 'bg-white border-gray-100'
              }`}>
                <h3 className={`text-xl font-semibold mb-4 ${
                  isDarkMode ? 'text-gray-100' : 'text-gray-800'
                }`}>Choose Response Tone</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {toneOptions.map((tone) => (
                    <label
                      key={tone.value}
                      className={`cursor-pointer p-4 rounded-xl border-2 transition-all duration-200 hover:shadow-md ${
                        selectedTone === tone.value
                          ? 'border-blue-500 shadow-md' +
                            (isDarkMode ? ' bg-blue-900/30' : ' bg-blue-50')
                          : isDarkMode 
                            ? 'border-gray-600 hover:border-gray-500 bg-gray-700/50' 
                            : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                    >
                      <input
                        type="radio"
                        name="tone"
                        value={tone.value}
                        checked={selectedTone === tone.value}
                        onChange={(e) => setSelectedTone(e.target.value)}
                        className="sr-only"
                      />
                      <div className={`font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                        {tone.label}
                      </div>
                      <div className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {tone.description}
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={generateResponse}
                  disabled={isGenerating || !inputEmail.trim()}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  {isGenerating ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Generating with AI...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Generate Response
                    </>
                  )}
                </button>
                
                <button
                  onClick={clearAll}
                  className={`px-6 py-4 rounded-xl font-semibold transition-all duration-200 ${
                    isDarkMode 
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Clear All
                </button>
              </div>
            </div>

            {/* Output Section */}
            <div className="space-y-6">
              <div className={`rounded-2xl shadow-xl p-6 border transition-all duration-300 ${
                isDarkMode 
                  ? 'bg-gray-800 border-gray-700' 
                  : 'bg-white border-gray-100'
              }`}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className={`text-2xl font-semibold flex items-center gap-2 ${
                    isDarkMode ? 'text-gray-100' : 'text-gray-800'
                  }`}>
                    <Mail className="w-6 h-6 text-green-600" />
                    AI Generated Response
                  </h2>
                  {generatedResponse && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => setIsEditMode((prev) => !prev)}
                        className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                          isDarkMode 
                            ? 'bg-blue-900/30 text-blue-400 hover:bg-blue-900/50' 
                            : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                        }`}
                      >
                        {isEditMode ? 'Preview' : 'Edit'}
                      </button>
                      <button
                        onClick={copyToClipboard}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                          isDarkMode 
                            ? 'bg-green-900/30 text-green-400 hover:bg-green-900/50' 
                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                        }`}
                      >
                        {copied ? (
                          <>
                            <Check className="w-4 h-4" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" />
                            Copy
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
                
                {generatedResponse ? (
                  isEditMode ? (
                    <textarea
                      value={editableResponse}
                      onChange={e => setEditableResponse(e.target.value)}
                      className={`w-full h-64 p-4 border rounded-xl resize-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 ${
                        isDarkMode 
                          ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400' 
                          : 'bg-white border-gray-200 text-gray-700 placeholder-gray-500'
                      }`}
                    />
                  ) : (
                    <div className={`rounded-xl p-4 border transition-all duration-300 ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600' 
                        : 'bg-gray-50 border-gray-200'
                    }`}>
                      <pre className={`whitespace-pre-wrap font-sans leading-relaxed ${
                        isDarkMode ? 'text-gray-200' : 'text-gray-700'
                      }`}>
                        {editableResponse}
                      </pre>
                    </div>
                  )
                ) : (
                  <div className={`rounded-xl p-8 border text-center transition-all duration-300 ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600' 
                      : 'bg-gray-50 border-gray-200'
                  }`}>
                    <div className={`mb-2 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                      <Mail className="w-12 h-12 mx-auto opacity-50" />
                    </div>
                    <p className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>
                      Your AI-generated response will appear here
                    </p>
                  </div>
                )}
              </div>

              {generatedResponse && (
                <div className={`rounded-2xl shadow-xl p-6 border transition-all duration-300 ${
                  isDarkMode 
                    ? 'bg-gray-800 border-gray-700' 
                    : 'bg-white border-gray-100'
                }`}>
                  <h3 className={`text-lg font-semibold mb-3 ${
                    isDarkMode ? 'text-gray-100' : 'text-gray-800'
                  }`}>Quick Tips</h3>
                  <ul className={`space-y-2 text-sm ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      Review the AI-generated response for accuracy and relevance
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      Add personal touches and specific details as needed
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      Ensure the tone matches your professional relationship
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Connection Status */}
        <div className={`mt-8 p-4 rounded-lg text-center text-sm ${
          isDarkMode 
            ? 'bg-gray-800 border border-gray-700 text-gray-300' 
            : 'bg-gray-50 border border-gray-200 text-gray-600'
        }`}>
          <span className="inline-flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            Connected to Google Gemini AI (localhost:5000)
          </span>
        </div>
      </div>
    </div>
  );
};

export default EmailResponseGenerator;