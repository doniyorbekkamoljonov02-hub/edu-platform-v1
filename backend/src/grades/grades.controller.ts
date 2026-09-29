import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { GradesService } from './grades.service';
import { CreateGradeDto } from './dto/create-grade.dto';
import { UpdateGradeDto } from './dto/update-grade.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { AuthenticatedUser } from '../common/types/authenticated-user.type';

@Controller('grades')
@UseGuards(JwtAuthGuard, RolesGuard)
export class GradesController {
  constructor(private readonly gradesService: GradesService) {}

  @Post()
  @Roles(Role.TEACHER, Role.ADMIN, Role.DIRECTOR)
  create(
    @Body() dto: CreateGradeDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.gradesService.create(dto, user);
  }

  @Get()
  @Roles(Role.STUDENT, Role.TEACHER, Role.PARENT, Role.ADMIN, Role.DIRECTOR)
  findAll(@CurrentUser() user: AuthenticatedUser) {
    return this.gradesService.findAll(user);
  }

  @Get(':id')
  @Roles(Role.STUDENT, Role.TEACHER, Role.PARENT, Role.ADMIN, Role.DIRECTOR)
  findOne(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.gradesService.findOne(id, user);
  }

  @Patch(':id')
  @Roles(Role.TEACHER, Role.ADMIN, Role.DIRECTOR)
  update(
    @Param('id') id: string,
    @Body() dto: UpdateGradeDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.gradesService.update(id, dto, user);
  }

  @Delete(':id')
  @Roles(Role.TEACHER, Role.ADMIN, Role.DIRECTOR)
  remove(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.gradesService.remove(id, user);
  }
}
