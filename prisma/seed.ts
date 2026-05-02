// prisma/seed.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  // 1. Clean the database (prevents duplicates if you run it multiple times)
  await prisma.infraction.deleteMany()
  await prisma.expense.deleteMany()
  await prisma.damage.deleteMany()
  await prisma.rental.deleteMany()
  await prisma.reservation.deleteMany()
  await prisma.vehicle.deleteMany()
  await prisma.client.deleteMany()

  console.log('🧹 Old data cleared.')

  // 2. Create Clients (Different types to test UI)
  const client1 = await prisma.client.create({
    data: {
      cin: 'AB123456',
      firstName: 'Sarah',
      lastName: 'Connor',
      email: 'sarah.c@example.com',
      phone: '+212 600 112233',
      city: 'Casablanca',
      isBlacklist: false,
    },
  })

  const client2 = await prisma.client.create({
    data: {
      cin: 'CD789012',
      firstName: 'James',
      lastName: 'Bond',
      email: 'james.b@example.com',
      phone: '+212 600 998877',
      city: 'Tangier',
      isBlacklist: false,
    },
  })

  // A blacklisted client to test the Admin List Noire feature
  const blacklistedClient = await prisma.client.create({
    data: {
      cin: 'XX999999',
      firstName: 'Reckless',
      lastName: 'Driver',
      email: 'danger@example.com',
      phone: '+212 600 000000',
      city: 'Marrakech',
      isBlacklist: true,
      blacklistReason: 'Never returned the car on time and caused severe damage.',
      blacklistedAt: new Date(),
    },
  })

  console.log('👥 Clients created.')

  // 3. Create a Premium Fleet of Vehicles
  const vehicle1 = await prisma.vehicle.create({
    data: {
      make: 'Tesla',
      model: 'Model 3',
      registration: '12345-A-1',
      year: 2024,
      dailyRate: 120,
      mileage: 15000,
      fuelType: 'Electric',
      transmission: 'Automatic',
      status: 'AVAILABLE',
      imageUrl: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=800&q=80',
    },
  })

  const vehicle2 = await prisma.vehicle.create({
    data: {
      make: 'Range Rover',
      model: 'Evoque',
      registration: '67890-B-2',
      year: 2023,
      dailyRate: 200,
      mileage: 45000,
      fuelType: 'Diesel',
      transmission: 'Automatic',
      status: 'RENTED', // Currently out on a trip!
      imageUrl: 'https://images.unsplash.com/photo-1606016159991-d853bd28b26f?auto=format&fit=crop&w=800&q=80',
    },
  })

  const vehicle3 = await prisma.vehicle.create({
    data: {
      make: 'Mercedes-Benz',
      model: 'C-Class',
      registration: '11223-C-3',
      year: 2022,
      dailyRate: 150,
      mileage: 60000,
      fuelType: 'Petrol',
      transmission: 'Automatic',
      status: 'AVAILABLE',
      imageUrl: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=800&q=80',
    },
  })

  const vehicle4 = await prisma.vehicle.create({
    data: {
      make: 'BMW',
      model: 'M4 Competition',
      registration: '99887-D-4',
      year: 2024,
      dailyRate: 350,
      mileage: 5000,
      fuelType: 'Petrol',
      transmission: 'Automatic',
      status: 'MAINTENANCE', // In the shop!
      imageUrl: 'https://images.unsplash.com/photo-1616423640778-28d1b53229bd?auto=format&fit=crop&w=800&q=80',
    },
  })

  console.log('🚗 Fleet populated.')

  // 4. Create Reservations (To test the Storefront My Bookings & Admin Dashboard)
  
  // A pending reservation in the future
  const futureDateStart = new Date()
  futureDateStart.setDate(futureDateStart.getDate() + 5)
  const futureDateEnd = new Date()
  futureDateEnd.setDate(futureDateEnd.getDate() + 8)

  await prisma.reservation.create({
    data: {
      clientId: client1.id,
      vehicleId: vehicle1.id,
      startDate: futureDateStart,
      endDate: futureDateEnd,
      totalPrice: 360, // 3 days * $120
      status: 'PENDING',
    },
  })

  // An approved reservation
  await prisma.reservation.create({
    data: {
      clientId: client2.id,
      vehicleId: vehicle3.id,
      startDate: futureDateStart,
      endDate: futureDateEnd,
      totalPrice: 450, 
      status: 'APPROVED',
    },
  })

  console.log('📅 Reservations scheduled.')

  // 5. Create an Active Rental
  await prisma.rental.create({
    data: {
      clientId: client1.id,
      vehicleId: vehicle2.id,
      startDate: new Date(),
      endDate: futureDateStart, // Returning in 5 days
      totalPrice: 1000,
      status: 'ACTIVE',
    },
  })

  console.log('🔑 Active rentals handed over.')

  // 6. Create Damages & Infractions
  await prisma.damage.create({
    data: {
      vehicleId: vehicle4.id,
      description: 'Scratched front bumper and cracked right headlight.',
      cost: 1200,
    },
  })

  await prisma.infraction.create({
    data: {
      clientId: blacklistedClient.id,
      description: 'Speeding ticket on the highway (140km/h).',
      amount: 300,
    },
  })

  // 7. Create Financial Expenses (To make your Accounting/Revenue charts look awesome)
  await prisma.expense.createMany({
    data: [
      { amount: 500, description: 'Monthly Fleet Insurance', category: 'Insurance' },
      { amount: 150, description: 'Oil change and tires for BMW', category: 'Maintenance' },
      { amount: 80, description: 'Car wash supplies', category: 'Operations' },
      { amount: 1200, description: 'Office Rent', category: 'Rent' },
    ]
  })

  console.log('💰 Financials and damages logged.')
  console.log('✅ Seeding completely finished! Your app is now fully armed and operational.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })