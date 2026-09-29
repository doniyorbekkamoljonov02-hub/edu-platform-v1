import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Grade } from './entities/grade.entity';
import { CreateGradeDto } from './dto/create-grade.dto';
import { UpdateGradeDto } from './dto/update-grade.dto';
import { TeachersService } from '../teachers/teachers.service';
import { Role } from '../common/enums/role.enum';
import { AuthenticatedUser } from '../common/types/authenticated-user.type';

@Injectable()
export class GradesService {
  constructor(
    @InjectRepository(Grade)
    private readonly gradeRepository: Repository<Grade>,
    private readonly teachersService: TeachersService,
  ) {}

  async create(
    dto: CreateGradeDto,
    currentUser: AuthenticatedUser,
  ): Promise<Grade> {
    const payload: CreateGradeDto = { ...dto };

    if (currentUser.role === Role.TEACHER) {
      const teacher = await this.teachersService.findMe(
        currentUser.userId,
      );

      // teacherId is never trusted from the client — always derived
      // from the authenticated teacher's own profile.
      payload.teacherId = teacher.id;

      const [studentInScope, subjectInScope] = await Promise.all([
        this.teachersService.isStudentInTeacherScope(
          teacher.id,
          payload.studentId,
        ),
        this.teachersService.isSubjectInTeacherScope(
          teacher.id,
          payload.subjectId,
        ),
      ]);

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

    const grade = this.gradeRepository.create(payload);
    return this.gradeRepository.save(grade);
  }

  async findAll(currentUser: AuthenticatedUser): Promise<Grade[]> {
    if (currentUser.role === Role.TEACHER) {
      const teacher = await this.teachersService.findMe(
        currentUser.userId,
      );
      return this.gradeRepository.find({
        where: { teacherId: teacher.id },
      });
    }

    // Unchanged for STUDENT/PARENT/ADMIN/DIRECTOR (out of scope for this fix).
    return this.gradeRepository.find();
  }

  async findOne(
    id: string,
    currentUser: AuthenticatedUser,
  ): Promise<Grade> {
    const grade = await this.getByIdOrFail(id);
    await this.assertTeacherOwnership(grade, currentUser);
    return grade;
  }

  async update(
    id: string,
    dto: UpdateGradeDto,
    currentUser: AuthenticatedUser,
  ): Promise<Grade> {
    const grade = await this.getByIdOrFail(id);
    await this.assertTeacherOwnership(grade, currentUser);

    const payload: UpdateGradeDto = { ...dto };

    if (currentUser.role === Role.TEACHER) {
      const teacher = await this.teachersService.findMe(
        currentUser.userId,
      );

      // A teacher can never reassign a grade to another teacher.
      payload.teacherId = teacher.id;

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

    Object.assign(grade, payload);
    return this.gradeRepository.save(grade);
  }

  async remove(id: string, currentUser: AuthenticatedUser): Promise<void> {
    const grade = await this.getByIdOrFail(id);
    await this.assertTeacherOwnership(grade, currentUser);
    await this.gradeRepository.remove(grade);
  }

  private async getByIdOrFail(id: string): Promise<Grade> {
    const grade = await this.gradeRepository.findOneBy({ id });
    if (!grade) {
      throw new NotFoundException(`Grade with id ${id} not found`);
    }
    return grade;
  }

  /**
   * A TEACHER may only read/modify grades they themselves recorded.
   * No-op for STUDENT/PARENT/ADMIN/DIRECTOR (unchanged behavior).
   */
  private async assertTeacherOwnership(
    grade: Grade,
    currentUser: AuthenticatedUser,
  ): Promise<void> {
    if (currentUser.role !== Role.TEACHER) {
      return;
    }

    const teacher = await this.teachersService.findMe(
      currentUser.userId,
    );

    if (grade.teacherId !== teacher.id) {
      throw new ForbiddenException('Bu baho sizga tegishli emas.');
    }
  }
}
