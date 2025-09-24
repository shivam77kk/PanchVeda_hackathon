import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { User, Save, Camera } from 'lucide-react';
import ProfileForm from './ProfileForm';

const DoctorProfile: React.FC = () => {
  const { showToast } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: 'Dr. Rajesh Sharma',
    email: 'rajesh.sharma@panchveda.com',
    phone: '+91 98765 43210',
    specialization: 'Panchakarma Specialist',
    experience: '15 years',
    qualification: 'BAMS, MD (Panchakarma)',
    licenseNo: 'IN-AY-12345',
    consultationMode: 'hybrid',
    bio: 'Experienced Ayurvedic physician specializing in Panchakarma therapies with over 15 years of practice. Passionate about traditional healing methods and personalized patient care.'
  });

  const handleSave = (updatedProfile: any) => {
    setProfile(updatedProfile);
    setIsEditing(false);
    showToast('Profile updated successfully!', 'success');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Doctor Profile</h1>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2 w-full sm:w-auto justify-center"
        >
          {isEditing ? <Save size={20} /> : <User size={20} />}
          <span>{isEditing ? 'Cancel' : 'Edit Profile'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-1">
          <div className="bg-white rounded-xl border border-gray-100 p-6 text-center">
            <div className="relative mb-4">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <User size={48} className="text-green-600" />
              </div>
              {isEditing && (
                <button className="absolute -bottom-2 right-1/2 transform translate-x-1/2 bg-green-600 text-white p-2 rounded-full hover:bg-green-700 transition-colors">
                  <Camera size={16} />
                </button>
              )}
            </div>
            
            <h2 className="text-xl font-semibold text-gray-900 mb-1">{profile.name}</h2>
            <p className="text-green-600 font-medium mb-3">{profile.specialization}</p>
            <div className="text-sm text-gray-500 space-y-1">
              <p>{profile.experience} experience</p>
              <p>{profile.qualification}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-6 mt-6">
            <h3 className="font-semibold text-gray-900 mb-4">Practice Statistics</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Patients</span>
                <span className="font-medium">1,247</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Active Plans</span>
                <span className="font-medium">89</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Success Rate</span>
                <span className="font-medium text-green-600">94%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="xl:col-span-2">
          {isEditing ? (
            <ProfileForm profile={profile} onSave={handleSave} />
          ) : (
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-gray-100 p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Contact Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <p className="text-gray-900">{profile.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <p className="text-gray-900">{profile.phone}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-100 p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Professional Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">License Number</label>
                    <p className="text-gray-900">{profile.licenseNo}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Consultation Mode</label>
                    <p className="text-gray-900 capitalize">{profile.consultationMode}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-100 p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Biography</h3>
                <p className="text-gray-600 leading-relaxed">{profile.bio}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;