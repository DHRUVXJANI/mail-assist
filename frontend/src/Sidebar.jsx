import React from 'react';
import { Mail, X } from 'lucide-react';

const Sidebar = ({ emails, onSelect, selectedId, isDarkMode, isOpen, onClose }) => {
  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-30 transition-opacity duration-300"
          onClick={onClose}
        />
      )}
      {/* Drawer */}
      <aside
        className={`fixed top-0 left-0 h-full w-80 flex-shrink-0 border-r shadow-xl z-40 transform transition-transform duration-300
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          ${isDarkMode ? 'bg-gradient-to-b from-gray-900 via-gray-800 to-black border-gray-800' : 'bg-gradient-to-b from-blue-100 via-indigo-50 to-purple-50 border-gray-200'}
        `}
        style={{ willChange: 'transform' }}
      >
        <div className="flex items-center justify-between gap-3 p-6 border-b mb-2">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full">
              <Mail className="w-6 h-6 text-white" />
            </div>
            <span className={`font-bold text-xl tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent`}>History</span>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
            <X className="w-5 h-5 text-gray-500 dark:text-gray-300" />
          </button>
        </div>
        <ul className="px-2 pb-4 space-y-2">
          {emails.length === 0 ? (
            <li className="p-6 text-center text-gray-400 text-sm rounded-xl bg-white/40 dark:bg-gray-800/40 mt-8 shadow-inner">No previous emails</li>
          ) : (
            emails.map(email => (
              <li
                key={email._id}
                className={`group cursor-pointer rounded-xl px-4 py-3 transition-all duration-200 flex flex-col shadow-sm
                  ${selectedId === email._id
                    ? isDarkMode
                      ? 'bg-blue-900/60 border border-blue-700 text-blue-100'
                      : 'bg-blue-100 border border-blue-300 text-blue-900'
                    : isDarkMode
                      ? 'hover:bg-gray-800/80 text-gray-200'
                      : 'hover:bg-white/80 text-gray-700'}
                `}
                onClick={() => onSelect(email)}
              >
                <div className="font-medium truncate text-base flex-1">
                  {email.response.slice(0, 40) || 'No subject'}
                </div>
                <div className="text-xs mt-1 text-gray-400 group-hover:text-blue-500">
                  {new Date(email.createdAt).toLocaleString()}
                </div>
              </li>
            ))
          )}
        </ul>
      </aside>
    </>
  );
};

export default Sidebar; 