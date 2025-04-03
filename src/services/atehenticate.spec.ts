import { describe, expect, it } from 'vitest'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { AuthenticateUseCase } from './authenticate'
import { hash } from 'bcryptjs'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'

describe('Authenticate Use Case', () => {
    it('shold be able to autheticate', async () => {
        const usersRepository = new InMemoryUsersRepository()
        const sut = new AuthenticateUseCase(usersRepository)

        await usersRepository.create({
            name: 'Douglas Numeriano',
            email: 'example@example1.com',
            password_hash: await hash('123456', 6)
        })

        const { user } = await sut.execute({
            email: 'example@example1.com',
            password: '123456'
        })

        expect(user.id).toEqual(expect.any(String))
    })

    it('shold be able to autheticate with wrong email', async () => {
        const usersRepository = new InMemoryUsersRepository()
        const sut = new AuthenticateUseCase(usersRepository)

        expect(() => sut.execute({
            email: 'example@example.com',
            password: '123456'
        })).rejects.toBeInstanceOf(InvalidCredentialsError)
    })

    it('shold be able to autheticate with wrong password', async () => {
        const usersRepository = new InMemoryUsersRepository()
        const sut = new AuthenticateUseCase(usersRepository)

        await usersRepository.create({
            name: 'Douglas Numeriano',
            email: 'example@example1.com',
            password_hash: await hash('123456', 6)
        })

        expect(() => sut.execute({
            email: 'example@example.com',
            password: '1234577'
        })).rejects.toBeInstanceOf(InvalidCredentialsError)
    })
})


