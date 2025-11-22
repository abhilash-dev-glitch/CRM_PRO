import { Link } from "react-router-dom";
import {
  BarChart3,
  FileText,
  Calendar,
  Mail,
  Users,
  LogOut,
  Search,
  Bell,
  Settings,
  Edit3,
  Archive,
  Reply,
  Forward,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Star,
  Trash2,
  X,
  Paperclip,
  Send,
} from "lucide-react";

const AdminMail = ({
  user,
  handleLogout,
  folders,
  labels,
  selectedFolder,
  setSelectedFolder,
  loading,
  emails,
  handleStarEmail,
  handleDeleteEmail,
  showCompose,
  setShowCompose,
  composeData,
  setComposeData,
  handleSendEmail,
}) => {
  return (
    <div className="flex h-screen bg-admin-bg text-admin-text">
      {/* Sidebar */}
      <div className="w-72 bg-admin-sidebar border-r border-gray-800 flex flex-col">
        {/* Nav */}
        <nav className="flex-1 space-y-1 p-4">
          <Link
            to="/admin/dashboard"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-700 transition"
          >
            {/* Add your Dashboard icon component here if you have one */}
            <span className="font-medium">Dashboard</span>
          </Link>

          <Link
            to="/admin/analytics"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-700 transition"
          >
            <BarChart3 className="h-5 w-5" />
            <span className="font-medium">Analytics</span>
          </Link>

          <Link
            to="/admin/reports"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-700 transition"
          >
            <FileText className="h-5 w-5" />
            <span className="font-medium">Reports</span>
          </Link>

          <Link
            to="/admin/calendar"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-700 transition"
          >
            <Calendar className="h-5 w-5" />
            <span className="font-medium">Calendar</span>
          </Link>

          <Link
            to="/admin/mail"
            className="flex items-center gap-3 px-4 py-3 rounded-lg bg-admin-accent text-white"
          >
            <Mail className="h-5 w-5" />
            <span className="font-medium">Mail</span>
          </Link>

          <Link
            to="/admin/users"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-700 transition"
          >
            <Users className="h-5 w-5" />
            <span className="font-medium">Users</span>
          </Link>
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-gray-700">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-admin-accent flex items-center justify-center font-bold">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm">{user?.name}</p>
              <p className="text-xs text-gray-400">Super Admin</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition"
          >
            <LogOut className="h-4 w-4" />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Search */}
            <div className="flex-1 max-w-xl">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search mail..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-admin-accent focus:border-transparent"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition relative">
                <Bell className="h-5 w-5 text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                <Settings className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          </div>
        </header>

        {/* Mail Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Mail Sidebar */}
          <div className="w-64 bg-white border-r border-gray-200 p-4">
            {/* Compose Button */}
            <button
              onClick={() => setShowCompose(true)}
              className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white font-bold py-3 px-4 rounded-lg hover:from-red-600 hover:to-red-700 transition mb-6 flex items-center justify-center gap-2"
            >
              <Edit3 className="h-5 w-5" />
              Compose
            </button>

            {/* Folders */}
            <div className="mb-6">
              <h3 className="text-xs font-bold text-gray-500 uppercase mb-3">
                Folders
              </h3>
              <div className="space-y-1">
                {folders.map((folder) => {
                  const Icon = folder.icon;
                  return (
                    <button
                      key={folder.id}
                      onClick={() => setSelectedFolder(folder.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition ${
                        selectedFolder === folder.id
                          ? "bg-purple-100 text-purple-700"
                          : "text-gray-700 hover:bg-gray-100"
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
              <h3 className="text-xs font-bold text-gray-500 uppercase mb-3">
                Labels
              </h3>
              <div className="space-y-1">
                {labels.map((label, index) => (
                  <button
                    key={index}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition"
                  >
                    <div
                      className={`w-3 h-3 rounded-full ${label.color}`}
                    ></div>
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
                <button className="p-2 hover:bg-purple-100 rounded-lg transition">
                  <Archive className="h-5 w-5 text-purple-600" />
                </button>
                <button className="p-2 hover:bg-purple-100 rounded-lg transition">
                  <Reply className="h-5 w-5 text-purple-600" />
                </button>
                <button className="p-2 hover:bg-purple-100 rounded-lg transition">
                  <Forward className="h-5 w-5 text-purple-600" />
                </button>
                <button className="p-2 hover:bg-purple-100 rounded-lg transition">
                  <MoreVertical className="h-5 w-5 text-purple-600" />
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

            {/* Email Items */}
            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-gray-400">Loading emails...</div>
                </div>
              ) : emails.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <Mail className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 font-medium">
                      No emails in {selectedFolder}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {emails.map((email) => (
                    <div
                      key={email._id}
                      className={`px-6 py-4 hover:bg-gray-50 cursor-pointer transition ${
                        !email.read ? "bg-blue-50/50" : ""
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <input type="checkbox" className="mt-1" />
                        <button
                          onClick={() => handleStarEmail(email._id)}
                          className="mt-1"
                        >
                          <Star
                            className={`h-5 w-5 ${
                              email.starred
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-400"
                            }`}
                          />
                        </button>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <p
                              className={`font-semibold text-admin-primary ${
                                !email.read ? "font-bold" : ""
                              }`}
                            >
                              {selectedFolder === "sent"
                                ? email.to
                                : email.from}
                            </p>
                            <span className="text-sm text-gray-500">
                              {new Date(email.timestamp).toLocaleTimeString(
                                [],
                                { hour: "2-digit", minute: "2-digit" }
                              )}
                            </span>
                          </div>
                          <p
                            className={`text-sm mb-1 ${
                              !email.read
                                ? "font-semibold text-gray-900"
                                : "text-gray-700"
                            }`}
                          >
                            {email.subject}
                          </p>
                          <p className="text-sm text-gray-500 truncate">
                            {email.body}
                          </p>
                        </div>
                        <button
                          onClick={() => handleDeleteEmail(email._id)}
                          className="p-1 hover:bg-red-100 rounded transition"
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Compose Modal */}
      {showCompose && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-bold text-admin-primary">
                New Message
              </h3>
              <button
                onClick={() => setShowCompose(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <X className="h-5 w-5 text-gray-600" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSendEmail} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  To
                </label>
                <input
                  type="email"
                  value={composeData.to}
                  onChange={(e) =>
                    setComposeData({ ...composeData, to: e.target.value })
                  }
                  placeholder="recipient@example.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-admin-accent focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  value={composeData.subject}
                  onChange={(e) =>
                    setComposeData({
                      ...composeData,
                      subject: e.target.value,
                    })
                  }
                  placeholder="Email subject"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-admin-accent focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  value={composeData.body}
                  onChange={(e) =>
                    setComposeData({ ...composeData, body: e.target.value })
                  }
                  placeholder="Write your message..."
                  rows={10}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-admin-accent focus:border-transparent resize-none"
                  required
                ></textarea>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <button
                  type="button"
                  className="p-2 hover:bg-gray-100 rounded-lg transition"
                >
                  <Paperclip className="h-5 w-5 text-gray-600" />
                </button>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowCompose(false)}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-purple-800 transition flex items-center gap-2"
                  >
                    <Send className="h-4 w-4" />
                    Send
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMail;
