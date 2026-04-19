const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product'); 

dotenv.config();

const products = [
    // ELECTRONICS
    { name: 'Professional DSLR Camera', price: 1200, category: 'Electronics', image: 'https://images.pexels.com/photos/51011/pexels-photo-51011.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
    { name: 'Smartphone Pro Max', price: 999, category: 'Electronics', image: 'https://images.pexels.com/photos/404280/pexels-photo-404280.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
    { name: 'Wireless Noise Cancelling Headphones', price: 350, category: 'Electronics', image: 'https://images.pexels.com/photos/3394651/pexels-photo-3394651.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
    { name: 'Ultra-Slim Laptop M3', price: 1400, category: 'Electronics', image: 'https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
    { name: 'Smartwatch Series X', price: 399, category: 'Electronics', image: 'https://images.pexels.com/photos/267394/pexels-photo-267394.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
    { name: 'Gaming Console 4K', price: 499, category: 'Electronics', image: 'https://images.pexels.com/photos/4523000/pexels-photo-4523000.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
    { name: 'Portable Bluetooth Speaker', price: 120, category: 'Electronics', image: 'https://images.pexels.com/photos/1034653/pexels-photo-1034653.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
    { name: 'Graphic Drawing Tablet', price: 250, category: 'Electronics', image: 'https://images.pexels.com/photos/3124111/pexels-photo-3124111.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
    { name: 'Mechanical RGB Keyboard', price: 150, category: 'Electronics', image: 'https://images.pexels.com/photos/1779487/pexels-photo-1779487.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
    { name: '4K Computer Monitor', price: 450, category: 'Electronics', image: 'https://images.pexels.com/photos/1029757/pexels-photo-1029757.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },

    // CLOTHING
    { name: 'Classic Leather Jacket', price: 200, category: 'Clothing', image: 'https://images.pexels.com/photos/1124466/pexels-photo-1124466.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
    { name: 'Running Performance Shoes', price: 130, category: 'Clothing', image: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
    { name: 'Casual Denim Jeans', price: 60, category: 'Clothing', image: 'https://images.pexels.com/photos/1082529/pexels-photo-1082529.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
    { name: 'Winter Woolen Coat', price: 180, category: 'Clothing', image: 'https://images.pexels.com/photos/1040424/pexels-photo-1040424.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
    { name: 'Men’s Formal Suit', price: 350, category: 'Clothing', image: 'https://images.pexels.com/photos/1342609/pexels-photo-1342609.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
    { name: 'Designer Handbag', price: 500, category: 'Clothing', image: 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
    { name: 'Sportswear Hoodie', price: 75, category: 'Clothing', image: 'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
    { name: 'Sunglasses UV Protect', price: 90, category: 'Accessories', image: 'https://images.pexels.com/photos/46710/pexels-photo-46710.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },

    // HOME & FURNITURE
    { name: 'Modern Velvet Sofa', price: 899, category: 'Home', image: 'https://images.pexels.com/photos/1866149/pexels-photo-1866149.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
    { name: 'Wooden Coffee Table', price: 250, category: 'Home', image: 'https://images.pexels.com/photos/890669/pexels-photo-890669.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
    { name: 'Smart LED Lamp', price: 55, category: 'Home', image: 'https://images.pexels.com/photos/1112598/pexels-photo-1112598.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
    { name: 'Memory Foam Mattress', price: 600, category: 'Home', image: 'https://images.pexels.com/photos/775219/pexels-photo-775219.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
    { name: 'Dining Table Set', price: 1200, category: 'Home', image: 'https://images.pexels.com/photos/932095/pexels-photo-932095.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },

    // SPORTS & BABY
    { name: 'Adjustable Dumbbell Set', price: 299, category: 'Sports', image: 'https://images.pexels.com/photos/949126/pexels-photo-949126.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
    { name: 'Yoga Mat Premium', price: 45, category: 'Sports', image: 'https://images.pexels.com/photos/3759657/pexels-photo-3759657.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
    { name: 'Baby Stroller Comfort', price: 320, category: 'Baby', image: 'https://images.pexels.com/photos/196441/pexels-photo-196441.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
    { name: 'Baby High Chair', price: 110, category: 'Baby', image: 'https://images.pexels.com/photos/3933238/pexels-photo-3933238.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' }
];

// Replicate these items to reach 50+ (using variations or loops)
const finalProducts = [...products];
for (let i = 1; i <= 25; i++) {
    finalProducts.push({
        ...products[i % products.length],
        name: products[i % products.length].name + " (Special Edition " + i + ")",
        _id: new mongoose.Types.ObjectId() // Generate fresh IDs
    });
}

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        await Product.deleteMany();
        await Product.insertMany(finalProducts);
        console.log(`✅ Success: Seeded ${finalProducts.length} items with WORKING images!`);
        process.exit();
    } catch (err) {
        console.error("❌ Seed Error:", err);
        process.exit(1);
    }
};

seedDB();