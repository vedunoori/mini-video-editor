import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addOverlay, updateOverlay } from '../store/editorStore'; // Redux actions
import Draggable from 'react-draggable';
import { Box, Button } from '@mui/material';

const ImageOverlayEditor = () => {
  const dispatch = useDispatch();
  const overlays = useSelector((state) => state.editor.overlays);
  const [image, setImage] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) setImage(file);
  };

  const handleAddImage = () => {
    if (!image) return;

    const overlay = {
      id: Date.now().toString(), // Unique ID for the overlay
      type: 'image',
      timestamp: 0,
      content: {
        src: URL.createObjectURL(image), // Create object URL for the image
        width: 100,
        height: 100,
      },
      position: { x: 50, y: 50 }, // Initial position of the image
    };

    dispatch(addOverlay(overlay));
    setImage(null); 
  };

  return (
    <Box sx={{ padding: '20px' }}>

      <input type="file" accept="image/*" onChange={handleImageUpload} />
      <Button variant="contained" onClick={handleAddImage}>
        Add Image
      </Button>

  
      {overlays
        .filter((overlay) => overlay.type === 'image')
        .map((overlay) => (
          <Draggable
            key={overlay.id}
            defaultPosition={overlay.position}
            onStop={(e, data) =>
              dispatch(
                updateOverlay({ id: overlay.id, changes: { position: { x: data.x, y: data.y } } })
              )
            }
          >
            <img
              src={overlay.content.src}
              style={{
                position: 'absolute',
                width: `${overlay.content.width}px`,
                height: `${overlay.content.height}px`,
              }}
              alt="Overlay"
            />
          </Draggable>
        ))}
    </Box>
  );
};

export default ImageOverlayEditor;
