import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ReactPlayer from 'react-player';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';
import { Box, Button, CircularProgress } from '@mui/material';
import TextOverlayEditor from './TextOverlayEditor';
import {
  setVideoFile,
  setTrimTimes,
  setOutputVideo,
  updateOverlay,
} from '../store/editorStore';
import Draggable from 'react-draggable';

const VideoPlayer = () => {
  const dispatch = useDispatch();
  const { videoFile, startTime, endTime, overlays } = useSelector((state) => state.editor);
  // const outputVideo = useSelector((state) => state.editor.outputVideo);

  const playerRef = useRef(null);
  const [startInput, setStartInput] = useState(startTime);
  const [endInput, setEndInput] = useState(endTime);
  // const [outputVideo, setOutputVideo] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [ffmpeg] = useState(new FFmpeg({ log: true }));
  const [isLoaded, setIsLoaded] = useState(false);

  // Load FFmpeg
  const loadFFmpeg = async () => {
    if (!isLoaded) {
      await ffmpeg.load();
      setIsLoaded(true);
    }

  };

  // Handle file upload
  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileURL = URL.createObjectURL(file);
      dispatch(setVideoFile(fileURL)); 
    }
  };

  const handleSaveTrim = async () => {
    const start = parseFloat(startInput);
    const end = parseFloat(endInput);

    if (start >= 0 && end > start) {
      dispatch(setTrimTimes(start, end)); 

      // Filter and adjust overlays
      const adjustedOverlays = overlays
        .filter((overlay) => overlay.timestamp >= start && overlay.timestamp <= end)
        .map((overlay) => ({
          ...overlay,
          timestamp: overlay.timestamp - start, 
        }));

      await trimVideo(start, end, adjustedOverlays);
    } else {
      alert('Invalid trim times. Ensure end time is greater than start time.');
    }
  };

  

  

  // Trim video with FFmpeg
  const trimVideo = async (start, end, adjustedOverlays) => {
    try {
      // Load FFmpeg
      await loadFFmpeg();
  
      // Write input video file to FFmpeg's virtual file system
      await ffmpeg.writeFile('input.mp4', await fetchFile(videoFile));
  
      // Trim video using FFmpeg
      await ffmpeg.exec([
        '-i', 'input.mp4',
        '-ss', `${start}`,
        '-to', `${end}`,
        '-c:v', 'libx264',
        //   "-vf", drawtext=text='${text}':fontcolor=white:fontsize=24:x=(w-text_w)/2:y=(h-text_h)/2:enable='between(t,${start},${end})',
        '-preset', 'fast',
        '-crf', '23',
        'output.mp4',
      ]);

  
      // Read trimmed video
      const data = await ffmpeg.readFile('output.mp4');
  
      // Convert output to URL
      const videoURL = URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' }));

      dispatch(setOutputVideo(videoURL)); // Save in Redux store
      setIsLoaded(false);
    } catch (error) {
      console.error('Error trimming video:', error);
      alert('Failed to trim video. Please check the console for details.');
    }
  };
  

  const handleProgress = (progress) => {
    setCurrentTime(progress.playedSeconds);
  };
  const handleUpdatePosition = (id, position) => {
    dispatch(updateOverlay({ id, changes: { position } }));
  };
  return (
    <div className="container">
      <section className="video-section">
        <input type="file" accept="video/*" onChange={handleUpload} />

        {videoFile && (
          <div className="video-container" style={{ position: 'relative' }}>
            <ReactPlayer
              ref={playerRef}
              url={videoFile}
              controls
              width="100%"
              height="100%"
              onProgress={handleProgress}
            />

{overlays
          .filter((o) => o.type === 'text')
          .map((overlay) => (
            <Draggable
              key={overlay.id}
              defaultPosition={overlay.position}
              onStop={(e, data) => handleUpdatePosition(overlay.id, { x: data.x, y: data.y })}
            >
              <Box
                sx={{
                  position: 'absolute',
                  fontSize: `${overlay.content.fontSize}px`,
                  color: overlay.content.fontColor,
                  fontFamily: overlay.content.fontFamily,
                  cursor: 'move',
                  userSelect: 'none',
                }}
              >
                {overlay.content.text}
              </Box>
            </Draggable>
          ))}

            {/* Text Overlays */}
            {/* {overlays
              .filter((overlay) => overlay.type === 'text' && overlay.timestamp <= currentTime)
              .map((overlay) => (
                <div
                  key={overlay.id}
                  style={{
                    zIndex:'100000000',
                    position: 'absolute',
                    left: overlay.position.x,
                    top: overlay.position.y,
                    fontSize: `${overlay.content.fontSize}px`,
                    color: overlay.content.fontColor,
                    fontFamily: overlay.content.fontFamily,
                    pointerEvents: 'none',
                  }}
                >
                  {overlay.content.text}
                </div>
              ))} */}
          </div>
        )}
      </section>

      {/* Controls Section */}
      {videoFile && (
        <section className="controls-section">
          <div className="controls">
            <div>
              <label>
                Start Time (seconds):{' '}
                <input
                  type="number"
                  value={startInput}
                  onChange={(e) => setStartInput(e.target.value)}
                  min="0"
                  step="0.1"
                />
              </label>
            </div>
            <div>
              <label>
                End Time (seconds):{' '}
                <input
                  type="number"
                  value={endInput}
                  onChange={(e) => setEndInput(e.target.value)}
                  min="0"
                  step="0.1"
                />
              </label>
            </div>
            <Button variant="contained" 
                  startIcon={isLoaded ? <CircularProgress size={24} color="inherit" /> : null} // Show spinner while loading

            onClick={handleSaveTrim}>
              Save Trim
            </Button>
            {/* <Button variant="outlined" onClick={handleReset}>
              Reset
            </Button> */}
          </div>
        </section>
      )}

      

      <TextOverlayEditor />
    </div>
  );
};

export default VideoPlayer;
