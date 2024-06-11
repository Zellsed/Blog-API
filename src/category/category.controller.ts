import { Body, Controller, Get, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { CategoryService } from './category.service';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGaurds } from 'src/auth/auth.guards';

@ApiBearerAuth()
@ApiTags('Category')
@Controller('category')
export class CategoryController {
    constructor(private categoryService: CategoryService) {}

    @Get('findAll')
    findAll(): Promise<Category[]> {
        return this.categoryService.findAll();
    }

    @Post('create')
    @UseGuards(AuthGaurds)
    @UsePipes(new ValidationPipe({ transform: true }))
    create(@Body() createCategoryDto: CreateCategoryDto): Promise<Category> {
        return this.categoryService.create(createCategoryDto);
    }
}
