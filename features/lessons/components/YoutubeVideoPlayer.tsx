import React from "react";

import YouTube from "react-youtube";

const YoutubeVideoPlayer = ({
  videoId,
  onFinishedVideo,
}: {
  videoId: string;
  onFinishedVideo?: () => void;
}) => {
  return (
    <YouTube
      className="w-full h-full"
      videoId={videoId}
      onEnd={onFinishedVideo}
      opts={{ height: "100%", width: "100%" }}
    ></YouTube>
  );
};

export default YoutubeVideoPlayer;
