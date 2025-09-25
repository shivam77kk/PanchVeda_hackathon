import React, { useState } from 'react';
import { User, Edit, Save, X, Camera, Mail, Phone, MapPin, Calendar, Award, Clock } from 'lucide-react';

const DoctorProfile: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [originalData, setOriginalData] = useState({});
  const [profileData, setProfileData] = useState({
    name: 'Dr. Demo User',
    email: 'demo@panchveda.com',
    phone: '+91 98765 43210',
    specialization: 'Panchakarma Specialist',
    experience: '15 years',
    qualification: 'BAMS, MD (Ayurveda)',
    address: '123 Wellness Street, Mumbai, Maharashtra 400001',
    bio: 'Experienced Ayurvedic practitioner specializing in Panchakarma therapies with over 15 years of clinical experience. Passionate about holistic healing and traditional medicine.',
    consultationFee: '₹1,500',
    workingHours: '9:00 AM - 6:00 PM',
    languages: ['English', 'Hindi', 'Marathi'],
    certifications: [
      'Certified Panchakarma Specialist',
      'Ayurvedic Medicine Board Certification',
      'Traditional Healing Practices Certificate'
    ]
  });

  const handleSave = () => {
    // Validate required fields
    if (!profileData.name.trim() || !profileData.email.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(profileData.email)) {
      alert('Please enter a valid email address');
      return;
    }

    try {
      // In a real app, this would make an API call
      console.log('Saving profile:', profileData);
      
      // Simulate API call
      setTimeout(() => {
        setIsEditing(false);
        alert('Profile updated successfully!');
      }, 500);
      
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Failed to save profile. Please try again.');
    }
  };

  const handleCancel = () => {
    // Restore original data
    if (Object.keys(originalData).length > 0) {
      setProfileData(originalData as typeof profileData);
    }
    setIsEditing(false);
  };

  const handleEdit = () => {
    // Store original data for cancel functionality
    setOriginalData({ ...profileData });
    setIsEditing(true);
  };

  const handleChange = (field: string, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const stats = [
    { label: 'Total Patients', value: '1,247', icon: User },
    { label: 'Years Experience', value: '15+', icon: Award },
    { label: 'Success Rate', value: '94%', icon: Calendar },
    { label: 'Consultations', value: '3,456', icon: Clock }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">Doctor Profile</h1>
          {!isEditing ? (
            <button
              onClick={handleEdit}
              className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors flex items-center space-x-2"
            >
              <Edit className="h-5 w-5" />
              <span>Edit Profile</span>
            </button>
          ) : (
            <div className="flex items-center space-x-3">
              <button
                onClick={handleCancel}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
              >
                <X className="h-5 w-5" />
                <span>Cancel</span>
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
              >
                <Save className="h-5 w-5" />
                <span>Save Changes</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-cyan-100 rounded-lg">
                  <IconComponent className="h-6 w-6 text-cyan-600" />
                </div>
              </div>
              <h3 className="text-sm font-medium text-gray-600 mb-2">{stat.label}</h3>
              <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-6">Basic Information</h2>
            
            <div className="space-y-6">
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <div className="w-24 h-24 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                    DU
                  </div>
                  {isEditing && (
                    <button className="absolute -bottom-2 -right-2 p-2 bg-cyan-600 text-white rounded-full hover:bg-cyan-700 transition-colors">
                      <Camera className="h-4 w-4" />
                    </button>
                  )}
                </div>
                
                <div className="flex-1">
                  {isEditing ? (
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      className="text-xl sm:text-2xl font-bold text-gray-800 bg-transparent border-b-2 border-cyan-500 focus:outline-none w-full"
                      required
                    />
                  ) : (
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-800">{profileData.name}</h3>
                  )}
                  
                  {isEditing ? (
                    <input
                      type="text"
                      value={profileData.specialization}
                      onChange={(e) => handleChange('specialization', e.target.value)}
                      className="text-cyan-600 font-medium mt-1 bg-transparent border-b border-gray-300 focus:outline-none focus:border-cyan-500 w-full"
                    />
                  ) : (
                    <p className="text-cyan-600 font-medium mt-1">{profileData.specialization}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-gray-400" />
                    {isEditing ? (
                      <input
                        type="email"
                        value={profileData.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                        required
                      />
                    ) : (
                      <span className="text-gray-700">{profileData.email}</span>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-gray-400" />
                    {isEditing ? (
                      <input
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) => handleChange('phone', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      />
                    ) : (
                      <span className="text-gray-700">{profileData.phone}</span>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Award className="h-5 w-5 text-gray-400" />
                    {isEditing ? (
                      <input
                        type="text"
                        value={profileData.qualification}
                        onChange={(e) => handleChange('qualification', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      />
                    ) : (
                      <span className="text-gray-700">{profileData.qualification}</span>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    {isEditing ? (
                      <input
                        type="text"
                        value={profileData.experience}
                        onChange={(e) => handleChange('experience', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      />
                    ) : (
                      <span className="text-gray-700">{profileData.experience} experience</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-gray-400 mt-1" />
                {isEditing ? (
                  <textarea
                    value={profileData.address}
                    onChange={(e) => handleChange('address', e.target.value)}
                    rows={2}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  />
                ) : (
                  <span className="text-gray-700">{profileData.address}</span>
                )}
              </div>
            </div>
          </div>

          {/* Professional Details */}
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-6">Professional Details</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                {isEditing ? (
                  <textarea
                    value={profileData.bio}
                    onChange={(e) => handleChange('bio', e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-700">{profileData.bio}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Consultation Fee</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profileData.consultationFee}
                      onChange={(e) => handleChange('consultationFee', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-700 font-medium">{profileData.consultationFee}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Working Hours</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profileData.workingHours}
                      onChange={(e) => handleChange('workingHours', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-700">{profileData.workingHours}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Languages */}
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Languages</h3>
            <div className="space-y-2">
              {profileData.languages.map((language, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-gray-700">{language}</span>
                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">Fluent</span>
                </div>
              ))}
            </div>
          </div>

          {/* Certifications */}
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Certifications</h3>
            <div className="space-y-3">
              {profileData.certifications.map((cert, index) => (
                <div key={index} className="p-3 bg-cyan-50 rounded-lg">
                  <p className="text-sm text-cyan-800 font-medium">{cert}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;