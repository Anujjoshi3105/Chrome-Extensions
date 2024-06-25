import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import ColorPicker from './components/ColorPicker';

const App = () => {
  const [colorPickers, setColorPickers] = useState([]);

  // Load color pickers from local storage on component mount
  useEffect(() => {
    const storedPickers = JSON.parse(localStorage.getItem('colorPickers'));
    if (storedPickers) {
      setColorPickers(storedPickers);
    }
  }, []);

  // Save color pickers to local storage whenever they change
  useEffect(() => {
    localStorage.setItem('colorPickers', JSON.stringify(colorPickers));
  }, [colorPickers]);

  const addColorPicker = () => {
    setColorPickers([...colorPickers, { id: uuidv4() }]);
  };

  const removeColorPicker = (id) => {
    setColorPickers(colorPickers.filter(picker => picker.id !== id));
  };

  return (
    <>
      {colorPickers.map(picker => (
        <div key={picker.id} className="container">
          <ColorPicker />
          <div className="control">
            <svg onClick={() => removeColorPicker(picker.id)} xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-dash-circle-fill" viewBox="0 0 16 16">
              <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M4.5 7.5a.5.5 0 0 0 0 1h7a.5.5 0 0 0 0-1z"/>
            </svg>
            <svg onClick={addColorPicker} xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-plus-circle-fill" viewBox="0 0 16 16">
              <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3z"/>
            </svg>
          </div>
        </div>
      ))}
    </>
  );
};

export default App;
