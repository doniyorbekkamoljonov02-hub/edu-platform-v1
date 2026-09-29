import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  ForbiddenException,
} from '@nestjs/common';

import { TeachersService } from './teachers.service';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';

import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { AuthenticatedUser } from '../common/types/authenticated-user.type';

@Controller('teachers')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TeachersController {
  constructor(
    private readonly teachersService: TeachersService,
  ) {}

  @Post()
  @Roles(Role.ADMIN, Role.DIRECTOR)
  create(@Body() dto: CreateTeacherDto) {
    return this.teachersService.create(dto);
  }

  @Get()
  @Roles(
    Role.STUDENT,
    Role.TEACHER,
    Role.PARENT,
    Role.ADMIN,
    Role.DIRECTOR,
  )
  findAll() {
    return this.teachersService.findAll();
  }

  @Get('me')
  @Roles(Role.TEACHER)
  findMe(@Request() req: any) {
    return this.teachersService.findMe(
      req.user.userId,
    );
  }

  @Get('me/students')
  @Roles(Role.TEACHER)
  async findMyStudents(@Request() req: { user: AuthenticatedUser }) {
    const teacher = await this.teachersService.findMe(
      req.user.userId,
    );
    return this.teachersService.findStudents(teacher.id);
  }

  @Get(':id/students')
  @Roles(
    Role.TEACHER,
    Role.ADMIN,
    Role.DIRECTOR,
  )
  async findStudents(
    @Param('id') id: string,
    @Request() req: { user: AuthenticatedUser },
  ) {
    // A TEACHER may only ever list their own students — never another
    // teacher's, whatever :id is passed in the URL. ADMIN/DIRECTOR are
    // unrestricted (unchanged behavior).
    if (req.user.role === Role.TEACHER) {
      const teacher = await this.teachersService.findMe(
        req.user.userId,
      );
      if (teacher.id !== id) {
        throw new ForbiddenException(
          'Faqat o‘zingizga tegishli o‘quvchilar ro‘yxatini ko‘rishingiz mumkin.',
        );
      }
    }
    return this.teachersService.findStudents(id);
  }

  @Get(':id')
  @Roles(
    Role.STUDENT,
    Role.TEACHER,
    Role.PARENT,
    Role.ADMIN,
    Role.DIRECTOR,
  )
  findOne(@Param('id') id: string) {
    return this.teachersService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.DIRECTOR)
  update(
    @Param('id') id: string,
    @Body() dto: UpdateTeacherDto,
  ) {
    return this.teachersService.update(id, dto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.DIRECTOR)
  remove(@Param('id') id: string) {
    return this.teachersService.remove(id);
  }
}