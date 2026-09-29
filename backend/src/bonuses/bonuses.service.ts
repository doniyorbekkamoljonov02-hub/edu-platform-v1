import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bonus } from './entities/bonus.entity';
import { CreateBonusDto } from './dto/create-bonus.dto';
import { UpdateBonusDto } from './dto/update-bonus.dto';
import { TeachersService } from '../teachers/teachers.service';
import { Role } from '../common/enums/role.enum';
import { AuthenticatedUser } from '../common/types/authenticated-user.type';

@Injectable()
export class BonusesService {
  constructor(
    @InjectRepository(Bonus)
    private readonly bonusRepository: Repository<Bonus>,
    private readonly teachersService: TeachersService,
  ) {}

  async create(
    dto: CreateBonusDto,
    currentUser: AuthenticatedUser,
  ): Promise<Bonus> {
    const payload: CreateBonusDto = { ...dto };

    if (currentUser.role === Role.TEACHER) {
      const teacher = await this.teachersService.findMe(
        currentUser.userId,
      );

      // awardedById references the acting user's own id (not the teacher
      // profile id) and is never trusted from the client — it is always
      // derived from the JWT server-side.
      payload.awardedById = currentUser.userId;

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
    } else if (!payload.awardedById) {
      throw new ForbiddenException('awardedById ko‘rsatilishi shart.');
    }

    const bonus = this.bonusRepository.create(payload);
    return this.bonusRepository.save(bonus);
  }

  async findAll(currentUser: AuthenticatedUser): Promise<Bonus[]> {
    if (currentUser.role === Role.TEACHER) {
      return this.bonusRepository.find({
        where: { awardedById: currentUser.userId },
      });
    }

    // Unchanged for STUDENT/PARENT/ADMIN/DIRECTOR (out of scope for this fix).
    return this.bonusRepository.find();
  }

  async findOne(
    id: string,
    currentUser: AuthenticatedUser,
  ): Promise<Bonus> {
    const bonus = await this.getByIdOrFail(id);
    this.assertTeacherOwnership(bonus, currentUser);
    return bonus;
  }

  async update(
    id: string,
    dto: UpdateBonusDto,
    currentUser: AuthenticatedUser,
  ): Promise<Bonus> {
    const bonus = await this.getByIdOrFail(id);
    this.assertTeacherOwnership(bonus, currentUser);

    const payload: UpdateBonusDto = { ...dto };

    if (currentUser.role === Role.TEACHER) {
      const teacher = await this.teachersService.findMe(
        currentUser.userId,
      );

      // A teacher can never reassign a bonus to another user.
      payload.awardedById = currentUser.userId;

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
    }

    Object.assign(bonus, payload);
    return this.bonusRepository.save(bonus);
  }

  async remove(id: string, currentUser: AuthenticatedUser): Promise<void> {
    const bonus = await this.getByIdOrFail(id);
    this.assertTeacherOwnership(bonus, currentUser);
    await this.bonusRepository.remove(bonus);
  }

  private async getByIdOrFail(id: string): Promise<Bonus> {
    const bonus = await this.bonusRepository.findOneBy({ id });
    if (!bonus) {
      throw new NotFoundException(`Bonus with id ${id} not found`);
    }
    return bonus;
  }

  /**
   * A TEACHER may only read/modify bonuses they themselves awarded.
   * No-op for STUDENT/PARENT/ADMIN/DIRECTOR (unchanged behavior).
   */
  private assertTeacherOwnership(
    bonus: Bonus,
    currentUser: AuthenticatedUser,
  ): void {
    if (currentUser.role !== Role.TEACHER) {
      return;
    }

    if (bonus.awardedById !== currentUser.userId) {
      throw new ForbiddenException('Bu bonus sizga tegishli emas.');
    }
  }
}
