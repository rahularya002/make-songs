import { Play } from "lucide-react";
import AudioPlayer from "./ui/music";

export default function MusicCard() {
  return (
    <div className="flex items-center flex-col mt-20">
      <div className="sm:flex">
        <AudioPlayer
          icon={<Play />}
          image="/Image/sample.jpg"
          title="The Night we Met"
          subTitle="Lord huron"
          duration="3:28"
          audioSrc="/songs/song-1.mp3" // Added audio source
        />
        <AudioPlayer
          icon={<Play />}
          image="/Image/sample.jpg"
          title="The Night we Met"
          subTitle="Lord huron"
          duration="3:28"
          audioSrc="/songs/song-1.mp3" // Added audio source
        />
      </div>
      <div className="sm:flex">
        <AudioPlayer
          icon={<Play />}
          image="/Image/sample.jpg"
          title="The Night we Met"
          subTitle="Lord huron"
          duration="3:28"
          audioSrc="/songs/song-1.mp3" // Added audio source
        />
        <AudioPlayer
          icon={<Play />}
          image="/Image/sample.jpg"
          title="The Night we Met"
          subTitle="Lord huron"
          duration="3:28"
          audioSrc="/songs/song-1.mp3" // Added audio source
        />
        <AudioPlayer
          icon={<Play />}
          image="/Image/sample.jpg"
          title="The Night we Met"
          subTitle="Lord huron"
          duration="3:28"
          audioSrc="/songs/song-1.mp3" // Added audio source
        />
      </div>
    </div>
  );
}