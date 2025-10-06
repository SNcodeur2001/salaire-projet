import express from 'express';
import attendanceController from '../controllers/attendanceController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
const router = express.Router();
router.use(requireAuth);
// Employee routes
router.post('/clock-in', attendanceController.clockIn.bind(attendanceController));
router.post('/clock-out', attendanceController.clockOut.bind(attendanceController));
router.get('/my-attendance', attendanceController.getMyAttendance.bind(attendanceController));
// Admin and Vigile routes
router.get('/by-date', requireRole('ADMIN', 'SUPER_ADMIN', 'VIGILE'), attendanceController.getAttendanceByDate.bind(attendanceController));
router.post('/mark-clock-in', requireRole('ADMIN', 'SUPER_ADMIN', 'VIGILE'), attendanceController.markClockIn.bind(attendanceController));
router.post('/mark-clock-out', requireRole('ADMIN', 'SUPER_ADMIN', 'VIGILE'), attendanceController.markClockOut.bind(attendanceController));
export default router;
//# sourceMappingURL=attendances.js.map