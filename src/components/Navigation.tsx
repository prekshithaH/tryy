import React, { useState } from 'react';
import { Heart, User, LogOut, Bell, Camera, Edit3, Phone, Calendar, Weight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Patient } from '../types';

const Navigation: React.FC = () => {
  const { user, logout } = useAuth();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const calculateAge = (dueDate: string) => {
    // Assuming average pregnancy age of 28 if no birth date available
    // In a real app, you'd store the actual birth date
    return 28;
  };

  const handleProfilePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // In a real app, you'd upload to a server
      const reader = new FileReader();
      reader.onload = (e) => {
        // Update user avatar in localStorage
        const updatedUser = { ...user, avatar: e.target?.result as string };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        // Update in registered users as well
        const existingUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
        const userIndex = existingUsers.findIndex((u: any) => u.id === user?.id);
        if (userIndex !== -1) {
          existingUsers[userIndex] = { ...existingUsers[userIndex], avatar: e.target?.result as string };
          localStorage.setItem('registeredUsers', JSON.stringify(existingUsers));
        }
        
        // Force a page refresh to update the UI
        window.location.reload();
      };
      reader.readAsDataURL(file);
    }
  };

  const ProfileModal = () => {
    const patient = user as Patient;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">Profile Details</h2>
              <button
                onClick={() => setShowProfileModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <LogOut className="w-5 h-5 text-gray-500 transform rotate-45" />
              </button>
            </div>
            
            {/* Profile Photo Section */}
            <div className="text-center mb-6">
              <div className="relative inline-block">
                <div className="w-24 h-24 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-3 mx-auto overflow-hidden">
                  {user?.avatar ? (
                    <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    user?.name?.charAt(0).toUpperCase()
                  )}
                </div>
                <label className="absolute -bottom-1 -right-1 bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full cursor-pointer transition-colors">
                  <Camera className="w-4 h-4" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePhotoUpload}
                    className="hidden"
                  />
                </label>
              </div>
              <h3 className="text-lg font-semibold text-gray-800">{user?.name}</h3>
              <p className="text-sm text-gray-600 capitalize">{user?.role}</p>
            </div>
            
            {/* Profile Information */}
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <User className="w-5 h-5 text-gray-500" />
                  <span className="font-medium text-gray-700">Personal Information</span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Name:</span>
                    <span className="font-medium">{user?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Age:</span>
                    <span className="font-medium">{patient?.dueDate ? calculateAge(patient.dueDate) : 'Not set'} years</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span className="font-medium">{user?.email}</span>
                  </div>
                </div>
              </div>
              
              {user?.role === 'patient' && (
                <>
                  <div className="bg-pink-50 rounded-lg p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <Calendar className="w-5 h-5 text-pink-500" />
                      <span className="font-medium text-gray-700">Pregnancy Details</span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Current Week:</span>
                        <span className="font-medium">{patient?.currentWeek || 'Not set'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Due Date:</span>
                        <span className="font-medium">{patient?.dueDate || 'Not set'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Blood Type:</span>
                        <span className="font-medium">{patient?.bloodType || 'Not set'}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <Phone className="w-5 h-5 text-blue-500" />
                      <span className="font-medium text-gray-700">Emergency Contacts</span>
                    </div>
                    {patient?.emergencyContacts && patient.emergencyContacts.length > 0 ? (
                      <div className="space-y-2">
                        {patient.emergencyContacts.slice(0, 2).map((contact, index) => (
                          <div key={contact.id} className="text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">{contact.name}:</span>
                              <span className="font-medium">{contact.phone}</span>
                            </div>
                            <div className="text-xs text-gray-500">{contact.relationship}</div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">No emergency contacts set</p>
                    )}
                  </div>
                  
                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <Weight className="w-5 h-5 text-green-500" />
                      <span className="font-medium text-gray-700">Health Information</span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Doctor:</span>
                        <span className="font-medium">{patient?.doctorName || 'Not set'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Hospital:</span>
                        <span className="font-medium">{patient?.hospitalName || 'Not set'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Allergies:</span>
                        <span className="font-medium">{patient?.allergies || 'None'}</span>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-200">
              <button
                onClick={() => {
                  setShowProfileModal(false);
                  // In a real app, this would open an edit profile form
                  alert('Edit profile functionality would be implemented here');
                }}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-3 rounded-lg font-medium hover:from-pink-600 hover:to-purple-600 transition-all flex items-center justify-center space-x-2"
              >
                <Edit3 className="w-4 h-4" />
                <span>Edit Profile</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <Heart className="w-8 h-8 text-pink-500 mr-2" />
                <span className="text-xl font-bold text-gray-800">MomCare</span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <Bell className="w-5 h-5 text-gray-600" />
              </button>
              
              <div className="relative">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                      className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center text-white font-medium hover:from-pink-600 hover:to-purple-600 transition-all overflow-hidden"
                    >
                      {user?.avatar ? (
                        <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        user?.name?.charAt(0).toUpperCase()
                      )}
                    </button>
                    <div>
                      <p className="text-sm font-medium text-gray-800">{user?.name}</p>
                      <p className="text-xs text-gray-600 capitalize">{user?.role}</p>
                    </div>
                  </div>
                  
                  <button
                    onClick={logout}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <LogOut className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
                
                {/* Profile Dropdown */}
                {showProfileDropdown && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center text-white font-medium overflow-hidden">
                          {user?.avatar ? (
                            <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                          ) : (
                            user?.name?.charAt(0).toUpperCase()
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{user?.name}</p>
                          <p className="text-sm text-gray-600">{user?.email}</p>
                        </div>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => {
                        setShowProfileDropdown(false);
                        setShowProfileModal(true);
                      }}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3 transition-colors"
                    >
                      <User className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-700">View Profile</span>
                    </button>
                    
                    <button
                      onClick={() => {
                        setShowProfileDropdown(false);
                        // In a real app, this would open settings
                        alert('Settings functionality would be implemented here');
                      }}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3 transition-colors"
                    >
                      <Edit3 className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-700">Settings</span>
                    </button>
                    
                    <div className="border-t border-gray-100 mt-2 pt-2">
                      <button
                        onClick={() => {
                          setShowProfileDropdown(false);
                          logout();
                        }}
                        className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3 transition-colors text-red-600"
                      >
                        <LogOut className="w-4 h-4" />
                        <span className="text-sm">Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
      
      {/* Profile Modal */}
      {showProfileModal && <ProfileModal />}
      
      {/* Click outside to close dropdown */}
      {showProfileDropdown && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowProfileDropdown(false)}
        />
      )}
    </>
  );
};

export default Navigation;