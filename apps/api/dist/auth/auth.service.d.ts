import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';
export declare class AuthService {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
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
    validateUser(userId: string): Promise<{
        company: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            logo: string | null;
            domain: string | null;
            settings: import("@prisma/client/runtime/library").JsonValue | null;
        } | null;
    } & {
        email: string;
        password: string;
        name: string;
        id: string;
        role: import(".prisma/client").$Enums.UserRole;
        companyId: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    private generateToken;
}
