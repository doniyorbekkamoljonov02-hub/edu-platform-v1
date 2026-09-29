import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Teacher } from './entities/teacher.entity';
import { Student } from '../students/entities/student.entity';
import { Schedule } from '../schedule/entities/schedule.entity';

import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';

@Injectable()
export class TeachersService {
  constructor(
    @InjectRepository(Teacher)
    private readonly teacherRepository: Repository<Teacher>,

    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,

    @InjectRepository(Schedule)
    private readonly scheduleRepository: Repository<Schedule>,
  ) {}

  create(dto: CreateTeacherDto): Promise<Teacher> {
    const teacher = this.teacherRepository.create(dto);

    return this.teacherRepository.save(teacher);
  }

  findAll(): Promise<Teacher[]> {
    return this.teacherRepository.find({
      relations: {
        user: true,
        subject: true,
      },
    });
  }

  async findMe(userId: string): Promise<Teacher> {
    const teacher = await this.teacherRepository.findOne({
      where: {
        userId,
      },
      relations: {
        user: true,
        subject: true,
      },
    });

    if (!teacher) {
      throw new NotFoundException(
        'Bu foydalanuvchiga tegishli o‘qituvchi topilmadi.',
      );
    }

    return teacher;
  }

  async findOne(id: string): Promise<Teacher> {
    const teacher = await this.teacherRepository.findOne({
      where: { id },
      relations: {
        user: true,
        subject: true,
      },
    });

    if (!teacher) {
      throw new NotFoundException(
        `Teacher with id ${id} not found`,
      );
    }

    return teacher;
  }

  async update(
    id: string,
    dto: UpdateTeacherDto,
  ): Promise<Teacher> {
    const teacher = await this.findOne(id);

    Object.assign(teacher, dto);

    return this.teacherRepository.save(teacher);
  }

  async remove(id: string): Promise<void> {
    const teacher = await this.findOne(id);

    await this.teacherRepository.remove(teacher);
  }

  /**
   * Group IDs a teacher actually teaches, derived from the schedule —
   * the single source of truth for "does this teacher own this group /
   * these students" checks used across grades, attendance and bonuses.
   */
  async getTaughtGroupIds(teacherId: string): Promise<string[]> {
    const schedules = await this.scheduleRepository.find({
      where: {
        teacherId,
        isActive: true,
      },
    });

    return [
      ...new Set(
        schedules.map((schedule) => schedule.groupId),
      ),
    ];
  }

  /**
   * True if `groupId` is one of the groups this teacher teaches
   * (per the schedule).
   */
  async isGroupInTeacherScope(
    teacherId: string,
    groupId: string,
  ): Promise<boolean> {
    const groupIds = await this.getTaughtGroupIds(teacherId);
    return groupIds.includes(groupId);
  }

  /**
   * True if the given student belongs to a group this teacher teaches.
   * This is the check that must run before a teacher is allowed to
   * create/update a grade, attendance record or bonus for a student —
   * the studentId in a request body is never trusted on its own.
   */
  async isStudentInTeacherScope(
    teacherId: string,
    studentId: string,
  ): Promise<boolean> {
    const groupIds = await this.getTaughtGroupIds(teacherId);
    if (groupIds.length === 0) {
      return false;
    }

    const student = await this.studentRepository.findOneBy({
      id: studentId,
    });

    if (!student || !student.groupId) {
      return false;
    }

    return groupIds.includes(student.groupId);
  }

  /**
   * True if `subjectId` is the subject this teacher is assigned to teach.
   */
  async isSubjectInTeacherScope(
    teacherId: string,
    subjectId: string,
  ): Promise<boolean> {
    const teacher = await this.findOne(teacherId);
    return teacher.subjectId === subjectId;
  }

  async findStudents(id: string) {
    await this.findOne(id);

    const groupIds = await this.getTaughtGroupIds(id);

    if (groupIds.length === 0) {
      return [];
    }

    return this.studentRepository
      .createQueryBuilder('student')
      .leftJoin(
        'users',
        'user',
        'user.id = student.userId',
      )
      .leftJoin(
        'groups',
        'group',
        'group.id = student.groupId',
      )
      .select([
        'student.id AS id',
        'student.userId AS "userId"',
        'student.groupId AS "groupId"',
        'student.dateOfBirth AS "dateOfBirth"',
        'student.enrollmentDate AS "enrollmentDate"',
        'user.firstName AS "firstName"',
        'user.lastName AS "lastName"',
        'user.email AS email',
        'user.phone AS phone',
        'group.name AS "groupName"',
      ])
      .where(
        'student.groupId IN (:...groupIds)',
        { groupIds },
      )
      .getRawMany();
  }
}