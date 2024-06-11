import { Post } from "src/post/entities/post.entity";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column({ nullable:true, default:null })
    refrech_token: string;

    @Column({ nullable:true, default:null })
    avatar: string;

    @Column({ default: 1})
    status: number;

    @CreateDateColumn()
    created_at: Date;

    @CreateDateColumn()
    update_at: Date;

    @OneToMany(() => Post, (post) => post.user)
    posts: Post[];
}