import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ParentsService } from './parents.service';
import { CreateParentDto } from './dto/create-parent.dto';
import { UpdateParentDto } from './dto/update-parent.dto';
import { CreateParentAccountDto } from './dto/create-parent-account.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { AuthenticatedUser } from '../common/types/authenticated-user.type';

@Controller('parents')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ParentsController {
  constructor(private readonly parentsService: ParentsService) {}

  @Post('with-account')
  @Roles(Role.ADMIN, Role.DIRECTOR)
  createWithAccount(@Body() dto: CreateParentAccountDto) { return this.parentsService.createWithAccount(dto); }

  @Post()
  @Roles(Role.ADMIN, Role.DIRECTOR)
  create(@Body() dto: CreateParentDto) { return this.parentsService.create(dto); }

  @Get('me')
  @Roles(Role.PARENT)
  findMe(@CurrentUser() user: AuthenticatedUser) { return this.parentsService.findMe(user.userId); }

  @Get('me/child')
  @Roles(Role.PARENT)
  findMyChild(@CurrentUser() user: AuthenticatedUser) { return this.parentsService.findMyChild(user.userId); }

  @Get()
  @Roles(Role.ADMIN, Role.DIRECTOR)
  findAll() { return this.parentsService.findAll(); }

  @Get(':id')
  @Roles(Role.ADMIN, Role.DIRECTOR)
  findOne(@Param('id') id: string) { return this.parentsService.findOne(id); }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.DIRECTOR)
  update(@Param('id') id: string, @Body() dto: UpdateParentDto) { return this.parentsService.update(id, dto); }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.DIRECTOR)
  remove(@Param('id') id: string) { return this.parentsService.remove(id); }
}
