import { BadRequestException, Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { storageConfig } from 'helpers/config';
import { CreatePostDto } from './dto/create-post.dto';
import { AuthGaurds } from 'src/auth/auth.guards';
import { PostService } from './post.service';
import { extname } from 'path';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { FilterPostDto } from './dto/filter-post.dto';
import { Post as PostEntity } from './entities/post.entity';
import { UpdatePostDto } from './dto/update-post.dto';

@ApiBearerAuth()
@ApiTags('Posts')
@Controller('posts')
export class PostController {
    constructor(private postService: PostService) {}

    @UseGuards(AuthGaurds)
    @ApiQuery({ name: 'page' })
    @ApiQuery({ name: 'item_per_pages' })
    @ApiQuery({ name: 'search' })
    @Get('findAll')
    findAll(@Query() query: FilterPostDto): Promise<any> {
        return this.postService.findAll(query);
    }

    @UseGuards(AuthGaurds)
    @Get('finđetail/:id')
    findDetail(@Param('id', ParseIntPipe) id: number): Promise<PostEntity> {
        return this.postService.findDetail(id);
    }

    @UseGuards(AuthGaurds)
    @Post('create')
    @UseInterceptors(FileInterceptor('thumbnail', {
        storage: storageConfig('post'),
        fileFilter: (req, file, cb) => {
            const ext = extname(file.originalname);
            const allowedExtArr = ['.jpg', '.png', '.jpeg'];
            if (!allowedExtArr.includes(ext)) {
                req.fileValidationError = `Wrong extension type. Accepted file ext are: ${allowedExtArr.toString()}`;
                cb(null, false);
            } else {
                const filesize = parseInt(req.headers['content-length']);
                if (filesize > 1024 * 1024 * 5) {
                    req.fileValidationError = 'File size exceeds the limit of 5MB';
                    cb(null, false);
                } else {
                    cb(null, true);
                }
            }
        }
    }))
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                title: {
                    type: 'string',
                },
                description: {
                    type: 'string',
                },
                thumbnail: {
                    type: 'string',
                    format: 'binary',
                },
                status: {
                    type: 'string',
                },
                category: {
                    type: 'string',
                },
            },
        },
    })
    create(@Req() req: any, @Body() createPostDto: CreatePostDto, @UploadedFile() file: Express.Multer.File) {
        console.log(req['user_data']);
        console.log(createPostDto);
        console.log(file);
        if (req.fileValidationError) {
            throw new BadRequestException(req.fileValidationError);
        } 
        if (!file) {
            throw new BadRequestException('File is required');
        }
        return this.postService.create(req['user_data'].id, {...createPostDto, thumbnail: file.destination + '/' + file.filename})
    }

    @UseGuards(AuthGaurds)
    @Put('update/:id')
    @UseInterceptors(FileInterceptor('thumbnail', {
        storage: storageConfig('post'),
        fileFilter: (req, file, cb) => {
            const ext = extname(file.originalname);
            const allowedExtArr = ['.jpg', '.png', '.jpeg'];
            if (!allowedExtArr.includes(ext)) {
                req.fileValidationError = `Wrong extension type. Accepted file ext are: ${allowedExtArr.toString()}`;
                cb(null, false);
            } else {
                const filesize = parseInt(req.headers['content-length']);
                if (filesize > 1024 * 1024 * 5) {
                    req.fileValidationError = 'File size exceeds the limit of 5MB';
                    cb(null, false);
                } else {
                    cb(null, true);
                }
            }
        }
    }))
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                title: {
                    type: 'string',
                },
                description: {
                    type: 'string',
                },
                thumbnail: {
                    type: 'string',
                    format: 'binary',
                },
                status: {
                    type: 'string',
                },
                category: {
                    type: 'string',
                },
            },
        },
    })
    update(@Param('id', ParseIntPipe) id: number, @Req() req: any, @Body() updatePostDto: UpdatePostDto, @UploadedFile() file: Express.Multer.File) {
        if (req.fileValidationError) {
            throw new BadRequestException(req.fileValidationError);
        } 
        if (file) {
            updatePostDto.thumbnail = file.destination + '/' + file.filename;
        }
        return this.postService.update(id, updatePostDto);
    }

    @UseGuards(AuthGaurds)
    @Delete('delete/:id')
    delete(@Param('id', ParseIntPipe) id: number) {
        return this.postService.delete(id);
    }
}
