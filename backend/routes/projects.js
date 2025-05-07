const express= require('express');
const { getViewProjects, postAddProjects, putUpdateProjects, getProjectDetails, deleteProject } = require('../controllers/projects');
const { isAuth } = require('../middlewares/is-auth');

const router= express.Router()

router.post('/add-project',isAuth,postAddProjects)

router.get('/get-project/:name',isAuth, getProjectDetails)

router.get('/projects',isAuth, getViewProjects)
router.put('/update-project',isAuth, putUpdateProjects)

router.delete('/delete-project/:id',isAuth, deleteProject)


module.exports= router;