import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

// Utility functions
const generateUniqueSlug = (name: string): string => {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + 
         '-' + faker.string.alphanumeric(6).toLowerCase();
};

const getRandomElement = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

const getRandomElements = <T>(array: T[], count: number): T[] => {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

const getRandomDate = (startDate: Date, endDate: Date): Date => {
  return new Date(
    startDate.getTime() + 
    Math.random() * (endDate.getTime() - startDate.getTime())
  );
};

const getRandomNumber = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

async function main() {
  console.log('Starting database seeding...');
  
  // Clean database - be careful with this in production!
  console.log('Cleaning database...');
  
  // Only delete user-related data, keep admin data
  await prisma.ticketMessage.deleteMany({});
  await prisma.supportTicket.deleteMany({});
  await prisma.notification.deleteMany({});
  await prisma.notificationTemplate.deleteMany({});
  await prisma.payment.deleteMany({});
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.question.deleteMany({});
  await prisma.review.deleteMany({});
  await prisma.cartItem.deleteMany({});
  await prisma.cart.deleteMany({});
  await prisma.wishlist.deleteMany({});
  await prisma.verificationToken.deleteMany({});
  await prisma.userAddress.deleteMany({});
  await prisma.passwordReset.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.platformSettings.deleteMany({});
  await prisma.user.deleteMany({});
  
  // Create categories
  console.log('Creating categories...');
  const categories = [
    { name: 'Skin Care', description: 'Products for your skin care routine' },
    { name: 'Hair Care', description: 'Products to keep your hair healthy and beautiful' },
    { name: 'Makeup', description: 'Makeup products for every occasion' },
    { name: 'Body Care', description: 'Products for your body care routine' },
    { name: 'Fragrances', description: 'Perfumes and body sprays for men and women' },
    { name: 'Accessories', description: 'Beauty tools and accessories' }
  ];
  
  const createdCategories = await Promise.all(
    categories.map(category => 
      prisma.category.create({
        data: {
          name: category.name,
          slug: generateUniqueSlug(category.name),
          description: category.description
        }
      })
    )
  );
  
  // Create products
  console.log('Creating products...');
  const productData = [];
  
  // Skin Care products
  const skinCareCategory = createdCategories.find(c => c.name === 'Skin Care')!;
  productData.push(
    { 
      name: 'Hydrating Facial Cleanser', 
      price: 15.99, 
      salePrice: null, 
      description: 'A gentle cleanser that removes impurities without stripping your skin of natural oils.',
      stockQuantity: 100,
      categoryId: skinCareCategory.id,
      productImages: [
        'https://placehold.co/400x400/png?text=Facial+Cleanser',
        'https://placehold.co/400x400/png?text=Cleanser+Detail'
      ]
    },
    { 
      name: 'Vitamin C Serum', 
      price: 29.99, 
      salePrice: 24.99, 
      description: 'Brightening serum with 15% Vitamin C to reduce dark spots and improve skin tone.',
      stockQuantity: 75,
      categoryId: skinCareCategory.id,
      productImages: [
        'https://placehold.co/400x400/png?text=Vitamin+C+Serum',
        'https://placehold.co/400x400/png?text=Serum+Detail'
      ]
    },
    { 
      name: 'Hyaluronic Acid Moisturizer', 
      price: 22.50, 
      salePrice: null, 
      description: 'Deeply hydrating moisturizer with hyaluronic acid for plump, hydrated skin.',
      stockQuantity: 120,
      categoryId: skinCareCategory.id,
      productImages: [
        'https://placehold.co/400x400/png?text=Moisturizer',
        'https://placehold.co/400x400/png?text=Moisturizer+Detail'
      ]
    },
    { 
      name: 'Retinol Night Cream', 
      price: 35.99, 
      salePrice: 32.99, 
      description: 'Anti-aging night cream with retinol to reduce fine lines and wrinkles.',
      stockQuantity: 60,
      categoryId: skinCareCategory.id,
      productImages: [
        'https://placehold.co/400x400/png?text=Night+Cream',
        'https://placehold.co/400x400/png?text=Night+Cream+Detail'
      ]
    }
  );
  
  // Hair Care products
  const hairCareCategory = createdCategories.find(c => c.name === 'Hair Care')!;
  productData.push(
    { 
      name: 'Strengthening Shampoo', 
      price: 18.99, 
      salePrice: null, 
      description: 'Strengthens hair from root to tip and prevents breakage.',
      stockQuantity: 150,
      categoryId: hairCareCategory.id,
      productImages: [
        'https://placehold.co/400x400/png?text=Shampoo',
        'https://placehold.co/400x400/png?text=Shampoo+Detail'
      ]
    },
    { 
      name: 'Deep Conditioning Hair Mask', 
      price: 24.99, 
      salePrice: 19.99, 
      description: 'Weekly treatment to deeply nourish and repair damaged hair.',
      stockQuantity: 85,
      categoryId: hairCareCategory.id,
      productImages: [
        'https://placehold.co/400x400/png?text=Hair+Mask',
        'https://placehold.co/400x400/png?text=Hair+Mask+Detail'
      ]
    },
    { 
      name: 'Argan Oil Hair Serum', 
      price: 19.50, 
      salePrice: null, 
      description: 'Lightweight serum with argan oil to tame frizz and add shine.',
      stockQuantity: 100,
      categoryId: hairCareCategory.id,
      productImages: [
        'https://placehold.co/400x400/png?text=Hair+Serum',
        'https://placehold.co/400x400/png?text=Hair+Serum+Detail'
      ]
    }
  );
  
  // Makeup products
  const makeupCategory = createdCategories.find(c => c.name === 'Makeup')!;
  productData.push(
    { 
      name: 'Long-lasting Foundation', 
      price: 32.00, 
      salePrice: null, 
      description: 'Full coverage foundation that lasts all day with a natural finish.',
      stockQuantity: 120,
      categoryId: makeupCategory.id,
      productImages: [
        'https://placehold.co/400x400/png?text=Foundation',
        'https://placehold.co/400x400/png?text=Foundation+Detail'
      ]
    },
    { 
      name: 'Volumizing Mascara', 
      price: 16.99, 
      salePrice: 14.99, 
      description: 'Adds dramatic volume and length to lashes without clumping.',
      stockQuantity: 200,
      categoryId: makeupCategory.id,
      productImages: [
        'https://placehold.co/400x400/png?text=Mascara',
        'https://placehold.co/400x400/png?text=Mascara+Detail'
      ]
    },
    { 
      name: 'Matte Lipstick Set', 
      price: 45.00, 
      salePrice: 39.99, 
      description: 'Set of 4 long-lasting matte lipsticks in versatile shades.',
      stockQuantity: 75,
      categoryId: makeupCategory.id,
      productImages: [
        'https://placehold.co/400x400/png?text=Lipstick+Set',
        'https://placehold.co/400x400/png?text=Lipstick+Detail'
      ]
    }
  );
  
  // Body Care products
  const bodyCareCategory = createdCategories.find(c => c.name === 'Body Care')!;
  productData.push(
    { 
      name: 'Exfoliating Body Scrub', 
      price: 18.50, 
      salePrice: null, 
      description: 'Exfoliates and smooths skin with natural ingredients.',
      stockQuantity: 110,
      categoryId: bodyCareCategory.id,
      productImages: [
        'https://placehold.co/400x400/png?text=Body+Scrub',
        'https://placehold.co/400x400/png?text=Scrub+Detail'
      ]
    },
    { 
      name: 'Shea Butter Body Lotion', 
      price: 22.99, 
      salePrice: 19.99, 
      description: 'Rich body lotion with shea butter for deep hydration.',
      stockQuantity: 130,
      categoryId: bodyCareCategory.id,
      productImages: [
        'https://placehold.co/400x400/png?text=Body+Lotion',
        'https://placehold.co/400x400/png?text=Lotion+Detail'
      ]
    },
    { 
      name: 'Hand Repair Cream', 
      price: 12.99, 
      salePrice: null, 
      description: 'Intensive treatment for dry, cracked hands.',
      stockQuantity: 180,
      categoryId: bodyCareCategory.id,
      productImages: [
        'https://placehold.co/400x400/png?text=Hand+Cream',
        'https://placehold.co/400x400/png?text=Cream+Detail'
      ]
    }
  );
  
  // Fragrances products
  const fragrancesCategory = createdCategories.find(c => c.name === 'Fragrances')!;
  productData.push(
    { 
      name: 'Floral Eau de Parfum', 
      price: 65.00, 
      salePrice: 59.99, 
      description: 'Elegant floral fragrance with notes of jasmine and rose.',
      stockQuantity: 50,
      categoryId: fragrancesCategory.id,
      productImages: [
        'https://placehold.co/400x400/png?text=Floral+Perfume',
        'https://placehold.co/400x400/png?text=Perfume+Detail'
      ]
    },
    { 
      name: 'Citrus Body Mist', 
      price: 28.99, 
      salePrice: null, 
      description: 'Refreshing body mist with citrus and mint notes.',
      stockQuantity: 90,
      categoryId: fragrancesCategory.id,
      productImages: [
        'https://placehold.co/400x400/png?text=Body+Mist',
        'https://placehold.co/400x400/png?text=Mist+Detail'
      ]
    }
  );
  
  // Accessories products
  const accessoriesCategory = createdCategories.find(c => c.name === 'Accessories')!;
  productData.push(
    { 
      name: 'Makeup Brush Set', 
      price: 49.99, 
      salePrice: 39.99, 
      description: 'Set of 12 professional-quality makeup brushes with case.',
      stockQuantity: 60,
      categoryId: accessoriesCategory.id,
      productImages: [
        'https://placehold.co/400x400/png?text=Brush+Set',
        'https://placehold.co/400x400/png?text=Brushes+Detail'
      ]
    },
    { 
      name: 'Silicone Face Cleanser', 
      price: 25.00, 
      salePrice: null, 
      description: 'Electric silicone face cleanser for deep cleaning.',
      stockQuantity: 70,
      categoryId: accessoriesCategory.id,
      productImages: [
        'https://placehold.co/400x400/png?text=Face+Cleanser',
        'https://placehold.co/400x400/png?text=Cleanser+Detail'
      ]
    },
    { 
      name: 'Jade Facial Roller', 
      price: 22.99, 
      salePrice: 18.99, 
      description: 'Jade roller for facial massage and reducing puffiness.',
      stockQuantity: 100,
      categoryId: accessoriesCategory.id,
      productImages: [
        'https://placehold.co/400x400/png?text=Jade+Roller',
        'https://placehold.co/400x400/png?text=Roller+Detail'
      ]
    }
  );
  
  const createdProducts = await Promise.all(
    productData.map(product => 
      prisma.product.create({
        data: {
          name: product.name,
          slug: generateUniqueSlug(product.name),
          price: product.price,
          salePrice: product.salePrice,
          description: product.description,
          stockQuantity: product.stockQuantity,
          inStock: product.stockQuantity > 0,
          productImages: product.productImages,
          categoryId: product.categoryId
        }
      })
    )
  );
  
  // Create notification templates
  console.log('Creating notification templates...');
  const notificationTemplates = [
    {
      templateId: 'order_confirmation',
      name: 'Order Confirmation',
      content: 'Dear {{customerName}}, thank you for your order #{{orderNumber}}. Your order has been confirmed and is being processed.',
      type: 'ORDER_CONFIRMATION',
      active: true
    },
    {
      templateId: 'shipping_update',
      name: 'Shipping Update',
      content: 'Dear {{customerName}}, your order #{{orderNumber}} has been shipped and is on its way to you.',
      type: 'SHIPPING_UPDATE',
      active: true
    },
    {
      templateId: 'delivery_confirmation',
      name: 'Delivery Confirmation',
      content: 'Dear {{customerName}}, your order #{{orderNumber}} has been delivered. We hope you enjoy your products!',
      type: 'DELIVERY_CONFIRMATION',
      active: true
    },
    {
      templateId: 'order_cancellation',
      name: 'Order Cancellation',
      content: 'Dear {{customerName}}, your order #{{orderNumber}} has been cancelled as requested.',
      type: 'ORDER_CANCELLATION',
      active: true
    },
    {
      templateId: 'payment_reminder',
      name: 'Payment Reminder',
      content: 'Dear {{customerName}}, this is a reminder that payment for your order #{{orderNumber}} is pending.',
      type: 'PAYMENT_REMINDER',
      active: true
    }
  ];
  
  await Promise.all(
    notificationTemplates.map(template => 
      prisma.notificationTemplate.create({
        data: {
          templateId: template.templateId,
          name: template.name,
          content: template.content,
          type: template.type as any,
          active: template.active
        }
      })
    )
  );
  
  // Create platform settings
  console.log('Creating platform settings...');
  const platformSettings = [
    {
      settingKey: 'appearance',
      settingValue: {
        primaryColor: '#6366f1',
        secondaryColor: '#8b5cf6',
        accentColor: '#ec4899',
        logo: 'https://placehold.co/200x100/png?text=Livssentials',
        favicon: 'https://placehold.co/32x32/png?text=L',
        fonts: {
          heading: 'Inter',
          body: 'Roboto'
        }
      }
    },
    {
      settingKey: 'contact',
      settingValue: {
        email: 'contact@livssentials.co',
        phone: '+233 12 345 6789',
        address: '123 Main Street, Accra, Ghana',
        socialMedia: {
          facebook: 'https://facebook.com/livssentials',
          instagram: 'https://instagram.com/livssentials',
          twitter: 'https://twitter.com/livssentials'
        }
      }
    },
    {
      settingKey: 'seo',
      settingValue: {
        title: 'Livssentials - Premium Beauty Products',
        description: 'Discover premium beauty and self-care products at Livssentials. Shop our collection of skincare, makeup, and more.',
        keywords: ['beauty', 'skincare', 'makeup', 'self-care', 'ghana'],
        ogImage: 'https://placehold.co/1200x630/png?text=Livssentials+OG+Image'
      }
    }
  ];
  
  await Promise.all(
    platformSettings.map(setting => 
      prisma.platformSettings.create({
        data: {
          settingKey: setting.settingKey,
          settingValue: setting.settingValue as any
        }
      })
    )
  );
  
  // Create users
  console.log('Creating users...');
  const users = [];
  
  for (let i = 1; i <= 20; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    
    users.push({
      email: faker.internet.email({ firstName, lastName }).toLowerCase(),
      password: await bcrypt.hash('Password123!', 10),
      firstName,
      lastName,
      phone: '+233 ' + faker.string.numeric(2) + ' ' + faker.string.numeric(3) + ' ' + faker.string.numeric(4),
      role: 'USER' as any
    });
  }
  
  const createdUsers = await Promise.all(
    users.map(user => 
      prisma.user.create({
        data: user
      })
    )
  );
  
  // Create user addresses
  console.log('Creating user addresses...');
  
  const ghanaRegions = [
    'Greater Accra', 'Ashanti', 'Western', 'Eastern', 'Central', 
    'Volta', 'Northern', 'Upper East', 'Upper West', 'Bono East'
  ];
  
  const ghanaCities = {
    'Greater Accra': ['Accra', 'Tema', 'Madina', 'Teshie', 'Ashaiman'],
    'Ashanti': ['Kumasi', 'Obuasi', 'Ejisu', 'Bekwai', 'Mampong'],
    'Western': ['Takoradi', 'Sekondi', 'Tarkwa', 'Axim', 'Bogoso'],
    'Eastern': ['Koforidua', 'Nsawam', 'Kibi', 'Somanya', 'Akosombo'],
    'Central': ['Cape Coast', 'Winneba', 'Elmina', 'Kasoa', 'Agona Swedru'],
    'Volta': ['Ho', 'Hohoe', 'Keta', 'Anloga', 'Kpando'],
    'Northern': ['Tamale', 'Yendi', 'Savelugu', 'Bimbilla', 'Gushegu'],
    'Upper East': ['Bolgatanga', 'Bawku', 'Navrongo', 'Zebilla', 'Paga'],
    'Upper West': ['Wa', 'Jirapa', 'Lawra', 'Tumu', 'Nadowli'],
    'Bono East': ['Techiman', 'Kintampo', 'Nkoranza', 'Atebubu', 'Yeji']
  };
  
  for (const user of createdUsers) {
    // Create 1-3 addresses per user
    const addressCount = Math.floor(Math.random() * 3) + 1;
    
    for (let i = 0; i < addressCount; i++) {
      const region = getRandomElement(ghanaRegions);
      const city = getRandomElement(ghanaCities[region as keyof typeof ghanaCities]);
      
      await prisma.userAddress.create({
        data: {
          userId: user.id,
          streetName: faker.location.streetAddress(),
          city,
          postalCode: faker.location.zipCode('####'),
          region
        }
      });
    }
  }
  
  // Create verification tokens for some users
  console.log('Creating verification tokens...');
  
  for (let i = 0; i < 5; i++) {
    const user = getRandomElement(createdUsers);
    
    await prisma.verificationToken.create({
      data: {
        userId: user.id,
        token: faker.string.alphanumeric(32),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours from now
      }
    });
  }
  
  // Create password reset tokens
  console.log('Creating password reset tokens...');
  
  for (let i = 0; i < 3; i++) {
    const user = getRandomElement(createdUsers);
    
    await prisma.passwordReset.create({
      data: {
        email: user.email,
        code: faker.string.numeric(6),
        expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour from now
        used: Math.random() > 0.7 // 30% chance of being used
      }
    });
  }
  
  // Create carts for users
  console.log('Creating carts and cart items...');
  
  for (const user of createdUsers) {
    // Create a cart for each user
    const cart = await prisma.cart.create({
      data: {
        userId: user.id
      }
    });
    
    // Add 0-4 items to cart
    const cartItemCount = Math.floor(Math.random() * 5);
    
    if (cartItemCount > 0) {
      const cartProducts = getRandomElements(createdProducts, cartItemCount);
      
      for (const product of cartProducts) {
        await prisma.cartItem.create({
          data: {
            cartId: cart.id,
            productId: product.id,
            quantity: Math.floor(Math.random() * 3) + 1
          }
        });
      }
    }
  }
  
  // Create wishlists for users
  console.log('Creating wishlists...');
  
  for (const user of createdUsers) {
    // Add 0-5 products to wishlist
    const wishlistCount = Math.floor(Math.random() * 6);
    
    if (wishlistCount > 0) {
      const wishlistProducts = getRandomElements(createdProducts, wishlistCount);
      
      for (const product of wishlistProducts) {
        await prisma.wishlist.create({
          data: {
            userId: user.id,
            productId: product.id
          }
        });
      }
    }
  }
  
  // Create orders and related data
  console.log('Creating orders, order items, and payments...');
  
  const orderStatuses = ['PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
  const paymentMethods = ['MOBILE_MONEY', 'CREDIT_CARD'];
  const paymentStatuses = ['PROCESSING', 'COMPLETED', 'CANCELLED', 'REFUNDED'];
  
  let orderNumber = 10000;
  
  for (const user of createdUsers) {
    // Create 3-5 orders per user
    const orderCount = Math.floor(Math.random() * 3) + 3;
    
    for (let i = 0; i < orderCount; i++) {
      // Get 1-5 random products for this order
      const productCount = Math.floor(Math.random() * 5) + 1;
      const orderProducts = getRandomElements(createdProducts, productCount);
      
      // Calculate order total
      let totalAmount = 0;
      const orderItems = [];
      
      for (const product of orderProducts) {
        const quantity = Math.floor(Math.random() * 3) + 1;
        const price = product.salePrice || product.price;
        totalAmount += price * quantity;
        
        orderItems.push({
          productId: product.id,
          quantity,
          price
        });
      }
      
      // Create order
      const orderStatus = getRandomElement(orderStatuses);
      const createdAt = getRandomDate(
        new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), // 90 days ago
        new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)   // 1 day ago
      );
      
      const order = await prisma.order.create({
        data: {
          orderNumber: `ORD-${orderNumber++}`,
          userId: user.id,
          totalAmount,
          orderStatus: orderStatus as any,
          shippingAddress: faker.location.streetAddress() + ', ' + 
                          getRandomElement(ghanaCities['Greater Accra']) + ', ' +
                          'Greater Accra, Ghana',
          createdAt,
          updatedAt: new Date(createdAt.getTime() + Math.random() * 24 * 60 * 60 * 1000),
          products: {
            connect: orderProducts.map(product => ({ id: product.id }))
          }
        }
      });
      
      // Create order items
      for (const item of orderItems) {
        await prisma.orderItem.create({
          data: {
            orderId: order.id,
            productId: item.productId,
            quantity: item.quantity,
            price: item.price
          }
        });
      }
      
      // Create payment
      const paymentMethod = getRandomElement(paymentMethods);
      const paymentStatus = orderStatus === 'CANCELLED' 
        ? 'CANCELLED' 
        : getRandomElement(paymentStatuses);
      
      await prisma.payment.create({
        data: {
          orderId: order.id,
          amount: totalAmount,
          transactionId: faker.string.alphanumeric(12).toUpperCase(),
          paymentMethod: paymentMethod as any,
          paymentStatus: paymentStatus as any,
          createdAt: createdAt,
          updatedAt: new Date(createdAt.getTime() + Math.random() * 12 * 60 * 60 * 1000)
        }
      });
      
      // Create notifications for the order
      if (Math.random() > 0.3) { // 70% chance of having a notification
        const notificationType = orderStatus === 'PROCESSING' 
          ? 'ORDER_CONFIRMATION' 
          : orderStatus === 'SHIPPED' 
            ? 'SHIPPING_UPDATE' 
            : orderStatus === 'DELIVERED' 
              ? 'DELIVERY_CONFIRMATION' 
              : 'ORDER_CANCELLATION';
        
        const notificationStatus = Math.random() > 0.2 ? 'DELIVERED' : 'PENDING';
        
        await prisma.notification.create({
          data: {
            recipient: user.phone,
            message: `Dear ${user.firstName}, your order #${order.orderNumber} has been ${orderStatus.toLowerCase()}.`,
            notificationType: notificationType as any,
            orderId: order.id,
            status: notificationStatus as any,
            termiiMessageId: notificationStatus === 'DELIVERED' ? faker.string.alphanumeric(24) : null,
            credits: Math.floor(Math.random() * 3) + 1,
            createdAt: new Date(createdAt.getTime() + Math.random() * 2 * 60 * 60 * 1000)
          }
        });
      }
    }
  }
  
  // Create reviews
  console.log('Creating reviews...');
  
  const reviewStatuses = ['PUBLISHED', 'PENDING', 'HIDDEN'];
  const reviewTitles = [
    'Love this product!', 
    'Exceeded my expectations', 
    'Not what I expected', 
    'Great value for money',
    'Will buy again',
    'Disappointing',
    'Amazing quality',
    'Could be better',
    'Perfect for my needs',
    'Highly recommend'
  ];
  
  // Create 30-50 reviews across products
  const reviewCount = getRandomNumber(30, 50);
  
  for (let i = 0; i < reviewCount; i++) {
    const user = getRandomElement(createdUsers);
    const product = getRandomElement(createdProducts);
    const rating = getRandomNumber(1, 5);
    const status = getRandomElement(reviewStatuses);
    const hasReply = Math.random() > 0.7; // 30% chance of having a reply
    const createdAt = getRandomDate(
      new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), // 60 days ago
      new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)   // 1 day ago
    );
    
    // Random number of images (0-2)
    const imageCount = Math.floor(Math.random() * 3);
    const images = [];
    
    for (let j = 0; j < imageCount; j++) {
      images.push(`https://placehold.co/300x300/png?text=Review+Image+${j+1}`);
    }
    
    await prisma.review.create({
      data: {
        userId: user.id,
        productId: product.id,
        rating,
        title: getRandomElement(reviewTitles),
        content: faker.lorem.paragraph(),
        images,
        reply: hasReply ? faker.lorem.paragraph() : null,
        status: status as any,
        createdAt,
        updatedAt: hasReply 
          ? new Date(createdAt.getTime() + Math.random() * 3 * 24 * 60 * 60 * 1000)
          : createdAt
      }
    });
  }
  
  // Create questions
  console.log('Creating questions...');
  
  const questionStatuses = ['ANSWERED', 'PENDING'];
  const sampleQuestions = [
    'Is this product suitable for sensitive skin?',
    'How long does this product typically last?',
    'Does this come with a warranty?',
    'Can this be used during pregnancy?',
    'Is this product tested on animals?',
    'What are the ingredients?',
    'Do you offer samples of this product?',
    'How often should I use this product?',
    'Can I use this with other products in the line?',
    'Is this product suitable for oily skin?'
  ];
  
  // Create 15-30 questions across products
  const questionCount = getRandomNumber(15, 30);
  
  for (let i = 0; i < questionCount; i++) {
    const user = getRandomElement(createdUsers);
    const product = getRandomElement(createdProducts);
    const status = getRandomElement(questionStatuses);
    const hasAnswer = status === 'ANSWERED';
    const createdAt = getRandomDate(
      new Date(Date.now() - 45 * 24 * 60 * 60 * 1000), // 45 days ago
      new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)   // 1 day ago
    );
    
    await prisma.question.create({
      data: {
        userId: user.id,
        productId: product.id,
        question: getRandomElement(sampleQuestions),
        answer: hasAnswer ? faker.lorem.paragraph() : null,
        status: status as any,
        createdAt,
        updatedAt: hasAnswer 
          ? new Date(createdAt.getTime() + Math.random() * 2 * 24 * 60 * 60 * 1000)
          : createdAt
      }
    });
  }
  
  // Create support tickets
  console.log('Creating support tickets...');
  
  const ticketStatuses = ['OPEN', 'PENDING', 'RESOLVED'];
  const ticketPriorities = ['LOW', 'MEDIUM', 'HIGH'];
  const ticketSubjects = [
    'Order not received',
    'Wrong item received',
    'Request for refund',
    'Product damaged during shipping',
    'Question about product ingredients',
    'Website technical issue',
    'Payment problem',
    'Product recommendation needed',
    'Account access issue',
    'Shipping delay inquiry'
  ];
  
  // Create 10-20 support tickets
  const ticketCount = getRandomNumber(10, 20);
  let ticketNumber = 1000;
  
  for (let i = 0; i < ticketCount; i++) {
    const user = getRandomElement(createdUsers);
    const status = getRandomElement(ticketStatuses);
    const priority = getRandomElement(ticketPriorities);
    const createdAt = getRandomDate(
      new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
      new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)   // 1 day ago
    );
    
    // 60% chance of being associated with an order
    const hasOrder = Math.random() > 0.4;
    let orderId = null;
    
    if (hasOrder) {
      const userOrders = await prisma.order.findMany({
        where: { userId: user.id },
        select: { id: true }
      });
      
      if (userOrders.length > 0) {
        orderId = getRandomElement(userOrders).id;
      }
    }
    
    const ticket = await prisma.supportTicket.create({
      data: {
        ticketNumber: `TICKET-${ticketNumber++}`,
        subject: getRandomElement(ticketSubjects),
        userId: user.id,
        customerName: `${user.firstName} ${user.lastName}`,
        customerEmail: user.email,
        status: status as any,
        priority: priority as any,
        orderId,
        createdAt,
        updatedAt: createdAt,
        resolvedAt: status === 'RESOLVED' 
          ? new Date(createdAt.getTime() + Math.random() * 5 * 24 * 60 * 60 * 1000)
          : null
      }
    });
    
    // Create ticket messages (1-5 messages per ticket)
    const messageCount = getRandomNumber(1, 5);
    
    for (let j = 0; j < messageCount; j++) {
      const isFirstMessage = j === 0;
      const senderType = isFirstMessage 
        ? 'CUSTOMER' 
        : Math.random() > 0.5 ? 'ADMIN' : 'CUSTOMER';
      
      const messageDate = new Date(
        createdAt.getTime() + j * Math.random() * 24 * 60 * 60 * 1000
      );
      
      await prisma.ticketMessage.create({
        data: {
          ticketId: ticket.id,
          content: faker.lorem.paragraph(),
          senderType: senderType as any,
          userId: senderType === 'CUSTOMER' ? user.id : null,
          adminId: senderType === 'ADMIN' ? null : null, // We're not creating admins
          createdAt: messageDate
        }
      });
    }
  }
  
  console.log('Database has successfully been populated with sample data');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });