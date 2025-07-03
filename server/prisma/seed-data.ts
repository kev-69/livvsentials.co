import { PrismaClient, UserRole, OrderStatus, ReviewStatus, PaymentMethod, PaymentStatus } from '@prisma/client';
import { faker } from '@faker-js/faker';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// Helper function to generate a random date within a specified range
function randomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

// Helper function to generate a unique slug
function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');
}

// Helper function to generate a random order number
function generateOrderNumber(): string {
  return `ORD-${Date.now().toString().slice(-8)}-${Math.floor(Math.random() * 1000)}`;
}

// Helper function to generate product images
function generateProductImages(gender: 'men' | 'women'): string[] {
  const imageCount = faker.number.int({ min: 4, max: 6 });
  const images = [];
  
  for (let i = 0; i < imageCount; i++) {
    // Using Lorem Picsum for realistic fashion images
    const width = 800;
    const height = 1000;
    const categoryId = gender === 'men' ? 1 : 2;
    const imageId = faker.number.int({ min: 1, max: 100 });
    
    images.push(`https://picsum.photos/id/${imageId + i}/${width}/${height}`);
  }
  
  return images;
}

async function main() {
  console.log('Starting seed process...');
  
  // Create categories
  const categories = [
    {
      name: 'Women\'s Clothing',
      slug: 'womens-clothing',
      description: 'Stylish and trendy clothing for women including dresses, tops, jeans, and more.'
    },
    {
      name: 'Men\'s Clothing',
      slug: 'mens-clothing',
      description: 'Contemporary and classic clothing for men including shirts, trousers, jackets, and more.'
    },
    {
      name: 'Accessories',
      slug: 'accessories',
      description: 'Complete your look with our range of accessories including bags, jewelry, and hats.'
    }
  ];
  
  console.log('Creating categories...');
  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category
    });
  }
  
  // Fetch created categories for reference
  const createdCategories = await prisma.category.findMany();
  
  // Women's clothing items
  const womenClothingItems = [
    {
      name: 'Floral Summer Dress',
      price: 59.99,
      salePrice: 49.99,
      description: 'A beautiful floral dress perfect for summer days. Made with lightweight fabric for comfort and style.',
      stockQuantity: faker.number.int({ min: 10, max: 100 }),
      categoryId: createdCategories.find(c => c.slug === 'womens-clothing')!.id
    },
    {
      name: 'Slim Fit Jeans',
      price: 79.99,
      salePrice: null,
      description: 'Classic slim fit jeans with a comfortable stretch. Perfect for any casual occasion.',
      stockQuantity: faker.number.int({ min: 10, max: 100 }),
      categoryId: createdCategories.find(c => c.slug === 'womens-clothing')!.id
    },
    {
      name: 'Elegant Blouse',
      price: 45.99,
      salePrice: 39.99,
      description: 'An elegant blouse with delicate details. Perfect for office wear or evening outings.',
      stockQuantity: faker.number.int({ min: 10, max: 100 }),
      categoryId: createdCategories.find(c => c.slug === 'womens-clothing')!.id
    },
    {
      name: 'Knit Sweater',
      price: 69.99,
      salePrice: null,
      description: 'A cozy knit sweater perfect for colder days. Made with high-quality yarn for warmth and comfort.',
      stockQuantity: faker.number.int({ min: 10, max: 100 }),
      categoryId: createdCategories.find(c => c.slug === 'womens-clothing')!.id
    },
    {
      name: 'High Waist Skirt',
      price: 54.99,
      salePrice: 44.99,
      description: 'A stylish high waist skirt that flatters any figure. Perfect for both casual and formal occasions.',
      stockQuantity: faker.number.int({ min: 10, max: 100 }),
      categoryId: createdCategories.find(c => c.slug === 'womens-clothing')!.id
    },
    {
      name: 'Cargo Pants',
      price: 64.99,
      salePrice: null,
      description: 'Trendy cargo pants with multiple pockets. Perfect for a casual, effortless look.',
      stockQuantity: faker.number.int({ min: 10, max: 100 }),
      categoryId: createdCategories.find(c => c.slug === 'womens-clothing')!.id
    },
    {
      name: 'Casual T-Shirt',
      price: 29.99,
      salePrice: 24.99,
      description: 'A comfortable casual t-shirt made from 100% cotton. Perfect for everyday wear.',
      stockQuantity: faker.number.int({ min: 10, max: 100 }),
      categoryId: createdCategories.find(c => c.slug === 'womens-clothing')!.id
    },
  ];
  
  // Men's clothing items
  const menClothingItems = [
    {
      name: 'Classic Oxford Shirt',
      price: 69.99,
      salePrice: 59.99,
      description: 'A timeless Oxford shirt perfect for both casual and formal occasions. Made with premium cotton for comfort and durability.',
      stockQuantity: faker.number.int({ min: 10, max: 100 }),
      categoryId: createdCategories.find(c => c.slug === 'mens-clothing')!.id
    },
    {
      name: 'Slim Fit Chinos',
      price: 74.99,
      salePrice: null,
      description: 'Classic slim fit chinos with a modern cut. Versatile and comfortable for everyday wear.',
      stockQuantity: faker.number.int({ min: 10, max: 100 }),
      categoryId: createdCategories.find(c => c.slug === 'mens-clothing')!.id
    },
    {
      name: 'Casual Polo Shirt',
      price: 49.99,
      salePrice: 39.99,
      description: 'A stylish polo shirt perfect for casual outings. Made with breathable fabric for all-day comfort.',
      stockQuantity: faker.number.int({ min: 10, max: 100 }),
      categoryId: createdCategories.find(c => c.slug === 'mens-clothing')!.id
    },
    {
      name: 'Denim Jacket',
      price: 89.99,
      salePrice: null,
      description: 'A classic denim jacket that never goes out of style. Perfect for layering in any season.',
      stockQuantity: faker.number.int({ min: 10, max: 100 }),
      categoryId: createdCategories.find(c => c.slug === 'mens-clothing')!.id
    },
    {
      name: 'Cotton Sweater',
      price: 59.99,
      salePrice: 49.99,
      description: 'A lightweight cotton sweater perfect for cooler evenings. Comfortable and stylish.',
      stockQuantity: faker.number.int({ min: 10, max: 100 }),
      categoryId: createdCategories.find(c => c.slug === 'mens-clothing')!.id
    },
    {
      name: 'Tailored Blazer',
      price: 129.99,
      salePrice: null,
      description: 'A sophisticated tailored blazer for a sharp look. Perfect for formal occasions or business meetings.',
      stockQuantity: faker.number.int({ min: 10, max: 100 }),
      categoryId: createdCategories.find(c => c.slug === 'mens-clothing')!.id
    },
    {
      name: 'Graphic T-Shirt',
      price: 34.99,
      salePrice: 29.99,
      description: 'A trendy graphic t-shirt with unique design. Made with soft cotton for everyday comfort.',
      stockQuantity: faker.number.int({ min: 10, max: 100 }),
      categoryId: createdCategories.find(c => c.slug === 'mens-clothing')!.id
    },
  ];
  
  // Accessory items
  const accessoryItems = [
    {
      name: 'Leather Handbag',
      price: 119.99,
      salePrice: 99.99,
      description: 'A stylish leather handbag with multiple compartments. Perfect for carrying all your essentials in style.',
      stockQuantity: faker.number.int({ min: 10, max: 50 }),
      categoryId: createdCategories.find(c => c.slug === 'accessories')!.id
    },
    {
      name: 'Silver Necklace',
      price: 79.99,
      salePrice: null,
      description: 'An elegant silver necklace that adds a touch of sophistication to any outfit.',
      stockQuantity: faker.number.int({ min: 10, max: 50 }),
      categoryId: createdCategories.find(c => c.slug === 'accessories')!.id
    },
    {
      name: 'Leather Belt',
      price: 49.99,
      salePrice: 39.99,
      description: 'A classic leather belt with a sleek buckle. Perfect for completing your look.',
      stockQuantity: faker.number.int({ min: 10, max: 50 }),
      categoryId: createdCategories.find(c => c.slug === 'accessories')!.id
    },
    {
      name: 'Sun Hat',
      price: 39.99,
      salePrice: null,
      description: 'A stylish and practical sun hat, perfect for sunny days and beach outings.',
      stockQuantity: faker.number.int({ min: 10, max: 50 }),
      categoryId: createdCategories.find(c => c.slug === 'accessories')!.id
    },
    {
      name: 'Silk Scarf',
      price: 59.99,
      salePrice: 49.99,
      description: 'A luxurious silk scarf with a beautiful print. Adds elegance to any outfit.',
      stockQuantity: faker.number.int({ min: 10, max: 50 }),
      categoryId: createdCategories.find(c => c.slug === 'accessories')!.id
    },
    {
      name: 'Leather Wallet',
      price: 69.99,
      salePrice: null,
      description: 'A practical leather wallet with multiple card slots and a coin pocket.',
      stockQuantity: faker.number.int({ min: 10, max: 50 }),
      categoryId: createdCategories.find(c => c.slug === 'accessories')!.id
    },
  ];
  
  // Combine all product items
  const allProductItems = [...womenClothingItems, ...menClothingItems, ...accessoryItems];
  
  // Create products
  console.log('Creating products...');
  const createdProducts = [];
  
  for (const item of allProductItems) {
    const slug = generateSlug(item.name);
    const gender = item.categoryId === createdCategories.find(c => c.slug === 'womens-clothing')!.id ? 'women' : 'men';
    
    const product = await prisma.product.create({
      data: {
        name: item.name,
        slug,
        price: item.price,
        salePrice: item.salePrice,
        description: item.description,
        stockQuantity: item.stockQuantity,
        inStock: item.stockQuantity > 0,
        productImages: generateProductImages(gender),
        categoryId: item.categoryId
      }
    });
    
    createdProducts.push(product);
  }
  
  // Create users
  console.log('Creating users...');
  const users = [];
  const defaultPassword = await bcrypt.hash('Password123', 10);
  
  for (let i = 0; i < 10; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const email = faker.internet.email({ firstName, lastName }).toLowerCase();
    
    const user = await prisma.user.create({
      data: {
        email,
        password: defaultPassword,
        firstName,
        lastName,
        role: UserRole.USER,
        phone: faker.phone.number(),
      }
    });
    
    users.push(user);
  }
  
  // Create addresses for each user
  console.log('Creating user addresses...');
  for (const user of users) {
    const addressCount = faker.number.int({ min: 1, max: 3 });
    
    for (let i = 0; i < addressCount; i++) {
      await prisma.userAddress.create({
        data: {
          fullName: `${user.firstName} ${user.lastName}`,
          streetName: faker.location.streetAddress(),
          city: faker.location.city(),
          postalCode: faker.location.zipCode(),
          region: faker.location.state(),
          phone: faker.phone.number(),
          isDefault: i === 0, // First address is default
          userId: user.id
        }
      });
    }
  }
  
  // Create carts for each user
  console.log('Creating user carts...');
  for (const user of users) {
    const cart = await prisma.cart.create({
      data: {
        userId: user.id
      }
    });
    
    // Add 1-5 items to cart
    const itemCount = faker.number.int({ min: 1, max: 5 });
    const selectedProducts = faker.helpers.arrayElements(createdProducts, itemCount);
    
    for (const product of selectedProducts) {
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId: product.id,
          quantity: faker.number.int({ min: 1, max: 3 })
        }
      });
    }
  }
  
  // Create wishlists for each user
  console.log('Creating user wishlists...');
  for (const user of users) {
    const wishlistCount = faker.number.int({ min: 3, max: 8 });
    const selectedProducts = faker.helpers.arrayElements(createdProducts, wishlistCount);
    
    for (const product of selectedProducts) {
      await prisma.wishlist.create({
        data: {
          userId: user.id,
          productId: product.id
        }
      });
    }
  }
  
  // Create orders for each user (spanning last 3 months)
  console.log('Creating user orders...');
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
  
  for (const user of users) {
    const orderCount = faker.number.int({ min: 1, max: 5 });
    
    for (let i = 0; i < orderCount; i++) {
      // Get a random address for this user
      const userAddresses = await prisma.userAddress.findMany({
        where: { userId: user.id }
      });
      const randomAddress = faker.helpers.arrayElement(userAddresses);
      
      // Create order
      const orderDate = randomDate(threeMonthsAgo, new Date());
      const orderProductCount = faker.number.int({ min: 1, max: 4 });
      const orderProducts = faker.helpers.arrayElements(createdProducts, orderProductCount);
      
      // Calculate total based on order items
      let totalAmount = 0;
      const orderItems = [];
      
      for (const product of orderProducts) {
        const quantity = faker.number.int({ min: 1, max: 3 });
        const price = product.salePrice || product.price;
        totalAmount += price * quantity;
        
        orderItems.push({
          productId: product.id,
          quantity,
          price
        });
      }
      
      // Determine order status based on date
      let orderStatus: OrderStatus;
      const daysSinceOrder = Math.floor((new Date().getTime() - orderDate.getTime()) / (1000 * 3600 * 24));
      
      if (daysSinceOrder < 2) {
        orderStatus = OrderStatus.PROCESSING;
      } else if (daysSinceOrder < 5) {
        orderStatus = OrderStatus.SHIPPED;
      } else {
        orderStatus = OrderStatus.DELIVERED;
      }
      
      // Randomly cancel some orders
      if (faker.number.int({ min: 1, max: 10 }) === 1) {
        orderStatus = OrderStatus.CANCELLED;
      }
      
      // Format shipping address
      const shippingAddress = JSON.stringify({
        fullName: randomAddress.fullName,
        streetName: randomAddress.streetName,
        city: randomAddress.city,
        postalCode: randomAddress.postalCode,
        region: randomAddress.region,
        phone: randomAddress.phone
      });
      
      const order = await prisma.order.create({
        data: {
          orderNumber: generateOrderNumber(),
          userId: user.id,
          totalAmount,
          orderStatus,
          shippingAddress,
          guestCheckout: false,
          createdAt: orderDate,
          updatedAt: orderDate,
          products: {
            connect: orderProducts.map(p => ({ id: p.id }))
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
      await prisma.payment.create({
        data: {
          orderId: order.id,
          amount: totalAmount,
          transactionId: `TXN-${Date.now()}-${faker.number.int({ min: 1000, max: 9999 })}`,
          paymentMethod: faker.helpers.arrayElement([PaymentMethod.CREDIT_CARD, PaymentMethod.MOBILE_MONEY]),
          paymentStatus: orderStatus === OrderStatus.CANCELLED
            ? PaymentStatus.CANCELLED 
            : PaymentStatus.COMPLETED
        }
      });
      
      // Create reviews for delivered orders
      if (orderStatus === OrderStatus.DELIVERED) {
        // Add reviews for some products in the order
        for (const item of orderItems) {
          if (faker.number.int({ min: 1, max: 2 }) === 1) { // 50% chance to add review
            await prisma.review.create({
              data: {
                userId: user.id,
                productId: item.productId,
                rating: faker.number.int({ min: 3, max: 5 }),
                title: faker.lorem.sentence({ min: 3, max: 8 }),
                content: faker.lorem.paragraphs({ min: 1, max: 3 }),
                images: faker.number.int({ min: 1, max: 10 }) > 8 ? generateProductImages('women').slice(0, 2) : [],
                status: ReviewStatus.PUBLISHED
              }
            });
          }
        }
      }
    }
  }
  
  // Create guest orders
  console.log('Creating guest orders...');
  for (let i = 0; i < 5; i++) {
    const orderDate = randomDate(threeMonthsAgo, new Date());
    const orderProductCount = faker.number.int({ min: 1, max: 3 });
    const orderProducts = faker.helpers.arrayElements(createdProducts, orderProductCount);
    
    // Calculate total based on order items
    let totalAmount = 0;
    const orderItems = [];
    
    for (const product of orderProducts) {
      const quantity = faker.number.int({ min: 1, max: 2 });
      const price = product.salePrice || product.price;
      totalAmount += price * quantity;
      
      orderItems.push({
        productId: product.id,
        quantity,
        price
      });
    }
    
    // Determine order status based on date
    let orderStatus: OrderStatus;
    const daysSinceOrder = Math.floor((new Date().getTime() - orderDate.getTime()) / (1000 * 3600 * 24));
    
    if (daysSinceOrder < 2) {
      orderStatus = OrderStatus.PROCESSING;
    } else if (daysSinceOrder < 5) {
      orderStatus = OrderStatus.SHIPPED;
    } else {
      orderStatus = OrderStatus.DELIVERED;
    }
    
    // Format shipping address for guest
    const guestFirstName = faker.person.firstName();
    const guestLastName = faker.person.lastName();
    
    const shippingAddress = JSON.stringify({
      fullName: `${guestFirstName} ${guestLastName}`,
      streetName: faker.location.streetAddress(),
      city: faker.location.city(),
      postalCode: faker.location.zipCode(),
      region: faker.location.state(),
      phone: faker.phone.number()
    });
    
    // Create a random user for guest checkout
    const randomUser = faker.helpers.arrayElement(users);
    
    const order = await prisma.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        userId: randomUser.id, // We need a user ID for the relation
        totalAmount,
        orderStatus,
        shippingAddress,
        guestCheckout: true, // Mark as guest checkout
        createdAt: orderDate,
        updatedAt: orderDate,
        products: {
          connect: orderProducts.map(p => ({ id: p.id }))
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
    await prisma.payment.create({
      data: {
        orderId: order.id,
        amount: totalAmount,
        transactionId: `TXN-${Date.now()}-${faker.number.int({ min: 1000, max: 9999 })}`,
        paymentMethod: faker.helpers.arrayElement([PaymentMethod.CREDIT_CARD, PaymentMethod.MOBILE_MONEY]),
        paymentStatus: OrderStatus.CANCELLED === 'CANCELLED'
          ? PaymentStatus.CANCELLED 
          : PaymentStatus.COMPLETED
      }
    });
  }
  
  console.log('Seed completed successfully!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });