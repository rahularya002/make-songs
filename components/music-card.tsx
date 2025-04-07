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
          title="Dil ki dhunn "
          subTitle="Kriti Sanon "
          duration="3:28"
          audioSrc="/songs/song-2.mp3" // Added audio source
        />
      </div>
      <div className="sm:flex">
        <AudioPlayer
          icon={<Play />}
          image="/Image/sample.jpg"
          title="Tere Nam se "
          subTitle="Kriti Sanon"
          duration="3:28"
          audioSrc="/songs/song-3.mp3" // Added audio source
        />
        <AudioPlayer
          icon={<Play />}
          image="/Image/sample.jpg"
          title="Oh Baby."
          subTitle="Thalapathy Vijay"
          duration="3:28"
          audioSrc="/songs/song-4.mp3" // Added audio source
        />
        <AudioPlayer
          icon={<Play />}
          image="/Image/sample.jpg"
          title="Sapno Ki Raat"
          subTitle="Kriti Sanon"
          duration="3:28"
          audioSrc="/songs/song-5.mp3" // Added audio source
        />
      </div>
    </div>
  );
}