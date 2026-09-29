import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, IsNull, Repository } from 'typeorm';
import { News } from './entities/news.entity';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { User } from '../users/entities/user.entity';
import { Student } from '../students/entities/student.entity';
import { Parent } from '../parents/entities/parent.entity';
import { Teacher } from '../teachers/entities/teacher.entity';
import { Schedule } from '../schedule/entities/schedule.entity';
import { Group } from '../groups/entities/group.entity';
import { Role } from '../common/enums/role.enum';
import { AuthenticatedUser } from '../common/types/authenticated-user.type';

@Injectable()
export class NewsService {
  constructor(
    @InjectRepository(News) private readonly newsRepository: Repository<News>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Student) private readonly studentRepository: Repository<Student>,
    @InjectRepository(Parent) private readonly parentRepository: Repository<Parent>,
    @InjectRepository(Teacher) private readonly teacherRepository: Repository<Teacher>,
    @InjectRepository(Schedule) private readonly scheduleRepository: Repository<Schedule>,
    @InjectRepository(Group) private readonly groupRepository: Repository<Group>,
  ) {}

  async create(dto: CreateNewsDto, user: AuthenticatedUser) {
    await this.assertTargetAllowed(dto.targetGroupId, user);
    const news = await this.newsRepository.save(this.newsRepository.create({
      ...dto, authorId: user.userId, targetGroupId: dto.targetGroupId ?? null, isPublished: dto.isPublished ?? true,
    }));
    return this.decorate(news);
  }

  async findAll(user: AuthenticatedUser) {
    const groupIds = await this.visibleGroupIds(user);
    let rows: News[];
    if ([Role.ADMIN, Role.DIRECTOR].includes(user.role)) {
      rows = await this.newsRepository.find({ order: { createdAt: 'DESC' } });
    } else if (user.role === Role.TEACHER) {
      rows = await this.newsRepository.find({
        where: [{ targetGroupId: IsNull(), isPublished: true }, ...(groupIds.length ? [{ targetGroupId: In(groupIds), isPublished: true }] : [])],
        order: { createdAt: 'DESC' },
      });
    } else {
      rows = await this.newsRepository.find({
        where: [{ targetGroupId: IsNull(), isPublished: true }, ...(groupIds.length ? [{ targetGroupId: In(groupIds), isPublished: true }] : [])],
        order: { createdAt: 'DESC' },
      });
    }
    return Promise.all(rows.map((row) => this.decorate(row, user.userId)));
  }

  async findOneVisible(id: string, user: AuthenticatedUser) {
    const all = await this.findAll(user);
    const found = all.find((item: any) => item.id === id);
    if (!found) throw new NotFoundException('Yangilik topilmadi.');
    return found;
  }

  async update(id: string, dto: UpdateNewsDto, user: AuthenticatedUser) {
    const news = await this.getById(id);
    this.assertOwner(news, user);
    await this.assertTargetAllowed(dto.targetGroupId, user);
    const safe: any = { ...dto };
    delete safe.authorId;
    Object.assign(news, safe);
    return this.decorate(await this.newsRepository.save(news), user.userId);
  }

  async remove(id: string, user: AuthenticatedUser) {
    const news = await this.getById(id);
    this.assertOwner(news, user);
    await this.newsRepository.remove(news);
  }

  private async getById(id: string) {
    const news = await this.newsRepository.findOneBy({ id });
    if (!news) throw new NotFoundException('Yangilik topilmadi.');
    return news;
  }

  private assertOwner(news: News, user: AuthenticatedUser) {
    if (news.authorId !== user.userId) throw new ForbiddenException('Faqat o‘zingiz joylagan yangilikni o‘zgartira yoki o‘chira olasiz.');
  }

  private async assertTargetAllowed(groupId: string | undefined, user: AuthenticatedUser) {
    if (!groupId || user.role !== Role.TEACHER) return;
    const teacher = await this.teacherRepository.findOneBy({ userId: user.userId });
    if (!teacher) throw new ForbiddenException('O‘qituvchi profili topilmadi.');
    const count = await this.scheduleRepository.count({ where: { teacherId: teacher.id, groupId, isActive: true } });
    if (!count) throw new ForbiddenException('Siz bu sinfga dars bermaysiz.');
  }

  private async visibleGroupIds(user: AuthenticatedUser): Promise<string[]> {
    if (user.role === Role.STUDENT) {
      const student = await this.studentRepository.findOneBy({ userId: user.userId });
      return student?.groupId ? [student.groupId] : [];
    }
    if (user.role === Role.PARENT) {
      const parent = await this.parentRepository.findOneBy({ userId: user.userId });
      if (!parent?.studentId) return [];
      const student = await this.studentRepository.findOneBy({ id: parent.studentId });
      return student?.groupId ? [student.groupId] : [];
    }
    if (user.role === Role.TEACHER) {
      const teacher = await this.teacherRepository.findOneBy({ userId: user.userId });
      if (!teacher) return [];
      const schedules = await this.scheduleRepository.find({ where: { teacherId: teacher.id, isActive: true } });
      return [...new Set(schedules.map((s) => s.groupId))];
    }
    return [];
  }

  private async decorate(news: News, currentUserId?: string) {
    const [author, group] = await Promise.all([
      this.userRepository.findOneBy({ id: news.authorId }),
      news.targetGroupId ? this.groupRepository.findOneBy({ id: news.targetGroupId }) : null,
    ]);
    return {
      ...news,
      authorName: author ? `${author.firstName} ${author.lastName}` : '—',
      authorRole: author?.role ?? null,
      targetGroupName: group?.name ?? 'Barcha sinflar',
      canManage: currentUserId ? news.authorId === currentUserId : false,
    };
  }
}
