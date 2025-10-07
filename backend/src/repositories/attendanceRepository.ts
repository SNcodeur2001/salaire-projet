import { PrismaClient, Attendance } from '@prisma/client';

const prisma = new PrismaClient();

export class AttendanceRepository {
  async create(data: {
    employeeId: string;
    date: Date;
    clockIn?: Date;
    clockOut?: Date;
    status?: string;
    markedById?: string;
  }): Promise<Attendance> {
    return await prisma.attendance.create({ data });
  }

  async findByEmployeeAndDate(employeeId: string, date: Date): Promise<Attendance | null> {
    return await prisma.attendance.findFirst({
      where: {
        employeeId,
        date,
      },
    });
  }

  async updateClockIn(id: string, clockIn: Date): Promise<Attendance | null> {
    return await prisma.attendance.update({
      where: { id },
      data: { clockIn },
    });
  }

  async updateClockOut(id: string, clockOut: Date): Promise<Attendance | null> {
    return await prisma.attendance.update({
      where: { id },
      data: { clockOut },
    });
  }

  async update(id: string, data: Partial<Attendance>): Promise<Attendance | null> {
    return await prisma.attendance.update({
      where: { id },
      data,
    });
  }

  async listByEmployee(employeeId: string): Promise<Attendance[]> {
    return await prisma.attendance.findMany({
      where: { employeeId },
      orderBy: { date: 'desc' },
    });
  }

  async listByDate(date: Date): Promise<Attendance[]> {
    return await prisma.attendance.findMany({
      where: { date },
      include: { employee: true },
      orderBy: { employeeId: 'asc' },
    });
  }
}

export default new AttendanceRepository();
