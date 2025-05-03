import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import NewProject from '../components/NewProject';
import { Box, Stack, TextField } from '@mui/material';
import ProjectItem from '../components/ProjectItem';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Projects = () => {
  const token= localStorage.getItem('token')

  const [projects, setProjects] = useState(() => {
    const saved = localStorage.getItem('projects');
    return saved ? JSON.parse(saved) : [];
  });

  const [showModal, setShowModal] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const navigate = useNavigate();

 useEffect(()=>{
    if(!token){
      navigate("/login");
    return;
    }

    axios.get('http://localhost:8080/view-projects',{
      headers: {
        "Authorization": "Bearer "+token,
        "Content-Type": 'application/json'
      }
    })
  },[token,navigate])

  useEffect(() => {
    localStorage.setItem('projects', JSON.stringify(projects));
  }, [projects]);

  if(!token)
    return null;

  function handleClick() {
    setFormData({ name: '', description: '' });
    setEditingIndex(null);
    setShowModal(true);
  }

  const handleClose = () => {
    setShowModal(false);
    setEditingIndex(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingIndex !== null) {
      const updated = [...projects];
      updated[editingIndex] = { ...formData, tasks: updated[editingIndex].tasks || [] };
      setProjects(updated);
    } else if (projects.length < 4) {
      setProjects([...projects, { ...formData, tasks: [] }]);
    }
    axios.post('http://localhost:8080/add-project',formData,{
      headers: {
       "Authorization": "Bearer "+token,
        "Content-Type": 'application/json'
      }
    }).then(response =>{
      setFormData({ name: '', description: '' });
      handleClose();
    })
    .catch(err =>{
      console.log(err)
    })
  };

  const handleDelete = (index) => {
    const updated = projects.filter((_, i) => i !== index);
    setProjects(updated);
  };

  const handleModify = (index) => {
    setFormData(projects[index]);
    setEditingIndex(index);
    setShowModal(true);
  };

  const handleAddTask = (index) => {
    navigate(`/add-task/${index}`);
  };

  const handleViewTasks = (index) => {
    navigate(`/view-tasks/${index}`);
  };

  const actionBar = (
    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
      <Button variant="contained" color="success" type="submit">
        {editingIndex !== null ? 'Update' : 'Add'}
      </Button>
    </Box>
  );

  const modal = (
    <NewProject onClose={handleClose}>
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
  );

  return (
    <div>
      <h1>Projects</h1>
      <Button
        variant="contained"
        onClick={handleClick}
        disabled={projects.length >= 4 && editingIndex === null}
      >
        Add a Project
      </Button>
      {projects.map((project, index) => (
        <ProjectItem
          key={index}
          name={project.name}
          description={project.description}
          onDelete={() => handleDelete(index)}
          onModify={() => handleModify(index)}
          onAddTask={() => handleAddTask(index)}
          onView={() => handleViewTasks(index)}
        />
      ))}
      {showModal && modal}
    </div>
  );
};

export default Projects;

