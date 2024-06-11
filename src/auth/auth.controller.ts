import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
import { AuthService } from './auth.service';
import { User } from 'src/user/entities/user.entity';
import { LoginUserDto } from './dto/login-user.dto';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('register')
    @ApiResponse({status: 201, description: 'Register successfully!'})
    @ApiResponse({status: 401, description: 'Register fail!'})
    @UsePipes(ValidationPipe)
    register(@Body() registerUserDto:RegisterUserDto): Promise<User> {
        console.log('register api');
        console.log(registerUserDto);
        return this.authService.register(registerUserDto);
    }

    @Post('login')
    @ApiResponse({status: 201, description: 'Login successfully!'})
    @ApiResponse({status: 401, description: 'Login fail!'})
    @UsePipes(ValidationPipe)
    login(@Body() loginUserDto: LoginUserDto): Promise<any> {
        console.log('login api');
        console.log(loginUserDto);
        return this.authService.login(loginUserDto);
    }

    @Post('refresh-token')
    @ApiResponse({status: 201, description: 'Refresh token successfully!'})
    @ApiResponse({status: 401, description: 'Refresh token fail!'})
    refreshToken(@Body() body: RefreshTokenDto): Promise<any> {
        console.log('refresh token api');
        const { refresh_token } = body;
        return this.authService.refreshToken(refresh_token);
    }
}
