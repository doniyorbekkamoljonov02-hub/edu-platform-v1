import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Schedule } from './entities/schedule.entity';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { TeachersService } from '../teachers/teachers.service';
import { Role } from '../common/enums/role.enum';
import { AuthenticatedUser } from '../common/types/authenticated-user.type';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectRepository(Schedule)
    private readonly scheduleRepository: Repository<Schedule>,
    private readonly teachersService: TeachersService,
  ) {}

  create(dto: CreateScheduleDto): Promise<Schedule> {
    const schedule = this.scheduleRepository.create(dto);
    return this.scheduleRepository.save(schedule);
  }

  async findAll(currentUser: AuthenticatedUser): Promise<Schedule[]> {
    if (currentUser.role === Role.TEACHER) {
      const teacher = await this.teachersService.findMe(
        currentUser.userId,
      );
      return this.scheduleRepository.find({
        where: { teacherId: teacher.id },
      });
    }

    // Unchanged for STUDENT/PARENT/ADMIN/DIRECTOR (out of scope for this fix).
    return this.scheduleRepository.find();
  }

  /**
   * A TEACHER's own schedule, resolved server-side from their JWT.
   */
  async findMine(currentUser: AuthenticatedUser): Promise<Schedule[]> {
    const teacher = await this.teachersService.findMe(
      currentUser.userId,
    );
    return this.scheduleRepository.find({
      where: { teacherId: teacher.id },
    });
  }

  async findOne(
    id: string,
    currentUser: AuthenticatedUser,
  ): Promise<Schedule> {
    const schedule = await this.getByIdOrFail(id);

    if (currentUser.role === Role.TEACHER) {
      const teacher = await this.teachersService.findMe(
        currentUser.userId,
      );
      if (schedule.teacherId !== teacher.id) {
        throw new ForbiddenException(
          'Bu dars jadvali sizga tegishli emas.',
        );
      }
    }

    return schedule;
  }

  async update(id: string, dto: UpdateScheduleDto): Promise<Schedule> {
    const schedule = await this.getByIdOrFail(id);
    Object.assign(schedule, dto);
    return this.scheduleRepository.save(schedule);
  }

  async remove(id: string): Promise<void> {
    const schedule = await this.getByIdOrFail(id);
    await this.scheduleRepository.remove(schedule);
  }

  private async getByIdOrFail(id: string): Promise<Schedule> {
    const schedule = await this.scheduleRepository.findOneBy({ id });
    if (!schedule) {
      throw new NotFoundException(`Schedule with id ${id} not found`);
    }
    return schedule;
  }
}
