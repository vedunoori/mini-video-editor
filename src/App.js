import React from 'react';
import VideoPlayer from './components/VideoPlayer';
import TextOverlayEditor from './components/TextOverlayEditor';
import ImageOverlayEditor from './components/ImageOverlayEditor';
import './styles/App.css';

function App() {
  return (
    <div className='container centered '>
    {/* Header Section */}
      <header className="header-section">
        <h1 className="header-title">Mini Video Editor</h1>
      </header>
      <VideoPlayer />
      {/* <TextOverlayEditor /> */}
      <ImageOverlayEditor />
    </div>
  );
}

export default App;
