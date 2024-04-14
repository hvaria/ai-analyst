import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import './App.css';
import Summary from './Summary';





const Modal = ({ setShowModal }) => {
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    setShowModal(false);
    navigate(path);
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <button onClick={() => handleNavigate('/summary')}>Summary</button>
      </div>
    </div>
  );
};

const UploadPage = () => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [showModal, setShowModal] = useState(false);

  const onDrop = useCallback((acceptedFiles) => {
    setFiles(acceptedFiles);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleUpload = async () => {
    if (files.length === 0) {
      setUploadError('No file selected for upload.');
      return;
    }

    setUploading(true);
    setUploadError(null);

    const formData = new FormData();
    formData.append('file', files[0]);

    try {
      const response = await fetch('/api/upload', { method: 'POST', body: formData });
      if (!response.ok) throw new Error(`Server responded with ${response.status}: ${response.statusText}`);
      const data = await response.json();
      console.log('File uploaded:', data);
      setShowModal(true);
    } catch (error) {
      console.error('Upload failed:', error);
      setUploadError('Upload failed. Please try again.');
    } finally {
      setUploading(false);
      setFiles([]);
    }
  };

  return (
    <div className="upload-page">
      <header className="App-header">
        <h1>Upload Your P&L Data</h1>
      </header>
      <main>
        <div {...getRootProps()} className={`dropzone ${isDragActive ? 'active' : ''}`}>
          <input {...getInputProps()} />
          <p>{isDragActive ? "Drop the files here ..." : "Drag 'n' drop some files here, or click to select files"}</p>
        </div>
        <button onClick={handleUpload} disabled={uploading || files.length === 0}>
          {uploading ? 'Uploading...' : 'Upload Files'}
        </button>
        {uploadError && <p className="error">{uploadError}</p>}
        {showModal && <Modal setShowModal={setShowModal} />}
      </main>
    </div>
  );
};

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<UploadPage />} />
      <Route path="/summary" element={<Summary />} />
    </Routes>
  </Router>
);

export default App;