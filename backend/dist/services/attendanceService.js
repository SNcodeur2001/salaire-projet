import attendanceRepository from '../repositories/attendanceRepository.js';
export class AttendanceService {
    async clockIn(employeeId) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        let attendance = await attendanceRepository.findByEmployeeAndDate(employeeId, today);
        if (!attendance) {
            attendance = await attendanceRepository.create({
                employeeId,
                date: today,
                clockIn: new Date(),
                status: 'PRESENT',
            });
        }
        else if (!attendance.clockIn) {
            attendance = await attendanceRepository.updateClockIn(attendance.id, new Date());
        }
        else {
            throw new Error('Already clocked in today');
        }
        return attendance;
    }
    async clockOut(employeeId) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const attendance = await attendanceRepository.findByEmployeeAndDate(employeeId, today);
        if (!attendance || !attendance.clockIn) {
            throw new Error('Not clocked in today');
        }
        if (attendance.clockOut) {
            throw new Error('Already clocked out today');
        }
        return await attendanceRepository.updateClockOut(attendance.id, new Date());
    }
    async markClockIn(employeeId, date, markedById) {
        const attendanceDate = date || new Date();
        attendanceDate.setHours(0, 0, 0, 0);
        let attendance = await attendanceRepository.findByEmployeeAndDate(employeeId, attendanceDate);
        if (!attendance) {
            attendance = await attendanceRepository.create({
                employeeId,
                date: attendanceDate,
                clockIn: new Date(),
                status: 'PRESENT',
                markedById,
            });
        }
        else if (!attendance.clockIn) {
            const updatedAttendance = await attendanceRepository.updateClockIn(attendance.id, new Date());
            if (markedById) {
                attendance = await attendanceRepository.update(attendance.id, { markedById });
            }
            else {
                attendance = updatedAttendance;
            }
        }
        else {
            throw new Error('Already clocked in for this date');
        }
        return attendance;
    }
    async markClockOut(employeeId, date, markedById) {
        const attendanceDate = date || new Date();
        attendanceDate.setHours(0, 0, 0, 0);
        const attendance = await attendanceRepository.findByEmployeeAndDate(employeeId, attendanceDate);
        if (!attendance || !attendance.clockIn) {
            throw new Error('Not clocked in for this date');
        }
        if (attendance.clockOut) {
            throw new Error('Already clocked out for this date');
        }
        const updatedAttendance = await attendanceRepository.updateClockOut(attendance.id, new Date());
        if (markedById) {
            return await attendanceRepository.update(attendance.id, { markedById });
        }
        return updatedAttendance;
    }
    async getAttendanceByEmployee(employeeId) {
        return await attendanceRepository.listByEmployee(employeeId);
    }
    async getAttendanceByDate(date) {
        return await attendanceRepository.listByDate(date);
    }
}
export default new AttendanceService();
//# sourceMappingURL=attendanceService.js.map