import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attendance } from './entities/attendance.entity';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import { TeachersService } from '../teachers/teachers.service';
import { Role } from '../common/enums/role.enum';
import { AuthenticatedUser } from '../common/types/authenticated-user.type';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(Attendance)
    private readonly attendanceRepository: Repository<Attendance>,
    private readonly teachersService: TeachersService,
  ) {}

  async create(
    dto: CreateAttendanceDto,
    currentUser: AuthenticatedUser,
  ): Promise<Attendance> {
    const payload: CreateAttendanceDto = { ...dto };

    if (currentUser.role === Role.TEACHER) {
      const teacher = await this.teachersService.findMe(
        currentUser.userId,
      );

      // teacherId is never trusted from the client — always derived
      // from the authenticated teacher's own profile.
      payload.teacherId = teacher.id;

      const [groupInScope, studentInScope, subjectInScope] =
        await Promise.all([
          this.teachersService.isGroupInTeacherScope(
            teacher.id,
            payload.groupId,
          ),
          this.teachersService.isStudentInTeacherScope(
            teacher.id,
            payload.studentId,
          ),
          this.teachersService.isSubjectInTeacherScope(
            teacher.id,
            payload.subjectId,
          ),
        ]);

      if (!groupInScope) {
        throw new ForbiddenException(
          'Bu guruh sizga biriktirilmagan.',
        );
      }

      if (!studentInScope) {
        throw new ForbiddenException(
          'Bu o‘quvchi sizga tegishli guruhda emas.',
        );
      }

      if (!subjectInScope) {
        throw new ForbiddenException(
          'Bu fan sizga biriktirilgan fan emas.',
        );
      }
    } else if (!payload.teacherId) {
      throw new ForbiddenException('teacherId ko‘rsatilishi shart.');
    }

    const attendance = this.attendanceRepository.create(payload);
    return this.attendanceRepository.save(attendance);
  }

  async findAll(currentUser: AuthenticatedUser): Promise<Attendance[]> {
    if (currentUser.role === Role.TEACHER) {
      const teacher = await this.teachersService.findMe(
        currentUser.userId,
      );
      return this.attendanceRepository.find({
        where: { teacherId: teacher.id },
      });
    }

    // Unchanged for STUDENT/PARENT/ADMIN/DIRECTOR (out of scope for this fix).
    return this.attendanceRepository.find();
  }

  async findOne(
    id: string,
    currentUser: AuthenticatedUser,
  ): Promise<Attendance> {
    const attendance = await this.getByIdOrFail(id);
    await this.assertTeacherOwnership(attendance, currentUser);
    return attendance;
  }

  async update(
    id: string,
    dto: UpdateAttendanceDto,
    currentUser: AuthenticatedUser,
  ): Promise<Attendance> {
    const attendance = await this.getByIdOrFail(id);
    await this.assertTeacherOwnership(attendance, currentUser);

    const payload: UpdateAttendanceDto = { ...dto };

    if (currentUser.role === Role.TEACHER) {
      const teacher = await this.teachersService.findMe(
        currentUser.userId,
      );

      // A teacher can never reassign an attendance record to another teacher.
      payload.teacherId = teacher.id;

      if (payload.groupId) {
        const groupInScope =
          await this.teachersService.isGroupInTeacherScope(
            teacher.id,
            payload.groupId,
          );
        if (!groupInScope) {
          throw new ForbiddenException(
            'Bu guruh sizga biriktirilmagan.',
          );
        }
      }

      if (payload.studentId) {
        const studentInScope =
          await this.teachersService.isStudentInTeacherScope(
            teacher.id,
            payload.studentId,
          );
        if (!studentInScope) {
          throw new ForbiddenException(
            'Bu o‘quvchi sizga tegishli guruhda emas.',
          );
        }
      }

      if (payload.subjectId) {
        const subjectInScope =
          await this.teachersService.isSubjectInTeacherScope(
            teacher.id,
            payload.subjectId,
          );
        if (!subjectInScope) {
          throw new ForbiddenException(
            'Bu fan sizga biriktirilgan fan emas.',
          );
        }
      }
    }

    Object.assign(attendance, payload);
    return this.attendanceRepository.save(attendance);
  }

  async remove(id: string, currentUser: AuthenticatedUser): Promise<void> {
    const attendance = await this.getByIdOrFail(id);
    await this.assertTeacherOwnership(attendance, currentUser);
    await this.attendanceRepository.remove(attendance);
  }

  private async getByIdOrFail(id: string): Promise<Attendance> {
    const attendance = await this.attendanceRepository.findOneBy({ id });
    if (!attendance) {
      throw new NotFoundException(`Attendance with id ${id} not found`);
    }
    return attendance;
  }

  /**
   * A TEACHER may only read/modify attendance records they themselves took.
   * No-op for STUDENT/PARENT/ADMIN/DIRECTOR (unchanged behavior).
   */
  private async assertTeacherOwnership(
    attendance: Attendance,
    currentUser: AuthenticatedUser,
  ): Promise<void> {
    if (currentUser.role !== Role.TEACHER) {
      return;
    }

    const teacher = await this.teachersService.findMe(
      currentUser.userId,
    );

    if (attendance.teacherId !== teacher.id) {
      throw new ForbiddenException('Bu davomat yozuvi sizga tegishli emas.');
    }
  }
}
