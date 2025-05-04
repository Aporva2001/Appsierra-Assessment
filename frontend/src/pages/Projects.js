import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import NewProject from '../components/NewProject';
import { Box, Grid, Stack, TextField, Typography } from '@mui/material';
import ProjectItem from '../components/ProjectItem';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Projects = () => {
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '' });

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    // Fetch projects
    axios.get('http://localhost:8080/projects', {
      headers: {
        "Authorization": "Bearer " + token,
        "Content-Type": 'application/json'
      }
    })
    .then(res => {
      setProjects(res.data.projects || []);
    })
    .catch(err => console.error("Error fetching projects:", err));
  }, [token, navigate]);

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
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingIndex !== null) {
        const updatedProject = { ...formData, tasks: projects[editingIndex]?.tasks || [] };

        const res = await axios.get(`http://localhost:8080/get-project/${formData.name}`, {
          headers: {
            "Authorization": "Bearer " + token,
            "Content-Type": 'application/json'
          }
        });

        const projectId = res.data.p_id;

        await axios.put('http://localhost:8080/update-project', {
          ...updatedProject,
          p_id: projectId
        }, {
          headers: {
            "Authorization": "Bearer " + token,
            "Content-Type": 'application/json'
          }
        });

        const updatedProjects = [...projects];
        updatedProjects[editingIndex] = { ...updatedProject, _id: projectId };
        setProjects(updatedProjects);

      } else if (projects.length < 4) {
        const res = await axios.post('http://localhost:8080/add-project', formData, {
          headers: {
            "Authorization": "Bearer " + token,
            "Content-Type": 'application/json'
          }
        });

        const newProject = res.data.project;
        setProjects(prev => [...prev, newProject]);
      }

      setFormData({ name: '', description: '' });
      handleClose();
    } catch (err) {
      console.error("Error during project submit:", err);
    }
  };

  const handleDelete = async (index) => {
    const projectId = projects[index]?._id;

    if (!projectId) {
      console.error("Cannot delete: project ID is undefined");
      return;
    }

    try {
      console.log("Deleting project with ID:", projectId);

      await axios.delete(`http://localhost:8080/delete-project/${projectId}`, {
        headers: {
          "Authorization": "Bearer " + token,
          "Content-Type": "application/json"
        }
      });

      const updated = projects.filter((_, i) => i !== index);
      setProjects(updated);
    } catch (err) {
      console.error("Error deleting project:", err);
    }
  };

  const handleModify = (index) => {
    setFormData(projects[index]);
    setEditingIndex(index);
    setShowModal(true);
  };

  const handleAddTask = (index) => {
    navigate(`/add-task/${projects[index]._id}`);
  };

  const handleViewTasks = (index) => {
    navigate(`/view-tasks/${projects[index]._id}`,{
      state: projects[index]
    });
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
    <Box sx={{ p: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <h1>Projects</h1>
        <Button
          variant="contained"
          onClick={handleClick}
          disabled={projects.length >= 4 && editingIndex === null}
        >
          Add a Project
        </Button>
      </Box>

      {projects.length === 0 ? (
        <Typography variant="h6" align="center" sx={{ mt: 5 }}>
          No Projects Added
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {projects.map((project, index) => (
            <Grid item xs={12} sm={6} md={2} key={index}>
              <ProjectItem
                name={project.name}
                description={project.description}
                onDelete={() => handleDelete(index)}
                onModify={() => handleModify(index)}
                onAddTask={() => handleAddTask(index)}
                onView={() => handleViewTasks(index)}
              />
            </Grid>
          ))}
        </Grid>
      )}

      {showModal && modal}
    </Box>
  );
};

export default Projects;
