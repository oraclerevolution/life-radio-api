import { ConflictException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Programme } from './entities/programme.entity';
import { CreateProgrammeDto } from './dto/create-programme.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateProgrammeDto } from './dto/update-programme.dto';

@Injectable()
export class ProgrammesService {
    constructor(
        @InjectRepository(Programme)
        private readonly repository: Repository<Programme>,
    ) {}

    async findAll(): Promise<Programme[]> {
        return this.repository.find();
    }

    async findOneByDay(day: string): Promise<Programme[]> {
        return this.repository.find({
            where: { day },
        });
    }

    async create(payload: CreateProgrammeDto): Promise<Programme | any> {
        const daySchedule = await this.findOneByDay(payload.day);
        if(daySchedule.length > 0){
            for (const programme of daySchedule) {
                if(programme.startingHour === payload.startingHour || programme.endingHour === payload.endingHour){
                    return {
                        status: false,
                        code: 409,
                        error: 'Le creneau horaire est en conflit avec un autre programme',
                    }
                }
            }
        }
        return this.repository.save({
            ...payload,
        });
    }

    async update(id: string, payload: UpdateProgrammeDto): Promise<Programme> {
        return this.repository.save({ id, ...payload });
    }
}
