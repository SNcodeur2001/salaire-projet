import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
export class AttendanceRepository {
    async create(data) {
        return await prisma.attendance.create({ data });
    }
    async findByEmployeeAndDate(employeeId, date) {
        return await prisma.attendance.findFirst({
            where: {
                employeeId,
                date,
            },
        });
    }
    async updateClockIn(id, clockIn) {
        return await prisma.attendance.update({
            where: { id },
            data: { clockIn },
        });
    }
    async updateClockOut(id, clockOut) {
        return await prisma.attendance.update({
            where: { id },
            data: { clockOut },
        });
    }
    async update(id, data) {
        return await prisma.attendance.update({
            where: { id },
            data,
        });
    }
    async listByEmployee(employeeId) {
        return await prisma.attendance.findMany({
            where: { employeeId },
            orderBy: { date: 'desc' },
        });
    }
    async listByDate(date) {
        return await prisma.attendance.findMany({
            where: { date },
            orderBy: { employeeId: 'asc' },
        });
    }
}
export default new AttendanceRepository();
//# sourceMappingURL=attendanceRepository.js.map