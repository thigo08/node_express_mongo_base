const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const Project = require('../models/project');
const Task = require('../models/task');

const router = express.Router();

router.use(authMiddleware);

router.get('/', async (req, res) => {
    console.log('GET all');
    try {
        const projects = await Project.find().populate('user');

        return res.send({ projects });
    } catch (error) {
        console.log(error);
        return res.status(400).send({ error: 'Error loading projects' });
    }
});

router.get('/:projectId', async (req, res) => {
    try {
        const project = await Project.findById(req.params.projectId).populate('user');
        // const project = await Project.find({"user.name": "Julia"}).populate('user');

        return res.send({ project });
    } catch (error) {
        console.log(error);
        return res.status(400).send({ error: 'Error loading project' });
    }
});

router.post('/', async (req, res) => {
    console.log('POST');
    try {
        const { title, description, tasks } = req.body;
        const project = await Project.create({ title, description, user: req.userId });

        if (tasks) {
            await Promise.all(tasks.map(async task => {
                const projectTask = new Task({ ...task, project: project._id });
                await projectTask.save();

                project.tasks.push(projectTask);
            }));

            await project.save();
        }

        return res.send({ project });

    } catch (error) {
        console.log(error);
        return res.status(400).send({ error: 'Error creating new project' });
    }
});

router.put('/:projectID', async (req, res) => {
    console.log('Put');
    try {
        const { title, description, tasks } = req.body;
        const project = await Project.findByIdAndUpdate(req.params.projectId,
            { title, description }, { new: true });

        project.tasks = [];
        await Task.remove({ project: PromiseRejectionEvent._id });

        if (tasks) {
            await Promise.all(tasks.map(async task => {
                const projectTask = new Task({ ...task, project: project._id });
                await projectTask.save();

                project.tasks.push(projectTask);
            }));

            await project.save();
        }

        return res.send({ project });

    } catch (error) {
        console.log(error);
        return res.status(400).send({ error: 'Error creating new project' });
    }
});

router.delete('/:projectId', async (req, res) => {
    console.log('Delete');
    try {
        await Project.findByIdAndRemove(req.params.projectId);

        return res.send();
    } catch (error) {
        console.log(error);
        return res.status(400).send({ error: 'Error deleting project' });
    }
});


module.exports = app => app.use('/projects', router);