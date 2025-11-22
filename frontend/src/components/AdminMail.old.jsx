import React, { useState, useEffect } from 'react';
import { Search, Edit3, Mail, Send, FileText, Trash2, Star, MoreVertical, ChevronLeft, ChevronRight, X, Paperclip } from 'lucide-react';

const AdminMail = () => {
  // State for emails and UI
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFolder, setSelectedFolder] = useState('inbox');
  const [showCompose, setShowCompose] = useState(false);
  
  // Compose email state
  const [composeData, setComposeData] = useState({
    to: '',
    subject: '',
    body: ''
  });

  // Sample folders data
  const folders = [
    { id: 'inbox', name: 'Inbox', icon: Mail, count: 12 },
    { id: 'sent', name: 'Sent', icon: Send, count: 0 },
    { id: 'drafts', name: 'Drafts', icon: FileText, count: 3 },
    { id: 'trash', name: 'Trash', icon: Trash2, count: 0 },
  ];

  // Sample labels data
  const labels = [
    { name: 'Work', color: 'bg-blue-500' },
    { name: 'Personal', color: 'bg-green-500' },
    { name: 'Important', color: 'bg-yellow-500' },
    { name: 'Travel', color: 'bg-purple-500' }
  ];

  // Fetch emails when component mounts or folder changes
  useEffect(() => {
    const fetchEmails = async () => {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        // Set mock data
        setEmails([
          {
            _id: '1',
            from: 'john.doe@example.com',
            to: 'me@example.com',
            subject: 'Weekly Team Meeting',
            body: 'Hi team, just a reminder about our weekly meeting tomorrow at 10 AM.',
            timestamp: new Date(),
            read: false,
            starred: true
          },
          {
            _id: '2',
            from: 'support@company.com',
            to: 'me@example.com',
            subject: 'Your subscription has been renewed',
            body: 'Thank you for renewing your subscription with us!',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
            read: true,
            starred: false
          }
        ]);
      } catch (error) {
        console.error('Error fetching emails:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmails();
  }, [selectedFolder]);

  // Handle sending email
  const handleSendEmail = (e) => {
    e.preventDefault();
    console.log('Sending email:', composeData);
    setShowCompose(false);
    setComposeData({ to: '', subject: '', body: '' });
  };

  // Handle starring an email
  const handleStarEmail = (emailId) => {
    setEmails(emails.map(email => 
      email._id === emailId 
        ? { ...email, starred: !email.starred } 
        : email
    ));
  };

  // Handle deleting an email
  const handleDeleteEmail = (emailId) => {
    if (window.confirm('Are you sure you want to delete this email?')) {
      setEmails(emails.filter(email => email._id !== emailId));
    }
  };

  return (
    <div className="h-full flex overflow-hidden">
      {/* Mail Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 p-4">
        {/* Compose Button */}
        <button
          onClick={() => setShowCompose(true)}
          className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white font-bold py-3 px-4 rounded-lg hover:from-purple-700 hover:to-purple-800 transition mb-6 flex items-center justify-center gap-2"
        >
          <Edit3 className="h-5 w-5" />
          Compose
        </button>

          {/* Folders */}
          <div className="mb-6">
            <h3 className="text-xs font-bold text-gray-500 uppercase mb-3">Folders</h3>
            <div className="space-y-1">
              {folders.map((folder) => {
                const Icon = folder.icon;
                return (
                  <button
                    key={folder.id}
                    onClick={() => setSelectedFolder(folder.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition ${
                      selectedFolder === folder.id
                        ? 'bg-purple-100 text-purple-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="h-5 w-5" />
                      <span className="font-medium">{folder.name}</span>
                    </div>
                    {folder.count > 0 && (
                      <span className="bg-purple-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                        {folder.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Labels */}
          <div>
            <h3 className="text-xs font-bold text-gray-500 uppercase mb-3">Labels</h3>
            <div className="space-y-1">
              {labels.map((label, index) => (
                <button
                  key={index}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition"
                >
                  <div className={`w-3 h-3 rounded-full ${label.color}`}></div>
                  <span className="font-medium">{label.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Email List */}
        <div className="flex-1 bg-white overflow-hidden flex flex-col">
          {/* Toolbar */}
          <div className="border-b border-gray-200 px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <input type="checkbox" className="h-4 w-4 text-purple-600 rounded" />
              <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                <Archive className="h-5 w-5 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                <Trash2 className="h-5 w-5 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                <MoreVertical className="h-5 w-5 text-gray-600" />
              </button>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                <ChevronLeft className="h-5 w-5 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                <ChevronRight className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Email List */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div>Loading emails...</div>
              </div>
            ) : emails.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <Mail className="h-16 w-16 mb-4" />
                <p>No emails in {selectedFolder}</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {emails.map((email) => (
                  <div
                    key={email._id}
                    className={`p-4 hover:bg-gray-50 cursor-pointer ${
                      !email.read ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-purple-600 rounded"
                        />
                        <button onClick={() => handleStarEmail(email._id)}>
                          <Star
                            className={`h-5 w-5 ${
                              email.starred ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                            }`}
                          />
                        </button>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p
                            className={`font-medium ${
                              !email.read ? 'font-bold text-gray-900' : 'text-gray-700'
                            }`}
                          >
                            {email.from}
                          </p>
                          <span className="text-xs text-gray-500">
                            {new Date(email.timestamp).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                        <p
                          className={`text-sm ${
                            !email.read ? 'font-semibold' : 'text-gray-600'
                          }`}
                        >
                          {email.subject}
                        </p>
                        <p className="text-sm text-gray-500 truncate">{email.body}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Compose Email Modal */}
      {showCompose && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">New Message</h3>
              <button
                onClick={() => setShowCompose(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSendEmail} className="p-4 space-y-4">
              <div>
                <input
                  type="email"
                  placeholder="To"
                  value={composeData.to}
                  onChange={(e) =>
                    setComposeData({ ...composeData, to: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Subject"
                  value={composeData.subject}
                  onChange={(e) =>
                    setComposeData({ ...composeData, subject: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <textarea
                  placeholder="Message"
                  rows="10"
                  value={composeData.body}
                  onChange={(e) =>
                    setComposeData({ ...composeData, body: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                ></textarea>
              </div>
              <div className="flex justify-between items-center pt-2 border-t">
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                  >
                    Send
                  </button>
                  <button
                    type="button"
                    className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
                  >
                    <Paperclip className="h-5 w-5" />
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => setShowCompose(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
                >
                  Discard
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
</div>

{/* Compose Email Modal */}
{showCompose && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="text-lg font-semibold">New Message</h3>
        <button
          onClick={() => setShowCompose(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      <form onSubmit={handleSendEmail} className="p-4 space-y-4">
        <div>
          <input
            type="email"
            placeholder="To"
            value={composeData.to}
            onChange={(e) =>
              setComposeData({ ...composeData, to: e.target.value })
            }
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            required
          />
        </div>
        <div>
          <input
            type="text"
            placeholder="Subject"
            value={composeData.subject}
            onChange={(e) =>
              setComposeData({ ...composeData, subject: e.target.value })
            }
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
        <div>
          <textarea
            placeholder="Message"
            rows="10"
            value={composeData.body}
            onChange={(e) =>
              setComposeData({ ...composeData, body: e.target.value })
            }
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          ></textarea>
        </div>
        <div className="flex justify-between items-center pt-2 border-t">
          <div className="flex gap-2">
            <button
              type="submit"
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
            >
              Send
            </button>
            <button
              type="button"
              className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
            >
              <Paperclip className="h-5 w-5" />
            </button>
          </div>
          <button
            type="button"
            onClick={() => setShowCompose(false)}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
          >
            Discard
          </button>
        </div>
      </form>
    </div>
  </div>
)}
</div>