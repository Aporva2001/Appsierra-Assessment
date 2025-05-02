import React, { useEffect } from 'react';
import Box from '@mui/material/Box';
import ReactDOM from 'react-dom';

const NewProject = ({ onClose, actionBar, children }) => {
  useEffect(() => {
    // Disable background scroll
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  return ReactDOM.createPortal(
    <Box
      onClick={onClose}
      sx={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1300,
      }}
    >
      <Box
        onClick={(e) => e.stopPropagation()} // Prevent modal close when clicking inside
        sx={{
          backgroundColor: 'white',
          borderRadius: 2,
          padding: 4,
          maxWidth: '90vw',
          width: 500,
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
      >
        {children}
        {actionBar}
      </Box>
    </Box>,
    document.querySelector('.modal-container')
  );
};

export default NewProject;
