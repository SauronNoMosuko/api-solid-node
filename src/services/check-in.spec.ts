import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { CheckInUseCase } from './check-in'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { Decimal } from '@prisma/client/runtime/library'

let checkInsRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let sut: CheckInUseCase


describe('Check-in Use Case', () => {
    beforeEach(() => {
        checkInsRepository = new InMemoryCheckInsRepository()
        gymsRepository = new InMemoryGymsRepository()
        sut = new CheckInUseCase(checkInsRepository, gymsRepository)

        gymsRepository.items.push({
            id: 'gym-01',
            title: 'JavaScript Gym',
            description: '',
            phone: '',
            latitude: new Decimal(-8.1321629),
            longitude: new Decimal(-34.959609),
        })


        vi.useFakeTimers()
    })

    afterEach(() => {
        vi.useRealTimers()
    })

    it('shold be able to check In', async () => {

        const { checkIn } = await sut.execute({
            gymId: 'gym-01',
            userId: 'user-01',
            userLatitude: -8.1321629,
            userLongitude: -34.959609,
        })

        expect(checkIn.id).toEqual(expect.any(String))
    })

    it('shold not be able to check In twice in the same day', async () => {

        vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

        await sut.execute({
            gymId: 'gym-01',
            userId: 'user-01',
            userLatitude: -8.1321629,
            userLongitude: -34.959609,
        })

        await expect(() => sut.execute({
            gymId: 'gym-01',
            userId: 'user-01',
            userLatitude: -8.1321629,
            userLongitude: -34.959609,
        })).rejects.toBeInstanceOf(Error)
    })

    it('shold not be able to check In twice but in different days', async () => {

        vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

        await sut.execute({
            gymId: 'gym-01',
            userId: 'user-01',
            userLatitude: -8.1321629,
            userLongitude: -34.959609,
        })

        vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0))


        const { checkIn } = await sut.execute({
            gymId: 'gym-01',
            userId: 'user-01',
            userLatitude: -8.1321629,
            userLongitude: -34.959609,
        })

        expect(checkIn.id).toEqual(expect.any(String))
    })

    it('shold not be able to check in on distant gym', async () => {

        gymsRepository.items.push({
            id: 'gym-02',
            title: 'JavaScript Gym',
            description: '',
            phone: '',
            latitude: new Decimal(-8.0547435),
            longitude: new Decimal(-34.8955197),
        })

        await expect(() => sut.execute({
            gymId: 'gym-02',
            userId: 'user-01',
            userLatitude: -8.1321629,
            userLongitude: -34.959609,
        })).rejects.toBeInstanceOf(Error)
    })


})


