
import { useState, JSX } from "react";

interface FileUploadProps {
  label: string;
  accept: string;
  icon: JSX.Element;
  onFileSelect: (file: File) => void;
}

export default function FileUpload({ label, accept, icon, onFileSelect }: FileUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setSelectedFile(file); // Set the file in the internal state
      onFileSelect(file); // Notify the parent component
    }
  };

  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <div className="flex items-center">
        {icon}
        <span>{label}</span>
      </div>
      <input
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
      />
      {selectedFile && (
        <p className="text-xs text-gray-500 mt-2">{selectedFile.name}</p> // Display the selected file name
      )}
    </label>
  );
}
