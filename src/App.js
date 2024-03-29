// import React, { useState, useCallback } from 'react';
// import { useDropzone } from 'react-dropzone';
// import './App.css';

// function App() {
//   const [files, setFiles] = useState([]);
//   const [batchName, setBatchName] = useState('');
//   const [tags, setTags] = useState('');
//   const [uploading, setUploading] = useState(false);
//   const [uploadError, setUploadError] = useState(null);

//   const onDrop = useCallback((acceptedFiles) => {
//     // Do something with the files
//     setFiles(acceptedFiles);
//   }, []);

//   const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

//   const handleUpload = async () => {
//     // Ensure at least one file is selected
//     if (files.length === 0) {
//       setUploadError('No file selected for upload.');
//       return;
//     }

//     // Prepare FormData to send the file
//     const formData = new FormData();
//     formData.append('file', files[0]); // Assuming single file upload, adjust if multiple

//     setUploading(true);
//     setUploadError(null);

//     try {
//       const response = await fetch('/api/upload', { // This endpoint will be created in the backend
//         method: 'POST',
//         body: formData,
//       });
      
//       if (!response.ok) throw new Error('Network response was not ok.');
//       const data = await response.json();
//       console.log('File uploaded:', data);
//       setFiles([]); // Clear the files after upload
//     } catch (error) {
//       setUploadError(error.message);
//     } finally {
//       setUploading(false);
//     }
//   };



//   return (
//     <div className="App">
//       <header className="App-header">
//         <h1>Upload Your P&L Data</h1>
//         <input 
//           type="text"
//           className="batch-name-input"
//           placeholder="Batch Name"
//           value={batchName}
//           onChange={(e) => setBatchName(e.target.value)}
//         />
//         <input 
//           type="text"
//           className="tags-input"
//           placeholder="Search or add tags..."
//           value={tags}
//           onChange={(e) => setTags(e.target.value)}
//         />
//       </header>
//       <main>
//         <div {...getRootProps()} className={`dropzone ${isDragActive ? 'active' : ''}`}>
//           <input {...getInputProps()} />
//           {isDragActive ? (
//             <p>Drop the files here ...</p>
//           ) : (
//             <p>Drag 'n' drop some files here, or click to select files</p>
//           )}
//         </div>
//         {files.length > 0 && (
//           <div>
//             <h3>Files Ready to Upload</h3>
//             <ul>
//               {files.map(file => (
//                 <li key={file.path}>{file.path} - {file.size} bytes</li>
//               ))}
//             </ul>
//           </div>
//         )}
//         <button onClick={handleUpload} disabled={uploading}>
//           {uploading ? 'Uploading...' : 'Upload Files'}
//         </button>
//         {uploadError && <p className="error">{uploadError}</p>}
//       </main>
//     </div>
//   );
// }

// export default App;

import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import './App.css';
import Summary from './Summary';







const StarProduct = () => (
  <div className="content-page">
    <h1>Star Product Page</h1>
    <Link to="/">Go Back to Upload</Link>
  </div>
);

const Modal = ({ setShowModal }) => {
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    setShowModal(false);
    navigate(path);
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <button onClick={() => handleNavigate('/star-product')}>Star Product</button>
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
      <Route path="/star-product" element={<StarProduct />} />
      <Route path="/summary" element={<Summary />} />
    </Routes>
  </Router>
);

export default App;