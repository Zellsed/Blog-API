import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { DeleteResult, Like, Repository, UpdateResult } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';
import { FilterUserDto } from './dto/filter-user.dto';

@Injectable()
export class UserService {
    constructor(@InjectRepository(User) private userReposiory: Repository<User>) {}

    async findAll(query: FilterUserDto): Promise<any> {
        const item_per_pages = Number(query.item_per_pages) || 10;
        const page = Number(query.page) || 1;
        const skip = (page - 1) * item_per_pages;
        const keyword = query.search || '';
        const [res, total] = await this.userReposiory.findAndCount({
            where: [
                { firstName: Like('%' + keyword + '%') },
                { lastName: Like('%' + keyword + '%') },
                { email: Like('%' + keyword + '%') },
            ],
            order: { created_at: "DESC"},
            take: item_per_pages,
            skip: skip,
            select: ['id', 'firstName', 'lastName', 'email', 'avatar', 'status', 'created_at', 'update_at']
        })
        const lastPage = Math.ceil(total / item_per_pages);
        const nextPage = page + 1 > lastPage ? null : page + 1;
        const prevPage = page - 1 < 1 ? null : page - 1;

        return {
            data: res,
            total,
            currenPage: page,
            nextPage,
            prevPage,
            lastPage
        }
    }

    async findOne(id: number): Promise<User> {
        return await this.userReposiory.findOne({
            where: {id}
        });
    }

    async create(createUserDto: CreateUserDto): Promise<User> {
        const hasdpassword = await bcrypt.hash(createUserDto.password, 10);
        return await this.userReposiory.save(createUserDto);
    }

    async update(id: number, updateUserDto: UpdateUserDto): Promise<UpdateResult> {
        return await this.userReposiory.update(id, updateUserDto);
    }

    async delete(id: number): Promise<DeleteResult> {
        return await this.userReposiory.delete(id);
    }

    async updateAvatar(id: number, avatar: string): Promise<UpdateResult> {
        return await this.userReposiory.update(id, { avatar });
    }
}
