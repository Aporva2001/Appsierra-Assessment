const express= require('express');
const { getViewProjects, postAddProjects } = require('../controllers/projects');
const { isAuth } = require('../middlewares/is-auth');

const router= express.Router()

router.post('/add-project',isAuth,postAddProjects)
router.get('/view-projects',isAuth, getViewProjects)

module.exports= router;