"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllAssignmentsWithMembers = exports.deleteAssignment = exports.unassignMemberFromAssignment = exports.assignMemberToAssignment = exports.updateAssignmentStatus = exports.addMember = exports.addAssignment = exports.readAssignments = exports.readMembers = void 0;
const promises_1 = __importDefault(require("fs/promises"));
const MEMBERS_PATH = './public/members.json';
const ASSIGNMENTS_PATH = './public/assignments.json';
// READ OPERATIONS
const readMembers = async () => {
    try {
        const jsonMembers = await promises_1.default.readFile(MEMBERS_PATH, 'utf-8');
        return JSON.parse(jsonMembers);
    }
    catch (error) {
        throw error;
    }
};
exports.readMembers = readMembers;
const readAssignments = async () => {
    try {
        const jsonAssignments = await promises_1.default.readFile(ASSIGNMENTS_PATH, 'utf-8');
        return JSON.parse(jsonAssignments);
    }
    catch (error) {
        throw error;
    }
};
exports.readAssignments = readAssignments;
// WRITE OPERATIONS
const writeAssignments = async (assignments) => {
    try {
        await promises_1.default.writeFile(ASSIGNMENTS_PATH, JSON.stringify(assignments, null, 2));
    }
    catch (error) {
        throw error;
    }
};
const writeMembers = async (members) => {
    try {
        await promises_1.default.writeFile(MEMBERS_PATH, JSON.stringify(members, null, 2));
    }
    catch (error) {
        throw error;
    }
};
// CREATE OPERATIONS
const addAssignment = async (assignment) => {
    try {
        const assignments = await (0, exports.readAssignments)();
        const newAssignment = {
            ...assignment,
            id: crypto.randomUUID()
        };
        assignments.push(newAssignment);
        await writeAssignments(assignments);
        return newAssignment;
    }
    catch (error) {
        throw error;
    }
};
exports.addAssignment = addAssignment;
const addMember = async (member) => {
    try {
        const members = await (0, exports.readMembers)();
        const newMember = {
            ...member,
            id: crypto.randomUUID()
        };
        members.push(newMember);
        await writeMembers(members);
        return newMember;
    }
    catch (error) {
        throw error;
    }
};
exports.addMember = addMember;
// UPDATE OPERATIONS
const updateAssignmentStatus = async (id, status) => {
    try {
        const assignments = await (0, exports.readAssignments)();
        const index = assignments.findIndex(assignment => assignment.id === id);
        if (index === -1) {
            return null;
        }
        assignments[index] = { ...assignments[index], status };
        await writeAssignments(assignments);
        return assignments[index];
    }
    catch (error) {
        throw error;
    }
};
exports.updateAssignmentStatus = updateAssignmentStatus;
// Assign member to an assignment
const assignMemberToAssignment = async (assignmentId, memberId) => {
    try {
        const assignments = await (0, exports.readAssignments)();
        const index = assignments.findIndex(assignment => assignment.id === assignmentId);
        if (index === -1) {
            return null;
        }
        assignments[index] = { ...assignments[index], assigneeId: memberId };
        await writeAssignments(assignments);
        return assignments[index];
    }
    catch (error) {
        throw error;
    }
};
exports.assignMemberToAssignment = assignMemberToAssignment;
// Unassign member from an assignment
const unassignMemberFromAssignment = async (assignmentId) => {
    try {
        const assignments = await (0, exports.readAssignments)();
        const index = assignments.findIndex(assignment => assignment.id === assignmentId);
        if (index === -1) {
            return null;
        }
        assignments[index] = { ...assignments[index], assigneeId: undefined };
        await writeAssignments(assignments);
        return assignments[index];
    }
    catch (error) {
        throw error;
    }
};
exports.unassignMemberFromAssignment = unassignMemberFromAssignment;
// DELETE OPERATIONS
const deleteAssignment = async (id) => {
    try {
        const assignments = await (0, exports.readAssignments)();
        const index = assignments.findIndex(assignment => assignment.id === id);
        if (index === -1) {
            return false;
        }
        assignments.splice(index, 1);
        await writeAssignments(assignments);
        return true;
    }
    catch (error) {
        throw error;
    }
};
exports.deleteAssignment = deleteAssignment;
// Get assignments with member details
const getAllAssignmentsWithMembers = async () => {
    try {
        const assignments = await (0, exports.readAssignments)();
        const members = await (0, exports.readMembers)();
        return assignments.map(assignment => ({
            ...assignment,
            assignee: members.find(member => member.id === assignment.assigneeId) || null
        }));
    }
    catch (error) {
        throw error;
    }
};
exports.getAllAssignmentsWithMembers = getAllAssignmentsWithMembers;
