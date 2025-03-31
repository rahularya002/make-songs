'use client';
import React, { useState } from 'react';
import { Upload, PlayCircle, Check, X, Loader } from 'lucide-react';

interface UploadSectionProps {
  title: string;
  icon: React.ReactNode;
  acceptedFiles: string;
  description: string;
  uploadType: 'voice' | 'lyrics' | 'dialogue';
}

export function UploadSection({
  title,
  icon,
  acceptedFiles,
  description,
  uploadType
}: UploadSectionProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);
    // Reset states when a new file is selected
    setUploadSuccess(false);
    setUploadError(null);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    setUploadSuccess(false);
    setUploadError(null);

    try {
      // Create form data
      const formData = new FormData();
      formData.append('file', selectedFile);

      // Submit to the appropriate API endpoint
      const response = await fetch(`/api/upload/${uploadType}`, {
        method: 'POST',
        body: formData
      });

      // First check if response is ok
      if (!response.ok) {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const errorData = await response.json();
          throw new Error(errorData.error || `Server error: ${response.status}`);
        } else {
          throw new Error(`Server error: ${response.status}`);
        }
      }

      // Only try to parse JSON if response was ok
      const result = await response.json();
      setUploadSuccess(true);
      console.log('Upload successful:', result);
    } catch (error) {
      console.error(`Upload error:`, error);
      setUploadError(error instanceof Error ? error.message : 'Failed to upload file');
    } finally {
      setUploading(false);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    
    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      const file = event.dataTransfer.files[0];
      // Check if the file type is supported
      const fileExtension = `.${file.name.split('.').pop()}`;
      if (acceptedFiles.includes(fileExtension)) {
        setSelectedFile(file);
        setUploadSuccess(false);
        setUploadError(null);
      } else {
        setUploadError(`Unsupported file type. Please use ${acceptedFiles} files.`);
      }
    }
  };

  const resetUpload = () => {
    setSelectedFile(null);
    setUploadSuccess(false);
    setUploadError(null);
  };

  return (
    <div className="bg-black border border-gray-500/40 p-6 rounded-2xl shadow-sm">
      <div className="flex items-center space-x-3 mb-4">
        <span className="text-primary">{icon}</span>
        <h3 className="text-xl font-semibold text-white-800">{title}</h3>
      </div>
      <p className="text-white-600 mb-4">{description}</p>
      
      <div
        className={`border-2 border-dashed ${uploadSuccess ? 'border-green-500' : uploadError ? 'border-red-500' : 'border-gray-500'} rounded-xl p-6 text-center hover:border-primary transition-colors`}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept={acceptedFiles}
          onChange={handleFileChange}
          className="hidden"
          id={`file-upload-${title}`}
          disabled={uploading}
        />
        
        {!selectedFile ? (
          <label
            htmlFor={`file-upload-${title}`}
            className="cursor-pointer flex flex-col items-center space-y-2"
          >
            <Upload className="text-gray-400 mb-2" size={24} />
            <span className="text-sm text-white-600">
              Click to upload or drag and drop
            </span>
            <span className="text-xs text-gray-400">
              {acceptedFiles.split(',').join(', ')} files supported
            </span>
          </label>
        ) : (
          <div className="flex flex-col items-center">
            {uploading ? (
              <>
                <Loader className="text-primary animate-spin mb-2" size={24} />
                <span className="text-sm text-white-600">Uploading...</span>
              </>
            ) : uploadSuccess ? (
              <>
                <Check className="text-green-500 mb-2" size={24} />
                <span className="text-sm text-green-500">Upload successful!</span>
              </>
            ) : uploadError ? (
              <>
                <X className="text-red-500 mb-2" size={24} />
                <span className="text-sm text-red-500">{uploadError}</span>
              </>
            ) : (
              <>
                <PlayCircle size={24} className="text-indigo-500 mb-2" />
                <span className="text-sm text-white-600">{selectedFile.name}</span>
                <span className="text-xs text-gray-400">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </span>
              </>
            )}
          </div>
        )}
      </div>
      
      {selectedFile && !uploadSuccess && !uploading && (
        <div className="mt-4 flex gap-2 justify-end">
          <button
            onClick={resetUpload}
            className="px-3 py-1 text-white-800 hover:text-red-500 text-sm rounded transition-colors"
            disabled={uploading}
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            className="px-3 py-1 bg-primary text-white text-sm rounded hover:bg-primary/90 transition-colors flex items-center gap-1"
            disabled={uploading}
          >
            <Upload size={16} />
            Upload
          </button>
        </div>
      )}
      
      {uploadSuccess && (
        <div className="mt-4 flex justify-end">
          <button
            onClick={resetUpload}
            className="px-3 py-1 text-white-800 hover:text-primary text-sm rounded transition-colors"
          >
            Upload another file
          </button>
        </div>
      )}
    </div>
  );
}