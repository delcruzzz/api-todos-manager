import { HttpException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { In, Repository } from 'typeorm';
import { Role } from 'src/roles/entities/role.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const user = this.userRepository.create(createUserDto);
    const passwordCrypt = await bcrypt.hash(user.password, 10);
    user.password = passwordCrypt;

    try {
      if (createUserDto.rolesId) {
        const roles = await this.roleRepository.findBy({
          id: In(createUserDto.rolesId),
        });
        user.roles = roles;
      }

      return this.userRepository.save(user);
    } catch (error) {
      throw new HttpException(error.message, 500);
    }
  }

  async findAll() {
    return await this.userRepository
      .createQueryBuilder('user')
      .innerJoinAndSelect('user.roles', 'role')
      .select([
        'user.id',
        'user.name',
        'user.lastname',
        'user.email',
        'user.username',
        'role.id',
        'role.name',
      ])
      .getMany();
  }

  async findOne(id: number) {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .innerJoinAndSelect('user.roles', 'role')
      .select([
        'user.id',
        'user.name',
        'user.lastname',
        'user.email',
        'user.username',
        'role.id',
        'role.name',
      ])
      .where('user.id = :id', { id })
      .getOne();

    if (!user) {
      throw new HttpException('User not found', 404);
    }

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.preload({
      id,
      ...updateUserDto,
    });

    if (!user) throw new HttpException('User not found', 404);

    try {
      if (updateUserDto.password) {
        const passwordEncripted = await bcrypt.hash(user.password, 10);
        user.password = passwordEncripted;
      }
      if (updateUserDto.rolesId) {
        const roles = await this.roleRepository.findBy({
          id: In(updateUserDto.rolesId),
        });
        user.roles = roles;
      }

      return await this.userRepository.save(user);
    } catch (error: any) {
      throw new HttpException(error.message, 500);
    }
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
