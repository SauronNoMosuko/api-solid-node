import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { hash } from 'bcryptjs'
import { GetUserProfileUseCase } from './get-user-profile'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

let usersRepository: InMemoryUsersRepository
let sut: GetUserProfileUseCase

describe('Get User Profile Use Case', () => {
    beforeEach(() => {
        usersRepository = new InMemoryUsersRepository()
        sut = new GetUserProfileUseCase(usersRepository)
    })
    it('shold be able to get user profile', async () => {

        const createdUser = await usersRepository.create({
            name: 'Douglas Numeriano',
            email: 'example@example1.com',
            password_hash: await hash('123456', 6)
        })

        const { user } = await sut.execute({
            userId: createdUser.id
        })

        expect(user.id).toEqual(expect.any(String))
        expect(user.name).toEqual('Douglas Numeriano')
    })

    it('shold be able to get user profile with wrong id', async () => {

        await expect(() => sut.execute({
            userId: 'non-existeng-id'
        })).rejects.toBeInstanceOf(ResourceNotFoundError)
    })

})


