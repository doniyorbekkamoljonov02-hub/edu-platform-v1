import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Parent } from './entities/parent.entity';
import { Student } from '../students/entities/student.entity';
import { User } from '../users/entities/user.entity';
import { Group } from '../groups/entities/group.entity';
import { CreateParentDto } from './dto/create-parent.dto';
import { UpdateParentDto } from './dto/update-parent.dto';
import { CreateParentAccountDto } from './dto/create-parent-account.dto';
import { UsersService } from '../users/users.service';
import { Role } from '../common/enums/role.enum';

@Injectable()
export class ParentsService {
  constructor(
    @InjectRepository(Parent) private readonly parentRepository: Repository<Parent>,
    @InjectRepository(Student) private readonly studentRepository: Repository<Student>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Group) private readonly groupRepository: Repository<Group>,
    private readonly usersService: UsersService,
  ) {}


  async createWithAccount(dto: CreateParentAccountDto) {
    const student = await this.studentRepository.findOneBy({ id: dto.studentId });
    if (!student) throw new NotFoundException('Tanlangan o‘quvchi topilmadi.');
    const user = await this.usersService.create({
      email: dto.email, password: dto.password, firstName: dto.firstName,
      lastName: dto.lastName, phone: dto.phone, role: Role.PARENT, isActive: true,
    });
    try {
      const parent = await this.parentRepository.save(this.parentRepository.create({ userId: user.id, studentId: dto.studentId }));
      return { ...parent, firstName: user.firstName, lastName: user.lastName, email: user.email, phone: user.phone };
    } catch (error) {
      await this.usersService.remove(user.id).catch(() => undefined);
      throw error;
    }
  }

  create(dto: CreateParentDto): Promise<Parent> {
    return this.parentRepository.save(this.parentRepository.create(dto));
  }

  async findAll() {
    return this.parentRepository.createQueryBuilder('parent')
      .leftJoin('users', 'user', 'user.id = parent.userId')
      .leftJoin('students', 'student', 'student.id = parent.studentId')
      .leftJoin('users', 'childUser', 'childUser.id = student.userId')
      .select(['parent.id AS id','parent.userId AS "userId"','parent.studentId AS "studentId"','parent.createdAt AS "createdAt"','user.firstName AS "firstName"','user.lastName AS "lastName"','user.email AS email','user.phone AS phone','childUser.firstName AS "childFirstName"','childUser.lastName AS "childLastName"'])
      .orderBy('user.firstName','ASC').getRawMany();
  }

  async findMe(userId: string): Promise<Parent> {
    const parent = await this.parentRepository.findOneBy({ userId });
    if (!parent) throw new NotFoundException('Ota-ona profili topilmadi.');
    return parent;
  }

  async findMyChild(userId: string) {
    const parent = await this.findMe(userId);
    if (!parent.studentId) throw new NotFoundException('Farzand profili biriktirilmagan.');
    const student = await this.studentRepository.findOneBy({ id: parent.studentId });
    if (!student) throw new NotFoundException('Biriktirilgan o‘quvchi topilmadi.');
    const [account, group] = await Promise.all([
      this.userRepository.findOneBy({ id: student.userId }),
      student.groupId ? this.groupRepository.findOneBy({ id: student.groupId }) : null,
    ]);
    return {
      ...student,
      firstName: account?.firstName ?? null,
      lastName: account?.lastName ?? null,
      fullName: account ? `${account.firstName} ${account.lastName}` : '—',
      email: account?.email ?? null,
      phone: account?.phone ?? null,
      group: group ? { id: group.id, name: group.name } : null,
    };
  }

  async findOne(id: string): Promise<Parent> {
    const parent = await this.parentRepository.findOneBy({ id });
    if (!parent) throw new NotFoundException(`Parent with id ${id} not found`);
    return parent;
  }

  async update(id: string, dto: UpdateParentDto): Promise<Parent> {
    const parent = await this.findOne(id);
    Object.assign(parent, dto);
    return this.parentRepository.save(parent);
  }

  async remove(id: string): Promise<void> { await this.parentRepository.remove(await this.findOne(id)); }
}
