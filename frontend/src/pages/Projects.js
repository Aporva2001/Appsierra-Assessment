import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import NewProject from '../components/NewProject';
import { Box, Stack, TextField } from '@mui/material';
import ProjectItem from '../components/ProjectItem';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  useEffect(() => {
    console.log('Projects updated:', projects);
  }, [projects]);

  const handleClick = () => {
    setFormData({ name: '', description: '' });
    setEditingIndex(null); 
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setEditingIndex(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingIndex !== null) {
      const updated = [...projects];
      updated[editingIndex] = formData;
      setProjects(updated);
    } else {
      if (projects.length < 4) {
        setProjects((prev) => [...prev, formData]);
      }
    }

    setFormData({ name: '', description: '' });
    setEditingIndex(null);
    handleClose();
  };

  const handleDelete = (project) => {
    const filtered = projects.filter((p) => p.name !== project.name);
    setProjects(filtered);
  };

  const handleModify = (project, index) => {
    setFormData(project);
    setEditingIndex(index);
    setShowModal(true);
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
          onDelete={() => handleDelete(project)}
          onModify={() => handleModify(project, index)}
        />
      ))}

      {showModal && modal}
    </div>
  );
};

export default Projects;
