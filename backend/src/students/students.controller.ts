import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { CreateStudentAccountDto } from './dto/create-student-account.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { AuthenticatedUser } from '../common/types/authenticated-user.type';

@Controller('students')
@UseGuards(JwtAuthGuard, RolesGuard)
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Post('with-account')
  @Roles(Role.ADMIN, Role.DIRECTOR)
  createWithAccount(@Body() dto: CreateStudentAccountDto) { return this.studentsService.createWithAccount(dto); }

  @Post()
  @Roles(Role.ADMIN, Role.DIRECTOR)
  create(@Body() dto: CreateStudentDto) { return this.studentsService.create(dto); }

  @Get('me')
  @Roles(Role.STUDENT)
  findMe(@CurrentUser() user: AuthenticatedUser) {
    return this.studentsService.findMe(user.userId);
  }

  @Get()
  @Roles(Role.ADMIN, Role.DIRECTOR)
  findAll() { return this.studentsService.findAll(); }

  @Get(':id')
  @Roles(Role.ADMIN, Role.DIRECTOR)
  findOne(@Param('id') id: string) { return this.studentsService.findOne(id); }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.DIRECTOR)
  update(@Param('id') id: string, @Body() dto: UpdateStudentDto) { return this.studentsService.update(id, dto); }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.DIRECTOR)
  remove(@Param('id') id: string) { return this.studentsService.remove(id); }
}
