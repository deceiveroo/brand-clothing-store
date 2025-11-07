import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Создаем тестовые товары
  const products = await prisma.product.createMany({
    data: [
      {
        name: 'Neo-Tech Jacket',
        description: 'Smart jacket with temperature regulation and built-in LED lighting',
        price: 299.99,
        category: 'outerwear',
        featured: true,
        images: ['/products/jacket-1.jpg', '/products/jacket-2.jpg']
      },
      {
        name: 'Quantum Hoodie',
        description: 'Self-cleaning fabric with adaptive color technology',
        price: 189.99,
        category: 'tops',
        featured: true,
        images: ['/products/hoodie-1.jpg', '/products/hoodie-2.jpg']
      },
      {
        name: 'Cyber Pants',
        description: 'Flexible smart fabric with posture correction and muscle support',
        price: 159.99,
        category: 'bottoms',
        featured: true,
        images: ['/products/pants-1.jpg', '/products/pants-2.jpg']
      },
      {
        name: 'Nano-T Shirt',
        description: 'Breathable nano-fiber with odor elimination technology',
        price: 49.99,
        category: 'tops',
        featured: false,
        images: ['/products/tshirt-1.jpg', '/products/tshirt-2.jpg']
      },
      {
        name: 'Holo Sneakers',
        description: '3D printed sneakers with holographic accents and smart cushioning',
        price: 229.99,
        category: 'footwear',
        featured: true,
        images: ['/products/sneakers-1.jpg', '/products/sneakers-2.jpg']
      },
      {
        name: 'Data Gloves',
        description: 'Touchscreen compatible gloves with haptic feedback',
        price: 79.99,
        category: 'accessories',
        featured: false,
        images: ['/products/gloves-1.jpg', '/products/gloves-2.jpg']
      }
    ],
    skipDuplicates: true,
  })

  console.log('Database seeded successfully')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })