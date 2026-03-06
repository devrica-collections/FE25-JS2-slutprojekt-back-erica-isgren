"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.publicRouter = void 0;
const express_1 = require("express");
const fileoperation_1 = require("./fileoperation");
exports.publicRouter = (0, express_1.Router)();
function getParamId(param) {
    return Array.isArray(param) ? param[0] : param;
}
// GET
exports.publicRouter.get('/members', async (req, res) => {
    try {
        const members = await (0, fileoperation_1.readMembers)();
        res.json(members);
    }
    catch (error) {
        console.error('Error reading members:', error);
        res.status(500).json({ message: 'Error reading members' });
    }
});
exports.publicRouter.get('/assignments/with-members', async (req, res) => {
    try {
        const assignmentsWithMembers = await (0, fileoperation_1.getAllAssignmentsWithMembers)();
        res.json(assignmentsWithMembers);
    }
    catch (error) {
        res.status(500).json({ message: 'Error reading assignments with members' });
    }
});
// POST
exports.publicRouter.post('/assignments', async (req, res) => {
    try {
        const newAssignment = await (0, fileoperation_1.addAssignment)(req.body);
        res.status(201).json(newAssignment);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to add assignment' });
    }
});
exports.publicRouter.post('/members', async (req, res) => {
    try {
        const newMember = await (0, fileoperation_1.addMember)(req.body);
        res.status(201).json(newMember);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to add member' });
    }
});
// PATCH
exports.publicRouter.patch('/assignments/:id/status', async (req, res) => {
    try {
        const id = getParamId(req.params.id);
        const { status } = req.body;
        const updated = await (0, fileoperation_1.updateAssignmentStatus)(id, status);
        if (updated) {
            res.json(updated);
        }
        else {
            res.status(404).json({ message: 'Assignment not found' });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to update assignment status' });
    }
});
exports.publicRouter.patch('/assignments/:id/assign', async (req, res) => {
    try {
        const id = getParamId(req.params.id);
        const { memberId } = req.body;
        const updated = await (0, fileoperation_1.assignMemberToAssignment)(id, memberId);
        if (updated) {
            const finalUpdated = await (0, fileoperation_1.updateAssignmentStatus)(id, 'doing');
            res.json(finalUpdated);
        }
        else {
            res.status(404).json({ message: 'Assignment not found' });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to assign member' });
    }
});
exports.publicRouter.patch('/assignments/:id/unassign', async (req, res) => {
    try {
        const id = getParamId(req.params.id);
        const updated = await (0, fileoperation_1.unassignMemberFromAssignment)(id);
        if (updated) {
            res.json(updated);
        }
        else {
            res.status(404).json({ message: 'Assignment not found' });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to unassign member' });
    }
});
// DELETE
exports.publicRouter.delete('/assignments/:id', async (req, res) => {
    try {
        const id = getParamId(req.params.id);
        const success = await (0, fileoperation_1.deleteAssignment)(id);
        if (success) {
            res.status(204).end();
        }
        else {
            res.status(404).json({ message: 'Assignment not found' });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to delete assignment' });
    }
});
