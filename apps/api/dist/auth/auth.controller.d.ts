import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(dto: RegisterDto): Promise<{
        user: {
            id: string;
            email: string;
            name: string;
            role: import(".prisma/client").$Enums.UserRole;
            company: {
                name: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                logo: string | null;
                domain: string | null;
                settings: import("@prisma/client/runtime/library").JsonValue | null;
            } | null;
        };
        token: string;
    }>;
    login(dto: LoginDto): Promise<{
        user: {
            id: string;
            email: string;
            name: string;
            role: import(".prisma/client").$Enums.UserRole;
            company: {
                name: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                logo: string | null;
                domain: string | null;
                settings: import("@prisma/client/runtime/library").JsonValue | null;
            } | null;
        };
        token: string;
    }>;
    me(user: any): Promise<{
        user: any;
    }>;
}
