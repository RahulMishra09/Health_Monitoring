import React, { useState, useRef } from 'react';
import { FileText, Download, Filter, Plus, X, Upload } from 'lucide-react';

function Records() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadForm, setUploadForm] = useState({
    title: '',
    doctor: '',
    category: ''
  });
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const medicalRecords = [
    {
      id: 1,
      title: 'Annual Physical Examination',
      date: '2024-02-15',
      doctor: 'Dr. James Wilson',
      category: 'Examination',
      fileSize: '2.4 MB'
    },
    {
      id: 2,
      title: 'Blood Test Results',
      date: '2024-02-10',
      doctor: 'Dr. Sarah Smith',
      category: 'Lab Results',
      fileSize: '1.8 MB'
    },
    {
      id: 3,
      title: 'COVID-19 Vaccination Record',
      date: '2024-01-25',
      doctor: 'Dr. Michael Johnson',
      category: 'Immunization',
      fileSize: '1.2 MB'
    },
    {
      id: 4,
      title: 'Cardiology Report',
      date: '2024-01-15',
      doctor: 'Dr. Emily Brown',
      category: 'Specialist',
      fileSize: '3.1 MB'
    },
    {
      id: 5,
      title: 'Prescription History',
      date: '2024-01-10',
      doctor: 'Dr. Lisa Anderson',
      category: 'Medication',
      fileSize: '1.5 MB'
    }
  ];

  const categories = ['all', 'Examination', 'Lab Results', 'Immunization', 'Specialist', 'Medication'];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError('');
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const fileType = file.type;
      const validTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'image/jpeg',
        'image/jpg',
        'image/png'
      ];

      if (!validTypes.includes(fileType)) {
        setError('Please upload a valid file type (PDF, DOC, DOCX, JPG, JPEG, PNG)');
        setUploadedFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        return;
      }

      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        setError('File size should be less than 10MB');
        setUploadedFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        return;
      }

      setUploadedFile(file);
    }
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!uploadedFile) {
      setError('Please select a file to upload');
      return;
    }

    if (!uploadForm.title.trim()) {
      setError('Please enter a document title');
      return;
    }

    if (!uploadForm.doctor.trim()) {
      setError('Please enter doctor\'s name');
      return;
    }

    if (!uploadForm.category) {
      setError('Please select a category');
      return;
    }

    // Here you would typically upload the file to your backend
    console.log('Uploading:', { ...uploadForm, file: uploadedFile });
    
    // Reset form
    setShowUploadModal(false);
    setUploadedFile(null);
    setUploadForm({
      title: '',
      doctor: '',
      category: ''
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleModalClose = () => {
    setShowUploadModal(false);
    setUploadedFile(null);
    setUploadForm({
      title: '',
      doctor: '',
      category: ''
    });
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const filteredRecords = selectedCategory === 'all'
    ? medicalRecords
    : medicalRecords.filter(record => record.category === selectedCategory);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Medical Records</h1>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Filter className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-gray-700 text-white pl-10 pr-4 py-2 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <button 
            onClick={() => setShowUploadModal(true)}
            className="bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600 flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Upload New Record</span>
          </button>
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-700">
              <th className="text-left py-4 px-6">Document</th>
              <th className="text-left py-4 px-6">Date</th>
              <th className="text-left py-4 px-6">Doctor</th>
              <th className="text-left py-4 px-6">Category</th>
              <th className="text-left py-4 px-6">Size</th>
              <th className="text-right py-4 px-6">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredRecords.map((record) => (
              <tr key={record.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                <td className="py-4 px-6">
                  <div className="flex items-center space-x-3">
                    <FileText className="w-5 h-5 text-teal-500" />
                    <span>{record.title}</span>
                  </div>
                </td>
                <td className="py-4 px-6">{record.date}</td>
                <td className="py-4 px-6">{record.doctor}</td>
                <td className="py-4 px-6">
                  <span className="px-3 py-1 rounded-full text-sm bg-teal-500/20 text-teal-400">
                    {record.category}
                  </span>
                </td>
                <td className="py-4 px-6">{record.fileSize}</td>
                <td className="py-4 px-6 text-right">
                  <button className="text-teal-400 hover:text-teal-300">
                    <Download className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-white">Upload New Record</h2>
              <button
                onClick={handleModalClose}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            {error && (
              <div className="mb-4 p-3 bg-red-500/20 text-red-400 rounded-lg text-sm">
                {error}
              </div>
            )}
            <form onSubmit={handleUploadSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Document Title
                </label>
                <input
                  type="text"
                  value={uploadForm.title}
                  onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                  className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="Enter document title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Doctor's Name
                </label>
                <input
                  type="text"
                  value={uploadForm.doctor}
                  onChange={(e) => setUploadForm({ ...uploadForm, doctor: e.target.value })}
                  className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="Enter doctor's name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Category
                </label>
                <select
                  value={uploadForm.category}
                  onChange={(e) => setUploadForm({ ...uploadForm, category: e.target.value })}
                  className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="">Select a category</option>
                  {categories.filter(cat => cat !== 'all').map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Upload File
                </label>
                <div 
                  className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center relative cursor-pointer hover:border-teal-500 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {uploadedFile ? (
                    <div className="flex items-center justify-center space-x-2 text-gray-300">
                      <Upload className="w-5 h-5" />
                      <span>{uploadedFile.name}</span>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Upload className="w-8 h-8 mx-auto text-gray-400" />
                      <p className="text-sm text-gray-400">
                        Click to select a file
                      </p>
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    onChange={handleFileUpload}
                    className="hidden"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={handleModalClose}
                  className="px-4 py-2 text-gray-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-teal-500 text-white px-6 py-2 rounded-lg hover:bg-teal-600"
                >
                  Upload
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Records;