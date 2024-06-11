import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DeleteResult, Like, Repository, UpdateResult } from 'typeorm';
import { Post as PostEntity } from './entities/post.entity';
import { User } from 'src/user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { FilterUserDto } from 'src/user/dto/filter-user.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { FilterPostDto } from './dto/filter-post.dto';

@Injectable()
export class PostService {
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
        @InjectRepository(PostEntity) private postRepository: Repository<PostEntity>
    ) {}

    async findAll(query: FilterPostDto): Promise<any> {
        const item_per_pages = Number(query.item_per_pages) || 10;
        const page = Number(query.page) || 1;
        const category = Number(query.category) || null;
        const skip = (page - 1) * item_per_pages;
        const keyword = query.search || '';
        const [res, total] = await this.postRepository.findAndCount({
            where: [
                { 
                    title: Like('%' + keyword + '%'), 
                    category: {
                        id: category
                    }
                },
                { 
                    description: Like('%' + keyword + '%'),
                    category: {
                        id: category
                    } 
                },
            ],
            order: { created_at: "DESC"},
            take: item_per_pages,
            skip: skip,
            relations: {
                user: true,
                category: true
            },
            select: {
                category: {
                    id: true,
                    name: true
                },
                user: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                    avatar: true,
                }
            }
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

    async findDetail(id: number): Promise<PostEntity> {
        return await this.postRepository.findOne({
            where: {id},
            relations: ['user', 'category'],
            select: {
                category: {
                    id: true,
                    name: true
                },
                user: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                    avatar: true,
                }
            }
        });
    }

    async create(userId: number, createPostDto: CreatePostDto): Promise<PostEntity> {
        const user = await this.userRepository.findOneBy({ id: userId });
        try {
            const res = await this.postRepository.save({
                ...createPostDto, user
            });
            return await this.postRepository.findOneBy({ id: res.id });
        } catch (error) {
            throw new HttpException('Can not create post', HttpStatus.BAD_GATEWAY);
        }
    }

    async update(id:number, updatePostDto: UpdatePostDto): Promise<UpdateResult> {
        return await this.postRepository.update(id, updatePostDto);
    }

    async delete(id: number): Promise<DeleteResult> {
        return await this.postRepository.delete(id);
    }
}
