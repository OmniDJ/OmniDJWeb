import React from "react";

export const VideosArchive = () => {
  return (
    <>
      <div className="flex flex-col border border-blue-900 mb-10">
        <div className="grid grid-cols-2">
          <video
            className="border-r border-b border-blue-900"
            controls
            src="https://omnidj.kig.ro/videos/demo-omnidj-short.mp4"
          />
          <video
            className="border-b border-blue-900"
            controls
            src="https://omnidj.kig.ro/videos/demo-omnidj-full.mp4"
          />
        </div>
        <div className="grid grid-cols-2">
          <video
            className="border-r border-blue-900"
            controls
            src="https://omnidj.kig.ro/videos/omnidj-horeca-1.mp4"
          />
          <video
            className="border-blue-900"
            controls
            src="https://omnidj.kig.ro/videos/omnidj-horeca-2.mp4"
          />
        </div>
      </div>
    </>
  );
};
