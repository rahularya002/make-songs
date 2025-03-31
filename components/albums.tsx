"use client"
import Image from "next/image"
import type React from "react"
import { useState, useRef,   JSX } from "react"
import { Play, Pause, X } from "lucide-react"
import AudioPlayer from 'react-h5-audio-player'
import 'react-h5-audio-player/lib/styles.css'

interface Album {
  id: number
  title: string
  artist: string
  genre: string
  image: string
  audioSrc: string
}

export default function Albums(): JSX.Element {
  const [hoveredAlbum, setHoveredAlbum] = useState<number | null>(null)
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [currentAlbum, setCurrentAlbum] = useState<number | null>(null)
  const [showPlayer, setShowPlayer] = useState<boolean>(true)

  const playerRef = useRef<AudioPlayer>(null)

  const albums: Album[] = [
    {
      id: 1,
      title: "God, are you there ?",
      artist: "DannoOppo",
      genre: "Folk",
      image: "/Image/image-1.png",
      audioSrc: "/songs/song-1.mp3", 
    },
    {
      id: 2,
      title: "I let you down ?",
      artist: "MrTomMusic",
      genre: "Electronic",
      image: "/Image/image-2.png",
      audioSrc: "/songs/song-1.mp3",
    },
    {
      id: 3,
      title: "Friday Night Ride",
      artist: "DannoOppo",
      genre: "Hip Hop",
      image: "/Image/image-3.png",
      audioSrc: "/songs/song-1.mp3",
    },
    {
      id: 4,
      title: "Pro Castinator",
      artist: "Jakemarsh",
      genre: "Rock",
      image: "/Image/image-4.png",
      audioSrc: "/songs/song-1.mp3",
    },
    {
      id: 5,
      title: "Monster Monster",
      artist: "DannoOppo",
      genre: "Folk",
      image: "/Image/image-5.png",
      audioSrc: "/songs/song-1.mp3",
    },
  ]

  const handlePlay = (albumId: number): void => {
    const album = albums.find((a) => a.id === albumId)
    if (!album) return

    if (currentAlbum === albumId && isPlaying) {
      // Pause current track
      playerRef.current?.audio.current?.pause()
      setIsPlaying(false)
    } else if (currentAlbum === albumId && !isPlaying) {
      // Resume current track
      playerRef.current?.audio.current?.play()
      setIsPlaying(true)
    } else {
      // Play a new track
      setCurrentAlbum(albumId)
      setIsPlaying(true)
      setShowPlayer(true)
    }
  }

  return (
    <div className="flex flex-col items-center w-full">
      {/* Albums Grid */}
      <div className="sm:flex flex-wrap items-center justify-center gap-16 sm:m-20">
        {albums.map((album) => (
          <div key={album.id} className="flex items-center flex-col my-4">
            <div
              className="w-44 h-44 rounded-lg relative overflow-hidden"
              onMouseEnter={() => setHoveredAlbum(album.id)}
              onMouseLeave={() => setHoveredAlbum(null)}
            >
              <Image
                src={album.image || "/placeholder.svg"}
                alt={album.title}
                width={176}
                height={176}
                className={`transition-all duration-300 ${
                  hoveredAlbum === album.id || currentAlbum === album.id ? "scale-110 blur-sm" : ""
                }`}
              />
              {(hoveredAlbum === album.id || currentAlbum === album.id) && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 transition-opacity duration-300">
                  <button
                    className="bg-white rounded-full p-3 shadow-lg hover:bg-gray-100 transition-colors"
                    onClick={() => handlePlay(album.id)}
                    aria-label={`${isPlaying && currentAlbum === album.id ? "Pause" : "Play"} ${album.title}`}
                  >
                    {isPlaying && currentAlbum === album.id ? (
                      <Pause size={28} className="text-black" />
                    ) : (
                      <Play size={28} className="text-black ml-1" />
                    )}
                  </button>
                </div>
              )}
            </div>
            <h1 className="font-semibold text-center mt-3">{album.title}</h1>
            <h3 className="text-gray-500/60 font-semibold text-sm text-center">{album.artist}</h3>
            <h3 className="text-sm font-semibold bg-gray-500/20 rounded-full text-center px-3 mt-1">{album.genre}</h3>
          </div>
        ))}
      </div>

      {/* Audio Player Controls using react-h5-audio-player */}
      {currentAlbum !== null && showPlayer && (
        <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white p-4 z-10">
          <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded overflow-hidden">
                <Image
                  src={albums.find((a) => a.id === currentAlbum)?.image || ""}
                  alt="Now playing"
                  width={48}
                  height={48}
                />
              </div>
              <div>
                <p className="font-medium">{albums.find((a) => a.id === currentAlbum)?.title}</p>
                <p className="text-sm text-gray-400">{albums.find((a) => a.id === currentAlbum)?.artist}</p>
              </div>
            </div>

            <div className="flex-grow mx-4 w-full">
              <AudioPlayer
                ref={playerRef}
                src={albums.find((a) => a.id === currentAlbum)?.audioSrc}
                autoPlay
                showJumpControls={true}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onEnded={() => setIsPlaying(false)}
                layout="stacked"
                showSkipControls={false}
                className="bg-transparent border-none"
                style={{
                  background: 'transparent',
                  boxShadow: 'none',
                }}
                customControlsSection={
                  [
                    <div className="flex items-center justify-center" key="controls">
                      <div className="rhap_main-controls">{/* This will render default controls */}</div>
                      <div className="rhap_volume-controls">{/* This will render default volume controls */}</div>
                    </div>
                  ]
                }
                customProgressBarSection={
                  [
                    <div className="flex items-center w-full gap-2" key="progress">
                      <div className="rhap_current-time rhap_time text-xs text-white" />
                      <div className="rhap_progress-container flex-grow" />
                      <div className="rhap_total-time rhap_time text-xs text-white" />
                    </div>
                  ]
                }
              />
            </div>

            <button 
              className="text-white hover:text-gray-300 ml-4" 
              onClick={() => setShowPlayer(false)}
            >
              <X size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}