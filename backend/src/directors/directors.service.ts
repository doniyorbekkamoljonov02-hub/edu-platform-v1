import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Director } from './entities/director.entity';
import { CreateDirectorDto } from './dto/create-director.dto';
import { UpdateDirectorDto } from './dto/update-director.dto';

@Injectable()
export class DirectorsService {
  constructor(
    @InjectRepository(Director)
    private readonly directorRepository: Repository<Director>,
  ) {}

  create(dto: CreateDirectorDto): Promise<Director> {
    const director = this.directorRepository.create(dto);
    return this.directorRepository.save(director);
  }

  findAll(): Promise<Director[]> {
    return this.directorRepository.find();
  }

  async findOne(id: string): Promise<Director> {
    const director = await this.directorRepository.findOneBy({ id });
    if (!director) {
      throw new NotFoundException(`Director with id ${id} not found`);
    }
    return director;
  }

  async update(id: string, dto: UpdateDirectorDto): Promise<Director> {
    const director = await this.findOne(id);
    Object.assign(director, dto);
    return this.directorRepository.save(director);
  }

  async remove(id: string): Promise<void> {
    const director = await this.findOne(id);
    await this.directorRepository.remove(director);
  }
}
