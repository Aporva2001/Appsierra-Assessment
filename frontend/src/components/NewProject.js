import React, { useEffect } from 'react'
import Box from '@mui/material/Box';
import ReactDOM from 'react-dom'


const NewProject = ({onClose,actionBar,children}) => {
    useEffect(() => {
        // Disable background scroll
        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
    
        // Re-enable on unmount
        return () => {
          document.body.style.overflow = originalOverflow;
        };
      }, []);
return ReactDOM.createPortal(
<div>
        <Box
        onClick= {onClose}
      sx={{
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        backgroundColor: 'grey.300', 
        opacity: 0.8,
      }}
    />
        <Box
      sx={{
        position: 'absolute',
        top: 100,    
        right: 400,
        bottom: 160,
        left: 400,
        padding: 10, 
        backgroundColor: 'white',
      }}
    >
       {children}
       {actionBar}
        </Box>
    </div>,
    document.querySelector('.modal-container')
);
}

export default NewProject