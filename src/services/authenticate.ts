import { UsersRepository } from "@/repositories/users-repository";
import { InvalidCredentialsError } from "./errors/invalid-credentials-error";
import { User } from "@prisma/client";
import { compare } from "bcryptjs";

interface AutehticateUseCaseRequest {
    email: string
    password: string
}

interface AutehticateUseCaseResponse {
    user: User
}

export class AuthenticateUseCase {
    constructor(
        private usersRepository: UsersRepository
    ) { }

    async execute({ email, password }: AutehticateUseCaseRequest): Promise<AutehticateUseCaseResponse> {
        const user = await this.usersRepository.findByEmail(email)

        if (!user) {
            throw new InvalidCredentialsError()
        }

        const doesPasswordMatches = await compare(password, user.password_hash)

        if (!doesPasswordMatches) {
            throw new InvalidCredentialsError()
        }

        return {
            user,
        }
    }
}