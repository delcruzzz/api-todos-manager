import { HttpException, Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async create(createRoleDto: CreateRoleDto) {
    const role = this.roleRepository.create(createRoleDto);

    try {
      return this.roleRepository.save(role);
    } catch (error) {
      throw new HttpException(error.message, 500);
    }
  }

  async findAll() {
    return await this.roleRepository.find({
      select: ['id', 'name'],
    });
  }

  async findOne(id: number) {
    const user = await this.roleRepository.findOne({
      where: { id },
      select: ['id', 'name'],
    });

    if (!user) {
      throw new HttpException(`Role #${id} not found`, 404);
    }

    return user;
  }

  async update(id: number, updateRoleDto: UpdateRoleDto) {
    const role = await this.roleRepository.preload({
      id: id,
      ...updateRoleDto,
    });

    if (!role) {
      throw new HttpException(`Role #${id} not found`, 404);
    }

    try {
      return this.roleRepository.save(role);
    } catch (error) {
      throw new HttpException(error.message, 500);
    }
  }

  remove(id: number) {
    return `This action removes a #${id} role`;
  }
}
