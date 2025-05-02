import React, { useState } from 'react'
import Button from '@mui/material/Button';
import NewProject from '../components/NewProject';
import ProjectForm from '../components/ProjectForm';
import { Box, Stack, TextField } from '@mui/material';

const Projects = () => {
    const [showModal, setShowModal] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        description: ""
    })
        const handleClick = ()=>{
            setShowModal(true);
        }
    
        const handleClose =()=>{
            console.log("hello")
            setShowModal(false);
        }

        const handleChange = (e)=>{
            const {name, value} = e.target;
            setFormData((prevData)=>({
                ...prevData,
                [name]: value 
            }))
        }
        const handleSubmit = (e) =>{
            e.preventDefault();
            console.log(formData)
            handleClose();

        }
        const actionBar= <div>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
  <Button
    variant="contained"
    color="success"
    type="submit"
    onSubmit={handleSubmit}
  >
    Add
  </Button>
</Box>
    </div>
    const modal= <NewProject onClose= {handleClose} >
       <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <TextField
                label="Project Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                fullWidth
                required
              />
              <TextField
                label="Project Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                multiline
                rows={4}
                fullWidth
                required
              />
              {actionBar}
            </Stack>
          </form>
        </NewProject>

  return (
    <div>
        <h1>Projects</h1>
        <Button variant="contained" onClick={handleClick}>Add a Project</Button>
        {showModal && modal}
    </div>
  )
}

export default Projects