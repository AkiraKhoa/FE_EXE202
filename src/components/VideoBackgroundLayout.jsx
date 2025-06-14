import { useEffect } from "react";
import { Outlet } from "react-router-dom";

const VideoBackgroundLayout = () => {
  useEffect(() => {
    // Delay video loading slightly to improve initial render performance
    const video = document.querySelector("video");
    if (video) {
      video.load(); // Ensures video loads only after initial render
    }
  }, []);

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden">
      <video
        autoPlay
        muted
        loop
        className="fixed inset-0 w-full h-full object-cover z-[-1] opacity-900/50"
        preload="none"
      >
        <source src="/Cooking.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <Outlet />
    </div>
  );
};

export default VideoBackgroundLayout;
