const mongooses = require('../../database');

const TaskSchema = new mongooses.Schema({
    title: {
        type: String,
        required: true,
    },
    project: {
        type: mongooses.Schema.Types.ObjectId,
        ref: 'Project',
        required: true,
    },
    assignedTo: {
        type: mongooses.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    completed: {
        type: Boolean,
        required: true,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Task = mongooses.model('Task', TaskSchema);

module.exports = Task;