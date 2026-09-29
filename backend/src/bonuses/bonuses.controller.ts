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
import { BonusesService } from './bonuses.service';
import { CreateBonusDto } from './dto/create-bonus.dto';
import { UpdateBonusDto } from './dto/update-bonus.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { AuthenticatedUser } from '../common/types/authenticated-user.type';

@Controller('bonuses')
@UseGuards(JwtAuthGuard, RolesGuard)
export class BonusesController {
  constructor(private readonly bonussService: BonusesService) {}

  @Post()
  @Roles(Role.TEACHER, Role.ADMIN, Role.DIRECTOR)
  create(
    @Body() dto: CreateBonusDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.bonussService.create(dto, user);
  }

  @Get()
  @Roles(Role.STUDENT, Role.TEACHER, Role.PARENT, Role.ADMIN, Role.DIRECTOR)
  findAll(@CurrentUser() user: AuthenticatedUser) {
    return this.bonussService.findAll(user);
  }

  @Get(':id')
  @Roles(Role.STUDENT, Role.TEACHER, Role.PARENT, Role.ADMIN, Role.DIRECTOR)
  findOne(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.bonussService.findOne(id, user);
  }

  @Patch(':id')
  @Roles(Role.TEACHER, Role.ADMIN, Role.DIRECTOR)
  update(
    @Param('id') id: string,
    @Body() dto: UpdateBonusDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.bonussService.update(id, dto, user);
  }

  @Delete(':id')
  @Roles(Role.TEACHER, Role.ADMIN, Role.DIRECTOR)
  remove(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.bonussService.remove(id, user);
  }
}
