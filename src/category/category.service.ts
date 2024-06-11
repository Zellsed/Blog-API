import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { Post as PostEntity } from 'src/post/entities/post.entity';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class CategoryService {
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
        @InjectRepository(PostEntity) private postRepository: Repository<PostEntity>,
        @InjectRepository(Category) private categoryRepository: Repository<Category>
    ) {}

    async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
        return await this.categoryRepository.save(createCategoryDto);
    }

    async findAll(): Promise<Category[]> {
        return await this.categoryRepository.find();
    }
}
