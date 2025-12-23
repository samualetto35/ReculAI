import { PrismaService } from '../prisma/prisma.service';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    findById(id: string): Promise<({
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
    }) | null>;
    findByEmail(email: string): Promise<({
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
    }) | null>;
    findByCompany(companyId: string): Promise<{
        email: string;
        name: string;
        id: string;
        role: import(".prisma/client").$Enums.UserRole;
        createdAt: Date;
    }[]>;
}
