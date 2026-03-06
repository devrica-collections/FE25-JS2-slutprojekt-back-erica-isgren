import fs from 'fs/promises';
import type { Member, Assignment } from './types';

const MEMBERS_PATH = './public/members.json';
const ASSIGNMENTS_PATH = './public/assignments.json';

// READ OPERATIONS
export const readMembers = async (): Promise<Member[]> => {
    try {
        const jsonMembers = await fs.readFile(MEMBERS_PATH, 'utf-8');
        return JSON.parse(jsonMembers);
    } catch (error) {
        throw error;
    }
};

export const readAssignments = async (): Promise<Assignment[]> => {
    try {
        const jsonAssignments = await fs.readFile(ASSIGNMENTS_PATH, 'utf-8');
        return JSON.parse(jsonAssignments);
    } catch (error) {
        throw error;
    }
};

// WRITE OPERATIONS
const writeAssignments = async (assignments: Assignment[]) => {
    try {
        await fs.writeFile(ASSIGNMENTS_PATH, JSON.stringify(assignments, null, 2));
    } catch (error) {
        throw error;
    }
};

const writeMembers = async (members: Member[]) => {
    try {
        await fs.writeFile(MEMBERS_PATH, JSON.stringify(members, null, 2));
    } catch (error) {
        throw error;
    }
};

// CREATE OPERATIONS
export const addAssignment = async (assignment: Omit<Assignment, 'id'>) => {
    try {
        const assignments = await readAssignments();
        const newAssignment: Assignment = {
            ...assignment,
            id: crypto.randomUUID()
        };

        assignments.push(newAssignment);
        await writeAssignments(assignments);
        return newAssignment;
    } catch (error) {
        throw error;
    }
};

export const addMember = async (member: Omit<Member, 'id'>) => {
    try {
        const members = await readMembers();
        const newMember: Member = {
            ...member,
            id: crypto.randomUUID()
        };

        members.push(newMember);
        await writeMembers(members);
        return newMember;
    } catch (error) {
        throw error;
    }
};

// UPDATE OPERATIONS
export const updateAssignmentStatus = async (
    id: string,
    status: 'new' | 'doing' | 'done'
) => {
    try {
        const assignments = await readAssignments();
        const index = assignments.findIndex(assignment => assignment.id === id);

        if (index === -1) {
            return null;
        }

        assignments[index] = { ...assignments[index], status };
        await writeAssignments(assignments);
        return assignments[index];
    } catch (error) {
        throw error;
    }
};

// Assign member to an assignment
export const assignMemberToAssignment = async (
    assignmentId: string,
    memberId: string
) => {
    try {
        const assignments = await readAssignments();
        const index = assignments.findIndex(assignment => assignment.id === assignmentId);

        if (index === -1) {
            return null;
        }

        assignments[index] = { ...assignments[index], assigneeId: memberId };
        await writeAssignments(assignments);
        return assignments[index];
    } catch (error) {
        throw error;
    }
};

// Unassign member from an assignment
export const unassignMemberFromAssignment = async (assignmentId: string) => {
    try {
        const assignments = await readAssignments();
        const index = assignments.findIndex(assignment => assignment.id === assignmentId);

        if (index === -1) {
            return null;
        }

        assignments[index] = { ...assignments[index], assigneeId: undefined };
        await writeAssignments(assignments);
        return assignments[index];
    } catch (error) {
        throw error;
    }
};

// DELETE OPERATIONS
export const deleteAssignment = async (id: string) => {
    try {
        const assignments = await readAssignments();
        const index = assignments.findIndex(assignment => assignment.id === id);

        if (index === -1) {
            return false;
        }

        assignments.splice(index, 1);
        await writeAssignments(assignments);
        return true;
    } catch (error) {
        throw error;
    }
};

// Get assignments with member details
export const getAllAssignmentsWithMembers = async () => {
    try {
        const assignments = await readAssignments();
        const members = await readMembers();

        return assignments.map(assignment => ({
            ...assignment,
            assignee: members.find(member => member.id === assignment.assigneeId) || null
        }));
    } catch (error) {
        throw error;
    }
};