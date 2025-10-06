import attendanceService from '../services/attendanceService.js';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
export class AttendanceController {
    async clockIn(req, res) {
        try {
            // For testing: accept employeeId in body if not authenticated
            let employeeId = req.user?.userId || req.body.employeeId;
            if (!employeeId) {
                return res.status(400).json({ error: 'Utilisateur non trouvé ou employeeId requis' });
            }
            // Fetch employee from userId
            const employee = await prisma.employee.findFirst({
                where: { userId: employeeId },
            });
            if (!employee) {
                return res.status(400).json({ error: 'Employé non trouvé pour cet utilisateur' });
            }
            const attendance = await attendanceService.clockIn(employee.id);
            res.json(attendance);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    async markClockIn(req, res) {
        try {
            const { employeeId, date } = req.body;
            if (!employeeId) {
                return res.status(400).json({ error: 'employeeId requis' });
            }
            const employee = await prisma.employee.findUnique({
                where: { id: employeeId },
            });
            if (!employee) {
                return res.status(400).json({ error: 'Employé non trouvé' });
            }
            const attendanceDate = date ? new Date(date) : new Date();
            const markedById = req.user?.userId;
            const attendance = await attendanceService.markClockIn(employee.id, attendanceDate, markedById);
            res.json(attendance);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    async markClockOut(req, res) {
        try {
            const { employeeId, date } = req.body;
            if (!employeeId) {
                return res.status(400).json({ error: 'employeeId requis' });
            }
            const employee = await prisma.employee.findUnique({
                where: { id: employeeId },
            });
            if (!employee) {
                return res.status(400).json({ error: 'Employé non trouvé' });
            }
            const attendanceDate = date ? new Date(date) : new Date();
            const markedById = req.user?.userId;
            const attendance = await attendanceService.markClockOut(employee.id, attendanceDate, markedById);
            res.json(attendance);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    async clockOut(req, res) {
        try {
            // For testing: accept employeeId in body if not authenticated
            let employeeId = req.user?.userId || req.body.employeeId;
            if (!employeeId) {
                return res.status(400).json({ error: 'Utilisateur non trouvé ou employeeId requis' });
            }
            // Fetch employee from userId
            const employee = await prisma.employee.findFirst({
                where: { userId: employeeId },
            });
            if (!employee) {
                return res.status(400).json({ error: 'Employé non trouvé pour cet utilisateur' });
            }
            const attendance = await attendanceService.clockOut(employee.id);
            res.json(attendance);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    async getMyAttendance(req, res) {
        try {
            // For testing: accept employeeId in body if not authenticated
            let employeeId = req.user?.userId || req.body.employeeId;
            if (!employeeId) {
                return res.status(400).json({ error: 'Utilisateur non trouvé ou employeeId requis' });
            }
            // Fetch employee from userId
            const employee = await prisma.employee.findFirst({
                where: { userId: employeeId },
            });
            if (!employee) {
                return res.status(400).json({ error: 'Employé non trouvé pour cet utilisateur' });
            }
            const attendances = await attendanceService.getAttendanceByEmployee(employee.id);
            res.json(attendances);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    async getAttendanceByDate(req, res) {
        try {
            const { date } = req.query;
            if (!date) {
                return res.status(400).json({ error: 'Date requise' });
            }
            const attendances = await attendanceService.getAttendanceByDate(new Date(date));
            res.json(attendances);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}
export default new AttendanceController();
//# sourceMappingURL=attendanceController.js.map