import { UsersService } from './users.service';
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
    getTeamMembers(user: any): Promise<{
        email: string;
        name: string;
        id: string;
        role: import(".prisma/client").$Enums.UserRole;
        createdAt: Date;
    }[]>;
}
