"use client"
import { AudioLines, MicVocal } from "lucide-react";
import { Button } from "./ui/button";
import MusicCard from "./music-card";
import FileUpload from "./ui/file-upload";
import { motion } from "framer-motion";

export default function Hero() {
  const handleVoiceFile = (file: File) => {
    console.log("Voice Files:", file);
  };

  const handleLyricsFile = (file: File) => {
    console.log("Lyrics File:", file);
    // Add further logic to handle the lyrics file here
  };

  return (
    <div className="w-full flex items-center justify-center my-40">
      <div className="flex items-center flex-col sm:py-20">
        <motion.h1
          initial={{ opacity: 0, y: 20}}
          animate={{ opacity: 1, y: 0}}
          transition={{ duration: 1, ease: "easeInOut"}} 
          className="sm:text-6xl text-center font-bold text-4xl"
          >
            Make your Music
        </motion.h1>
        <h3 className="sm:text-2xl text-md text-gray-500/80 text-center sm:w-96 w-64 mx-auto sm:my-5 my-2">
          Create any song. Just give your voice or upload your lyrics.
        </h3>
        <div className="flex gap-3 my-20">
          {/* Upload Voice */}
          <Button variant={"outline"}>
            <FileUpload
              label="Upload your voice"
              accept="audio/*"
              icon={<AudioLines className="mr-2" />}
              onFileSelect={handleVoiceFile}
            />
          </Button>

          {/* Upload Lyrics */}
          <Button>
            <FileUpload
              label="Upload your lyrics"
              accept=".txt,.pdf"
              icon={<MicVocal className="mr-2" />}
              onFileSelect={handleLyricsFile}
            />
          </Button>
        </div>
        <MusicCard />
      </div>
    </div>
  );
}
