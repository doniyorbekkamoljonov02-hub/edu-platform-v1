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
import { RankingService } from './ranking.service';
import { CreateRankingDto } from './dto/create-ranking.dto';
import { UpdateRankingDto } from './dto/update-ranking.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';

@Controller('ranking')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RankingController {
  constructor(private readonly rankingsService: RankingService) {}

  @Post()
  @Roles(Role.ADMIN, Role.DIRECTOR)
  create(@Body() dto: CreateRankingDto) {
    return this.rankingsService.create(dto);
  }

  @Get()
  @Roles(Role.STUDENT, Role.TEACHER, Role.PARENT, Role.ADMIN, Role.DIRECTOR)
  findAll() {
    return this.rankingsService.findAll();
  }

  @Get(':id')
  @Roles(Role.STUDENT, Role.TEACHER, Role.PARENT, Role.ADMIN, Role.DIRECTOR)
  findOne(@Param('id') id: string) {
    return this.rankingsService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.DIRECTOR)
  update(@Param('id') id: string, @Body() dto: UpdateRankingDto) {
    return this.rankingsService.update(id, dto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.DIRECTOR)
  remove(@Param('id') id: string) {
    return this.rankingsService.remove(id);
  }
}
