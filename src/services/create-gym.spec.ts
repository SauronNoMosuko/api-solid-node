import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { CreateGymUseCase } from './create-gym'

let gymsRepository: InMemoryGymsRepository
let sut: CreateGymUseCase

describe('Create Gym Use Case', () => {
    beforeEach(() => {
        gymsRepository = new InMemoryGymsRepository()
        sut = new CreateGymUseCase(gymsRepository)
    })
    it('shold be able to create a gym', async () => {

        const { gym } = await sut.execute({
            title: 'JavaScript Gym',
            description: null,
            phone: null,
            latitude: -8.1321629,
            longitude: -34.959609,
        })

        expect(gym.id).toEqual(expect.any(String))
    })
})


