"use client"

import { useState, useRef } from "react"
import { Play, Pause } from "lucide-react"
import { Button } from "./ui/button"
import Image from "next/image"
import AudioPlayer from "react-h5-audio-player"
import "react-h5-audio-player/lib/styles.css"

interface Track {
  id: number
  title: string
  genre: string
  duration: string
  image: string
  audio: string
}

const tracks: Track[] = [
  {
    id: 1,
    title: "The Night we Met",
    genre: "Dream House",
    duration: "4:21",
    image: "/Image/sub-img-1.png",
    audio: "/songs/song-1.mp3",
  },
  {
    id: 2,
    title: "Dil ki dhunn",
    genre: "Romantic",
    duration: "4:21",
    image: "/Image/sub-img-2.png",
    audio: "/songs/song-2.mp3",
  },
  {
    id: 3,
    title: "Tere Nam se ",
    genre: "Romantic",
    duration: "4:21",
    image: "/Image/sub-img-3.png",
    audio: "/songs/song-3.mp3",
  },
  {
    id: 4,
    title: "Oh Baby.",
    genre: "Romantic",
    duration: "4:21",
    image: "/Image/sub-img-4.png",
    audio: "/songs/song-4.mp3",
  },
  {
    id: 5,
    title: "Sapno Ki Raat",
    genre: "Romantic",
    duration: "4:21",
    image: "/Image/sub-img-5.png",
    audio: "/songs/song-5.mp3",
  },
]

export default function About() {
  const [currentTrack, setCurrentTrack] = useState<number | null>(null)
  const playerRef = useRef<AudioPlayer | null>(null)

  const handlePlayClick = (trackId: number) => {
    if (currentTrack === trackId) {
      if (playerRef.current) {
        const audioElement = playerRef.current.audio.current;
        if (audioElement) {
          if (audioElement.paused) {
            audioElement.play()
          } else {
            audioElement.pause()
          }
        }
      }
    } else {
      setCurrentTrack(trackId)
    }
  }

  const activeTrack = currentTrack ? tracks.find((track) => track.id === currentTrack) : null

  return (
    <div className="sm:flex gap-2 items-start justify-evenly w-full sm:p-20 p-6">
      <div className="sm:w-96 sm:mr-10">
        <h3 className="text-xs text-primary font-semibold">What we do</h3>
        <h1 className="text-3xl font-semibold mt-4 mb-4 sm:w-64">Create your life&apos;s soundtrack</h1>
        <p className="sm:font-semibold text-white lg:font-light mb-8 sm:text-lg text-md">
          Imagine creating personalized music for your life: a ballad for a romantic date, a banger for a night out with
          friends, a lo-fi track for meditation, or an upbeat song for your child&apos;s birthday. If you can describe it in
          text, you can now express it in music.
        </p>
        <Button variant="outline" className="text-md">
          Create your first song
        </Button>
      </div>
      <div className="my-10 sm:my-0 flex flex-col w-full max-w-lg">
        {tracks.map((track) => (
          <div
            key={track.id}
            className={`flex justify-between bg-transparent gap-3 border rounded-md p-2 my-2 ${currentTrack === track.id ? "shadow-primary-glow border-primary" : "shadow-secondary-glow"}`}
          >
            <div className="flex gap-3 items-center">
              <div className="sm:w-[60px] w-16">
                <Image
                  src={track.image || "/placeholder.svg"}
                  alt={`${track.title} cover`}
                  width={60}
                  height={60}
                  className="rounded-sm"
                />
              </div>
              <div className="max-w-64 sm:leading-4 leading-5 mr-8">
                <h1 className="font-semibold w-full">{track.title}</h1>
                <h3 className="sm:mt-1 text-sm">{track.genre}</h3>
              </div>
            </div>
            <div className="flex items-center sm:gap-10 sm:mx-6 mx-2 gap-2">
              <h1 className="hidden md:flex">{track.duration}</h1>
              <div
                className="flex items-center justify-center w-12 h-12 border rounded-full bg-gray-500/40 cursor-pointer hover:bg-gray-500/60"
                onClick={() => handlePlayClick(track.id)}
              >
                {(() => {
                  const isCurrentTrack = currentTrack === track.id;
                  const audioElement = playerRef.current?.audio.current;
                  const isPlaying = audioElement && !audioElement.paused;
                  
                  return isCurrentTrack && isPlaying ? <Pause /> : <Play />;
                })()}
              </div>
            </div>
          </div>
        ))}

        {activeTrack && (
          <div className="mt-6 border rounded-md p-4 shadow-primary-glow">
            <div className="flex items-center gap-4 mb-3">
              <Image
                src={activeTrack.image || "/placeholder.svg"}
                alt={`${activeTrack.title} cover`}
                width={50}
                height={50}
                className="rounded-sm"
              />
              <div>
                <h2 className="font-semibold">{activeTrack.title}</h2>
                <p className="text-sm">{activeTrack.genre}</p>
              </div>
            </div>
            <AudioPlayer
              ref={playerRef}
              src={activeTrack.audio}
              autoPlay
              className="player-wrapper"
              showJumpControls={true}
              layout="stacked-reverse"
            />
          </div>
        )}
      </div>
    </div>
  )
}
