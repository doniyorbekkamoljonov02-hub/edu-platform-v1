import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { NewsService } from './news.service';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { AuthenticatedUser } from '../common/types/authenticated-user.type';

@Controller('news')
@UseGuards(JwtAuthGuard, RolesGuard)
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Post() @Roles(Role.TEACHER, Role.ADMIN, Role.DIRECTOR)
  create(@Body() dto: CreateNewsDto, @CurrentUser() user: AuthenticatedUser) { return this.newsService.create(dto, user); }

  @Get() @Roles(Role.STUDENT, Role.TEACHER, Role.PARENT, Role.ADMIN, Role.DIRECTOR)
  findAll(@CurrentUser() user: AuthenticatedUser) { return this.newsService.findAll(user); }

  @Get(':id') @Roles(Role.STUDENT, Role.TEACHER, Role.PARENT, Role.ADMIN, Role.DIRECTOR)
  findOne(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser) { return this.newsService.findOneVisible(id, user); }

  @Patch(':id') @Roles(Role.TEACHER, Role.ADMIN, Role.DIRECTOR)
  update(@Param('id') id: string, @Body() dto: UpdateNewsDto, @CurrentUser() user: AuthenticatedUser) { return this.newsService.update(id, dto, user); }

  @Delete(':id') @Roles(Role.TEACHER, Role.ADMIN, Role.DIRECTOR)
  remove(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser) { return this.newsService.remove(id, user); }
}
