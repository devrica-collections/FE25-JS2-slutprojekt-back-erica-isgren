import { Router } from 'express';
import type { Request, Response } from 'express';
import { addMember, readMembers, addAssignment, updateAssignmentStatus, assignMemberToAssignment, unassignMemberFromAssignment, deleteAssignment, getAllAssignmentsWithMembers
} from './fileoperation';

export const publicRouter = Router();

function getParamId(param: string | string[]): string {
    return Array.isArray(param) ? param[0] : param;
}

// GET
publicRouter.get('/members', async (req: Request, res: Response) => {
    try {
        const members = await readMembers();
        res.json(members);
    } catch (error) {
        console.error('Error reading members:', error);
        res.status(500).json({ message: 'Error reading members' });
    }
});

publicRouter.get('/assignments/with-members', async (req: Request, res: Response) => {
    try {
        const assignmentsWithMembers = await getAllAssignmentsWithMembers();
        res.json(assignmentsWithMembers);
    } catch (error) {
        res.status(500).json({ message: 'Error reading assignments with members' });
    }
});

// POST
publicRouter.post('/assignments', async (req: Request, res: Response) => {
    try {
        const newAssignment = await addAssignment(req.body);
        res.status(201).json(newAssignment);
    } catch (error) {
        res.status(500).json({ message: 'Failed to add assignment' });
    }
});

publicRouter.post('/members', async (req: Request, res: Response) => {
    try {
        const newMember = await addMember(req.body);
        res.status(201).json(newMember);
    } catch (error) {
        res.status(500).json({ message: 'Failed to add member' });
    }
});


// PATCH
publicRouter.patch('/assignments/:id/status', async (req: Request, res: Response) => {
    try {
        const id = getParamId(req.params.id);
        const { status } = req.body;
        const updated = await updateAssignmentStatus(id, status);
        if (updated) {
            res.json(updated);
        } else {
            res.status(404).json({ message: 'Assignment not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Failed to update assignment status' });
    }
});

publicRouter.patch('/assignments/:id/assign', async (req: Request, res: Response) => {
    try {
        const id = getParamId(req.params.id);
        const { memberId } = req.body;
        const updated = await assignMemberToAssignment(id, memberId);
        
        if (updated) {
            const finalUpdated = await updateAssignmentStatus(id, 'doing');
            res.json(finalUpdated);
        } else {
            res.status(404).json({ message: 'Assignment not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Failed to assign member' });
    }
});

publicRouter.patch('/assignments/:id/unassign', async (req: Request, res: Response) => {
    try {
        const id = getParamId(req.params.id);
        const updated = await unassignMemberFromAssignment(id);
        if (updated) {
            res.json(updated);
        } else {
            res.status(404).json({ message: 'Assignment not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Failed to unassign member' });
    }
});

// DELETE
publicRouter.delete('/assignments/:id', async (req: Request, res: Response) => {
    try {
        const id = getParamId(req.params.id);
        const success = await deleteAssignment(id);
        if (success) {
            res.status(204).end();
        } else {
            res.status(404).json({ message: 'Assignment not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete assignment' });
    }
});