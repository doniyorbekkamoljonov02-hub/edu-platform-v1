import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from './entities/student.entity';
import { User } from '../users/entities/user.entity';
import { Group } from '../groups/entities/group.entity';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { CreateStudentAccountDto } from './dto/create-student-account.dto';
import { UsersService } from '../users/users.service';
import { Role } from '../common/enums/role.enum';

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
    private readonly usersService: UsersService,
  ) {}


  async createWithAccount(dto: CreateStudentAccountDto) {
    const existing = await this.usersService.findByEmail(dto.email.trim().toLowerCase());
    if (existing) throw new ConflictException('Bu email bilan foydalanuvchi allaqachon mavjud.');

    const group = await this.groupRepository.findOneBy({ id: dto.groupId });
    if (!group) throw new NotFoundException('Tanlangan sinf topilmadi.');
    const user = await this.usersService.create({
      email: dto.email.trim().toLowerCase(), password: dto.password, firstName: dto.firstName.trim(),
      lastName: dto.lastName.trim(), phone: dto.phone?.trim() || undefined, role: Role.STUDENT, isActive: true,
    });
    try {
      const student = await this.studentRepository.save(this.studentRepository.create({
        userId: user.id, groupId: dto.groupId, dateOfBirth: dto.dateOfBirth,
        enrollmentDate: dto.enrollmentDate ?? new Date().toISOString().slice(0, 10),
      }));
      return { ...student, firstName: user.firstName, lastName: user.lastName, email: user.email, phone: user.phone, groupName: group.name };
    } catch (error) {
      await this.usersService.remove(user.id).catch(() => undefined);
      throw error;
    }
  }

  create(dto: CreateStudentDto): Promise<Student> {
    return this.studentRepository.save(this.studentRepository.create(dto));
  }

  async findAll() {
    return this.studentRepository.createQueryBuilder('student')
      .leftJoin('users', 'user', 'user.id = student.userId')
      .leftJoin('groups', 'group', 'group.id = student.groupId')
      .select(['student.id AS id','student.userId AS "userId"','student.groupId AS "groupId"','student.dateOfBirth AS "dateOfBirth"','student.enrollmentDate AS "enrollmentDate"','user.firstName AS "firstName"','user.lastName AS "lastName"','user.email AS email','user.phone AS phone','group.name AS "groupName"'])
      .orderBy('user.firstName', 'ASC').getRawMany();
  }

  async findMe(userId: string) {
    const student = await this.studentRepository.findOneBy({ userId });
    if (!student) throw new NotFoundException('O‘quvchi profili topilmadi.');

    const [user, group] = await Promise.all([
      this.userRepository.findOneBy({ id: student.userId }),
      student.groupId ? this.groupRepository.findOneBy({ id: student.groupId }) : null,
    ]);

    return {
      ...student,
      firstName: user?.firstName ?? null,
      lastName: user?.lastName ?? null,
      email: user?.email ?? null,
      phone: user?.phone ?? null,
      group: group ? { id: group.id, name: group.name } : null,
    };
  }

  async findOne(id: string): Promise<Student> {
    const student = await this.studentRepository.findOneBy({ id });
    if (!student) throw new NotFoundException(`Student with id ${id} not found`);
    return student;
  }

  async update(id: string, dto: UpdateStudentDto): Promise<Student> {
    const student = await this.findOne(id);
    Object.assign(student, dto);
    return this.studentRepository.save(student);
  }

  async remove(id: string): Promise<void> {
    await this.studentRepository.remove(await this.findOne(id));
  }
}
