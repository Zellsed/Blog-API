import { Category } from "src/category/entities/category.entity";
import { User } from "src/user/entities/user.entity";

export class CreatePostDto {
    title: string;

    description: string;

    thumbnail: string;

    status: string;

    user: User;

    category: Category;
}