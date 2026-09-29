import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ranking } from './entities/ranking.entity';
import { CreateRankingDto } from './dto/create-ranking.dto';
import { UpdateRankingDto } from './dto/update-ranking.dto';

@Injectable()
export class RankingService {
  constructor(
    @InjectRepository(Ranking)
    private readonly rankingRepository: Repository<Ranking>,
  ) {}

  create(dto: CreateRankingDto): Promise<Ranking> {
    const ranking = this.rankingRepository.create(dto);
    return this.rankingRepository.save(ranking);
  }

  findAll(): Promise<Ranking[]> {
    return this.rankingRepository.find();
  }

  async findOne(id: string): Promise<Ranking> {
    const ranking = await this.rankingRepository.findOneBy({ id });
    if (!ranking) {
      throw new NotFoundException(`Ranking with id ${id} not found`);
    }
    return ranking;
  }

  async update(id: string, dto: UpdateRankingDto): Promise<Ranking> {
    const ranking = await this.findOne(id);
    Object.assign(ranking, dto);
    return this.rankingRepository.save(ranking);
  }

  async remove(id: string): Promise<void> {
    const ranking = await this.findOne(id);
    await this.rankingRepository.remove(ranking);
  }
}
