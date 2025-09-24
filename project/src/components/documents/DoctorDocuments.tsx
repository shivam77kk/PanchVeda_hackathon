import React, { useState } from 'react';
import { Upload, FileText, Image, Download, Trash2 } from 'lucide-react';
import DocumentTile from './DocumentTile';
import UploadProgress from './UploadProgress';

const DoctorDocuments: React.FC = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const documents = [
    {
      id: 1,
      name: "Treatment Guidelines.pdf",
      type: "pdf",
      size: "2.4 MB",
      uploadDate: "2024-01-15",
      preview: null
    },
    {
      id: 2,
      name: "Anatomy Chart.jpg",
      type: "image",
      size: "1.8 MB",
      uploadDate: "2024-01-10",
      preview: "https://images.pexels.com/photos/356040/pexels-photo-356040.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop"
    },
    {
      id: 3,
      name: "Research Paper.pdf",
      type: "pdf",
      size: "5.2 MB",
      uploadDate: "2024-01-08",
      preview: null
    }
  ];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setUploading(false);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Document Library</h1>
        <div className="flex space-x-3">
          <input
            type="file"
            id="file-upload"
            className="hidden"
            onChange={handleFileUpload}
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          />
          <label
            htmlFor="file-upload"
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors cursor-pointer flex items-center space-x-2 w-full sm:w-auto justify-center"
          >
            <Upload size={20} />
            <span>Upload Document</span>
          </label>
        </div>
      </div>

      {uploading && <UploadProgress progress={uploadProgress} />}

      <div className="bg-white rounded-xl border border-gray-100 p-4 sm:p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">My Documents</h2>
          <div className="text-sm text-gray-500">{documents.length} documents</div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {documents.map((doc) => (
            <DocumentTile key={doc.id} document={doc} />
          ))}
        </div>

        {documents.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText size={32} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Documents Yet</h3>
            <p className="text-gray-500 mb-6">
              Upload your first document to get started
            </p>
            <label
              htmlFor="file-upload-empty"
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors cursor-pointer inline-flex items-center space-x-2"
            >
              <Upload size={20} />
              <span>Upload Document</span>
            </label>
            <input
              type="file"
              id="file-upload-empty"
              className="hidden"
              onChange={handleFileUpload}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorDocuments;