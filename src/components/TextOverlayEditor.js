import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addOverlay, updateOverlay } from '../store/editorStore';
import Draggable from 'react-draggable';
import { Button, TextField, MenuItem, Box, Typography } from '@mui/material';

const TextOverlayEditor = () => {
  const dispatch = useDispatch();
  const overlays = useSelector((state) => state.editor.overlays); 

  const [text, setText] = useState('');
  const [fontSize, setFontSize] = useState('');
  const [fontColor, setFontColor] = useState('#FFFFFF');
  const [fontFamily, setFontFamily] = useState('Arial');

  const handleAddText = () => {
    const overlay = {
      id: Date.now().toString(), 
      type: 'text',
      timestamp: 0,
      content: {
        text,
        fontSize,
        fontColor,
        fontFamily,
      },
      position: { x: 50, y: 50 },
    };

    dispatch(addOverlay(overlay));

    // Reset form fields
    setText('');
    setFontSize('');
    setFontColor('#FFFFFF');
    setFontFamily('Arial');
  };

  const handleUpdatePosition = (id, position) => {
    dispatch(updateOverlay({ id, changes: { position } }));
  };

  return (
    <Box sx={{ padding: '20px' }}>
      <Typography variant="h6" gutterBottom>
        Text Overlay Editor
      </Typography>

      <Box
        sx={{
          display: 'flex',
          gap: '10px',
          flexWrap: 'wrap',
          marginBottom: '20px',
          alignItems: 'center',
        }}
      >
        <TextField
          label="Text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          variant="outlined"
          size="small"
          sx={{ flex: '1' }}
        />
        <TextField
          label="Font Size"
          type="number"
          value={fontSize}
          onChange={(e) => setFontSize(e.target.value)}
          variant="outlined"
          size="small"
          sx={{ width: '100px' }}
        />
        <TextField
          label="Font Color"
          type="color"
          value={fontColor}
          onChange={(e) => setFontColor(e.target.value)}
          variant="outlined"
          size="small"
          sx={{ width: '80px' }}
        />
        <TextField
          select
          label="Font Family"
          value={fontFamily}
          onChange={(e) => setFontFamily(e.target.value)}
          variant="outlined"
          size="small"
          sx={{ flex: '1' }}
        >
          <MenuItem value="Arial">Arial</MenuItem>
          <MenuItem value="Courier New">Courier New</MenuItem>
          <MenuItem value="Georgia">Georgia</MenuItem>
        </TextField>
        <Button
          variant="contained"
          onClick={handleAddText}
          sx={{ height: '40px' }}
        >
          Add Text
        </Button>
      </Box>

      {/* Text Overlays Display */}
      <Box sx={{ position: 'relative', border: '1px solid #ddd', padding: '10px', minHeight: '300px' }}>
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
      </Box>

      {/* Footer Section */}
      <Box
        sx={{
          marginTop: '20px',
          borderTop: '1px solid #ccc',
          paddingTop: '10px',
          textAlign: 'center',
        }}
      >
        <Typography variant="body2" color="textSecondary">
          Drag and position text overlays in the editor.
        </Typography>
      </Box>
    </Box>
  );
};

export default TextOverlayEditor;
