import { BadRequestException, Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { AuthGaurds } from 'src/auth/auth.guards';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FilterUserDto } from './dto/filter-user.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { storageConfig } from 'helpers/config';
import { extname } from 'path';

@ApiBearerAuth()
@ApiTags('Users')
@Controller('users')
export class UserController {
    constructor(private userService: UserService) {}

    @UseGuards(AuthGaurds)
    @ApiQuery({ name: 'page' })
    @ApiQuery({ name: 'item_per_pages' })
    @ApiQuery({ name: 'search' })
    @ApiResponse({status: 201, description: 'Successfully!'})
    @ApiResponse({status: 401, description: 'Fail!'})
    @Get('findAll')
    findAll(@Query() query: FilterUserDto): Promise<User[]> {
        console.log(query);
        return this.userService.findAll(query);
    }

    @Get('profile')
    @UseGuards(AuthGaurds)
    profile(@Req() req:any):Promise<User> {
        return this.userService.findOne(Number(req.user_data.id));
    }

    @UseGuards(AuthGaurds)
    @ApiResponse({status: 201, description: 'Successfully!'})
    @ApiResponse({status: 401, description: 'Fail!'})
    @Get('findOne/:id')
    findOne(@Param('id', ParseIntPipe) id: number): Promise<User> {
        return this.userService.findOne(id);
    }

    @UseGuards(AuthGaurds)
    @ApiResponse({status: 201, description: 'Successfully!'})
    @ApiResponse({status: 401, description: 'Fail!'})
    @Post('create')
    create(@Body() createUserDto: CreateUserDto): Promise<User> {
        return this.userService.create(createUserDto);
    }

    @UseGuards(AuthGaurds)
    @ApiResponse({status: 201, description: 'Successfully!'})
    @ApiResponse({status: 401, description: 'Fail!'})
    @Put('update/:id')
    update(@Param('id', ParseIntPipe) id: number, @Body() updateUserDto: UpdateUserDto) {
        return this.userService.update(id, updateUserDto);
    }

    @UseGuards(AuthGaurds)
    @ApiResponse({status: 201, description: 'Successfully!'})
    @ApiResponse({status: 401, description: 'Fail!'})
    @Delete('delete/:id')
    delete(@Param('id', ParseIntPipe) id: number) {
        return this.userService.delete(id);
    }

    @UseGuards(AuthGaurds)
    @Post('upload-avatar')
    @UseInterceptors(FileInterceptor('avatar', {
        storage: storageConfig('avatar'),
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
                avatar: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    })
    @ApiResponse({status: 201, description: 'Successfully!'})
    @ApiResponse({status: 401, description: 'Fail!'})
    uploadAvatar(@Req() req: any, @UploadedFile() file: Express.Multer.File) {
        console.log("upload avatar");
        console.log("user data", req.user_data);
        console.log(file);
        if (req.fileValidationError) {
            throw new BadRequestException(req.fileValidationError);
        } 
        if (!file) {
            throw new BadRequestException('File is required');
        }
        return this.userService.updateAvatar(req.user_data.id, file.destination + '/' + file.filename);
    }
}
