import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TeachersController } from './teachers.controller';
import { TeachersService } from './teachers.service';

import { Teacher } from './entities/teacher.entity';
import { Student } from '../students/entities/student.entity';
import { Schedule } from '../schedule/entities/schedule.entity';
import { User } from '../users/entities/user.entity';
import { Subject } from '../subjects/entities/subject.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Teacher,
      Student,
      Schedule,
      User,
      Subject,
    ]),
  ],
  controllers: [TeachersController],
  providers: [TeachersService],
  exports: [TeachersService],
})
export class TeachersModule {}