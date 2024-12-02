import React from 'react';
import VideoPlayer from './components/VideoPlayer';
import ImageOverlayEditor from './components/ImageOverlayEditor';
import './styles/App.css';

function App() {
  return (
    <div className='container centered '>
      <header className="header-section">
        <h1 className="header-title">Mini Video Editor</h1>
      </header>
      <VideoPlayer />
      <ImageOverlayEditor />
    </div>
  );
}

export default App;
