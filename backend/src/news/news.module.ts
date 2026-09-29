import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NewsService } from './news.service';
import { NewsController } from './news.controller';
import { News } from './entities/news.entity';
import { User } from '../users/entities/user.entity';
import { Student } from '../students/entities/student.entity';
import { Parent } from '../parents/entities/parent.entity';
import { Teacher } from '../teachers/entities/teacher.entity';
import { Schedule } from '../schedule/entities/schedule.entity';
import { Group } from '../groups/entities/group.entity';
@Module({
  imports: [TypeOrmModule.forFeature([News, User, Student, Parent, Teacher, Schedule, Group])],
  controllers: [NewsController], providers: [NewsService], exports: [NewsService],
})
export class NewsModule {}
