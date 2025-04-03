import { describe, expect, it } from 'vitest'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { AuthenticateUseCase } from './authenticate'
import { hash } from 'crypto'

describe('Authenticate Use Case', () => {
    it('shold be able to autheticate', async () => {
        const usersRepository = new InMemoryUsersRepository()
        const sut = new AuthenticateUseCase(usersRepository)

        await usersRepository.create({
            name: 'Douglas Numeriano',
            email: 'example@example1.com',
            password_hash: await hash("123456", 6)
        })

        const { user } = await sut.execute({
            email: 'example@example1.com',
            password: '123456'
        })

        expect(user.id).toEqual(expect.any(String))
    })
})


