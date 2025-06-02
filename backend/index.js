require('dotenv').config();

const port = process.env.PORT || 4000;
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const cloudinary = require('./config/cloudinary');

// Google OAuth2 Client Configuration
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Brevo Configuration
const Sib = require('sib-api-v3-sdk');
const defaultClient = Sib.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.BREVO_API_KEY;
const tranEmailApi = new Sib.TransactionalEmailsApi();

app.use(express.json());
app.use(cors());

// Database connection for MongoDB.
mongoose.connect(process.env.MONGODB_KEY)

// Middleware for handling file (image) uploads.
const storage = multer.memoryStorage();
const upload = multer({ storage });
app.use('/images', express.static('upload/images'));
app.post('/upload', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No file uploaded."
            });
        }

        // Convert buffer to base64
        const b64 = Buffer.from(req.file.buffer).toString('base64');
        const dataURI = `data:${req.file.mimetype};base64,${b64}`;

        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(dataURI, {
            folder: 'crochetnbeads/products',
            resource_type: 'auto',
            transformation: [
                { quality: 'auto:good' },
                { fetch_format: 'auto' }
            ]
        });

        res.json({
            success: true,
            image_url: result.secure_url,
            public_id: result.public_id
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({
            success: false,
            message: "Error uploading file",
            error: error.message
        });
    }
});

// Schematic for the product.
const Product = mongoose.model('Product', {
    id: {
        type: Number,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    included: {
        type: String,
        required: false
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    available: {
        type: Boolean,
        default: true,
        required: true
    }
});

// Google Login API
app.post('/api/auth/google', async (req, res) => {
    const { token } = req.body;

    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: '333456998423-mtova3q2qf82ro8dbf5biscofttttkjm.apps.googleusercontent.com',
        });

        const payload = ticket.getPayload();
        const { email, name } = payload;

        // Check if the user already exists
        let user = await Users.findOne({ email });

        if (!user) {
            user = new Users({
                username: name,
                email: email,
                password: 'GOOGLE_AUTH', // placeholder; not used for login
                cartData: {}
            });
            await user.save();
        }

        const jwtToken = jwt.sign({ user: { id: user._id } }, process.env.JWT_SECRET);
        res.status(200).json({
            success: true,
            token: jwtToken,
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });

    } catch (error) {
        console.error('Google Login Error:', error);
        res.status(401).json({
            success: false,
            message: 'Invalid Google token'
        });
    }
});

// API to add products.
app.post('/addproduct', async (req, res) => {
    try {
        let products = await Product.find({});
        let id = products.length > 0 ? products[products.length - 1].id + 1 : 1;

        const product = new Product({
            id: id,
            name: req.body.name,
            image: req.body.image,
            category: req.body.category,
            included: req.body.included,
            description: req.body.description,
            price: req.body.price
        });

        console.log('Attempting to save product:', product);

        const savedProduct = await product.save();
        console.log('Product saved successfully:', savedProduct);

        res.status(200).json({ 
            success: true,
            message: 'Product added successfully!',
            product: savedProduct 
        });

    } catch (error) {
        console.error('Error adding product:', error);
        res.status(500).json({ 
            success: false,
            message: 'Failed to add product.',
            error: error.message 
        });
    }
});

// API to edit products.
app.post('/editproduct', async (req, res) => {
    try {
        const { id, name, image, category, included, description, price } = req.body;

        const existingProduct = await Product.findOne({ id:id });

        if (!existingProduct) {
            return res.status(404).json({
                success: false,
                message: 'Product not found.'
            });
        }

        const updatedProduct = await Product.findOneAndUpdate(
            { id: id },
            {
                name,
                image,
                category,
                included,
                description,
                price,
                date : Date.now()
            },
            { new: true }
        );

        console.log('Product saved successfully:', updatedProduct);

        res.status(200).json({ 
            success: true,
            message: 'Product successfully edited!',
            product: updatedProduct 
        });

    } catch (error) {
        console.error('Error editing product:', error);
        res.status(500).json({ 
            success: false,
            message: 'Failed to edit product.',
            error: error.message 
        });
    }
});

// API to delete products.
app.post('/removeproduct', async (req, res) => {
    await Product.findOneAndDelete({ id: req.body.id });
    console.log("Removed product with id: " + req.body.id);
    res.status(200).json({message: 'Product removed successfully!'});
})

// API to get all products.
app.get('/allproducts', async (req, res) => {
    try {
        // For admin panel, return all products
        if (req.query.isAdmin === 'true') {
            let products = await Product.find({});
            return res.status(200).json(products);
        }
        
        // For market/shop, return only available products
        let products = await Product.find({ available: { $ne: false } });
        console.log('Fetched products:', products.length);
        res.status(200).json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch products'
        });
    }
});

// Schematic for creating the user model.
const Users = mongoose.model('Users', {
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    cartData: {
        type: Object,
        default: {}
    },
    date: {
        type: Date,
        default: Date.now
    }
});

// Endpoint for user registration.
app.post('/signup', async (req, res) => {
    try {
        let check = await Users.findOne({email: req.body.email});
        if (check) {
            return res.status(400).json({
                success: false,
                message: 'Email already exists!'
            });
        }

        const user = new Users({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            cartData: {}
        });

        const savedUser = await user.save();
        
        const token = jwt.sign(
            { user: { id: savedUser._id } }, process.env.JWT_SECRET
        );

        res.status(200).json({
            success: true,
            token,
            user: {
                id: savedUser._id,
                username: savedUser.username,
                email: savedUser.email
            }
        });

    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Endpoint for user login.
app.post('/login', async (req, res) => {
    let user = await Users.findOne({email: req.body.email});
    if (user) {
        const passwordCompare = req.body.password === user.password;
        if (passwordCompare) {
            const data = {
                user: {
                    id: user.id
                }
            };
            const token = jwt.sign(data, process.env.JWT_SECRET,);
            res.json({success: true, token});
        }
        else {
            res.status(400).json({success: false, message: 'Invalid password!'});
        }
    }
    else {
        res.status(400).json({success: false, message: 'User not found!'});
    }
});

app.delete('/deleteuser/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        const result = await Users.findByIdAndDelete(userId);
        
        if (!result) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            message: 'User deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting user'
        });
    }
});

// Endpoint for getting the new products available.
app.get('/newproducts', async (req, res) => {
    let products = await Product.find({});
    let newProducts = products.slice(1).slice(-8);
    console.log('New products:', newProducts);
    res.send(newProducts);
});

// Endpoint for getting the plushies.
app.get('/plushies', async (req, res) => {
    let products = await Product.find({category: 'plushies'});
    let plushies = products.slice(0, 4);
    console.log('List of plushies:', plushies);
    res.send(plushies);
});

// Endpoint for getting the apparel.
app.get('/apparel', async (req, res) => {
    let products = await Product.find({category: 'apparel'});
    let apparel = products.slice(0, 4);
    console.log('List of apparel:', apparel);
    res.send(apparel);
});

// Endpoint for getting the bouquets.
app.get('/bouquets', async (req, res) => {
    let products = await Product.find({category: 'bouquets'});
    let bouquets = products.slice(0, 4);
    console.log('List of bouquets:', bouquets);
    res.send(bouquets);
});

// Endpoint for getting the jewelry.
app.get('/jewelry', async (req, res) => {
    let products = await Product.find({category: 'jewelry'});
    let jewelry = products.slice(0, 4);
    console.log('List of jewelry:', jewelry);
    res.send(jewelry);
});

// Endpoint for getting related products by category and excluding a specific ID.
app.get('/relatedproducts', async (req, res) => {
    try {
        const category = req.query.category;
        const excludeId = parseInt(req.query.excludeId);

        if (!category) {
            return res.status(400).json({ success: false, message: "Category is required." });
        }

        const products = await Product.find({ category: category });
        const related = products.filter(product => product.id !== excludeId);

        res.status(200).json(related);
    } catch (error) {
        console.error("Error fetching related products:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch related products",
            error: error.message
        });
    }
});

// Middleware for checking the token and fetching the user.
const fetchUser = (req, res, next) => {
    const token = req.header('token');
    if (!token) {
        return res.status(401).json({success: false, message: 'Authorization token not found!'});
    }
    else {
        try {
            const data = jwt.verify(token, process.env.JWT_SECRET);
            req.user = data.user;
            next();
        } catch (error) {
            res.status(401).json({success: false, message: 'Invalid token!'});
        };
    };
};

// Get all users (for admin dashboard)
app.get('/allusers', async (req, res) => {
    try {
        const users = await Users.find({}, 'username email date');
        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to fetch users' 
        });
    }
});

// Endpoint for adding products in the cart data.
app.post('/addtocart', fetchUser, async (req, res) => {
    console.log('User #:', req.user, ', has added an item with ID:', req.body.itemId );
    let userData = await Users.findOne({_id:req.user.id});
    
    // Initialize cart item if undefined
    if (!userData.cartData[req.body.itemId]) {
        userData.cartData[req.body.itemId] = 0;
    }

    userData.cartData[req.body.itemId] += 1;
    await Users.findOneAndUpdate({_id:req.user.id}, {cartData:userData.cartData});
    
    res.status(200).json({
        success: true,
        message: 'Item added to cart.'
    });
});


// Endpoint for deleting products in the cart data.
app.post('/deletefromcart', fetchUser, async (req, res) => {
    console.log('User #:', req.user, ', has removed an item with ID:', req.body.itemId );
    let userData = await Users.findOne({_id:req.user.id});

    if (userData.cartData[req.body.itemId] > 0) {
        userData.cartData[req.body.itemId] -= 1;
    }

    await Users.findOneAndUpdate({_id:req.user.id}, {cartData:userData.cartData});
    
    res.status(200).json({
        success: true,
        message: 'Item removed from cart.'
    });
});

// Endpoint for cart data when logged in.
app.post('/getcart', fetchUser, async (req, res) => {
    let userData = await Users.findOne({_id:req.user.id});
    res.json(userData.cartData);
});

// Schematic for the order details.
const Order = mongoose.model('Order', {
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    items: [{
        productId: Number,
        name: String,
        quantity: Number,
        price: Number
    }],
    deliveryMethod: {
        type: String,
        required: true,
        enum: ['Pickup at Al Wahda Mall', 'Doorstep Delivery']
    },
    phoneNumber: {
        type: String,
        required: true
    },
    address: String,
    subtotal: Number,
    shippingFee: Number,
    total: Number,
    orderDate: {
        type: Date,
        default: Date.now
    },
    notes: {
        type: String,
        default: ''
    }
});

app.post('/create-order', fetchUser, async (req, res) => {
    try {
        console.log('Creating order for user:', req.user.id);
        const user = await Users.findOne({_id: req.user.id});
        if (!user) {
            console.log('User not found:', req.user.id);
            return res.status(401).json({
                success: false,
                message: 'User not found'
            });
        }

        console.log('Found user:', user.email);

        // Create and save order
        const order = new Order({
            userId: user._id,
            items: req.body.items,
            deliveryMethod: req.body.deliveryMethod,
            phoneNumber: req.body.phoneNumber,
            address: req.body.address,
            subtotal: req.body.subtotal,
            shippingFee: req.body.shippingFee,
            total: req.body.total,
            notes: req.body.notes
        });

        const savedOrder = await order.save();
        console.log('Order saved:', savedOrder._id);

        try {
            console.log('Attempting to send email to:', user.email);
            const sender = {
                email: 'crochet.n.beadsbymina@gmail.com',
                name: "crochet n' beads!"
            };
            
            const receivers = [{
                email: user.email
            }];

            const itemsList = order.items.map(item => `
                <tr style="border-bottom: 1px solid #FAF2ED;">
                    <td style="padding: 12px;">
                        <span style="color: #4A202A; font-weight: 500; font-size: 14px;">${item.name}</span>
                    </td>
                    <td style="padding: 12px; text-align: center; color: #4A202A; vertical-align: middle; font-size: 14px;">${item.quantity}</td>
                    <td style="padding: 12px; text-align: center; color: #4A202A; vertical-align: middle; font-size: 14px;">${item.price} AED</td>
                    <td style="padding: 12px; text-align: center; color: #4A202A; font-weight: 500; vertical-align: middle; font-size: 14px;">
                        ${item.quantity * item.price} AED
                    </td>
                </tr>
            `).join('');

            const emailResult = await tranEmailApi.sendTransacEmail({
                sender,
                to: receivers,
                subject: `Order Confirmation #${savedOrder._id}`,
                htmlContent: `
                    <div style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #DDC3B5; font-size: 14px; border-radius: 8px">
                        <div style="text-align: center; padding: 20px 0; border-bottom: 2px solid #FAF2ED;">
                            <h1 style="color: #4A202A; margin: 0; font-size: 28px;">Order Confirmed</h1>
                            <p style="color: #4A202A; margin: 10px 0 0; font-size: 16px;">Thank you for shopping with crochet n' beads!</p>
                        </div>

                        <div style="background-color: #FAF2ED; padding: 15px; border-radius: 8px; margin: 20px 0;">
                            <h2 style="color: #4A202A; margin: 0; font-size: 20px;">Your order number is #${savedOrder._id}.</h2>
                            <p style="color: #4A202A; margin: 5px 0; font-size: 14px;">Order Date: ${new Date().toLocaleDateString('en-US', { 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric' 
                            })}</p>
                        </div>

                        <div style="margin: 30px 0;">
                            <table style="width: 100%; border-collapse: collapse;">
                                <thead>
                                    <tr style="background-color: #DDC3B5;">
                                        <th style="padding: 12px; text-align: left; color: #4A202A; font-size: 16px;">Product</th>
                                        <th style="padding: 12px; text-align: center; color: #4A202A; font-size: 16px;">Quantity</th>
                                        <th style="padding: 12px; text-align: center; color: #4A202A; font-size: 16px;">Price</th>
                                        <th style="padding: 12px; text-align: center; color: #4A202A; font-size: 16px;">Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${itemsList}
                                </tbody>
                            </table>
                        </div>

                        <div style="background-color: #FAF2ED; padding: 20px; border-radius: 8px;">
                            <h3 style="color: #4A202A; margin: 0 0 15px; font-size: 16px;">Contact and Delivery Information</h3>
                            <div style="margin-bottom: 10px;">
                                <strong style="color: #4A202A;">Delivery Method: </strong>
                                <span style="color: black;">${order.deliveryMethod}</span>
                            </div>
                            ${order.address ? `
                            <div style="margin-bottom: 10px;">
                                <strong style="color: #4A202A;">Delivery Address: </strong>
                                <span style="color: black;">${order.address}</span>
                            </div>` : ''}
                            <div>
                                <strong style="color: #4A202A;">Phone Number: </strong>
                                <span style="color: black;">${order.phoneNumber}</span>
                            </div>
                        </div>
                        
                        ${order.notes ? `
                        <div style="background-color: #FAF2ED; padding: 20px; border-radius: 8px; margin: 20px 0;">
                            <h3 style="color: #4A202A; margin: 0 0 15px; font-size: 16px;">Additional Notes</h3>
                            <p style="color: black; margin: 0; white-space: pre-wrap;">${order.notes}</p>
                        </div>
                        ` : ''}

                        <div style="background-color: #FAF2ED; padding: 20px; border-radius: 8px; margin: 20px 0;">
                            <h3 style="color: #4A202A; margin: 0 0 15px; font-size: 16px;">Cost Breakdown</h3>
                            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                                <span style="color: #4A202A; font-size: 14px;">Subtotal:</span>
                                <span style="color: #4A202A; font-size: 14px;"> ${order.subtotal} AED</span>
                            </div>
                            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                                <span style="color: #4A202A; font-size: 14px;">Shipping Fee:</span>
                                <span style="color: black;"> ${order.shippingFee} AED</span>
                            </div>
                            <div style="display: flex; justify-content: space-between; padding-top: 10px; border-top: 1px solid #4A202A;">
                                <span style="color: #4A202A; font-weight: bold; font-size: 14px;">Total:</span>
                                <span style="color: black; font-weight: bold; font-size: 14px;"> ${order.total} AED</span>
                            </div>
                        </div>

                        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 2px solid #FAF2ED;">
                            <p style="color: #4A202A; margin-bottom: 10px; font-size: 16px;">Thank you for shopping at crochet n' beads!</p>
                            <p style="color: #4A202A; font-size: 16px;">Please contact me on @crochet.n.beads in Instagram or email me at <strong>crochet.n.beadsbymina@gmail.com</strong> for any further inquiries regarding your order!</p>
                        </div>
                    </div>
                `
            });

            console.log('Email sent successfully:', emailResult);

        } catch (emailError) {
            console.error('Failed to send email:', emailError);
        }

        // Clear the cart
        await Users.findOneAndUpdate(
            {_id: req.user.id},
            {cartData: {}}
        );

        res.status(200).json({
            success: true,
            message: 'Order created successfully.',
            orderId: savedOrder._id
        });

    } catch (error) {
        console.error('Order creation error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create order.',
            error: error.message
        });
    }
});

// Patch for available products.
app.patch('/toggle-availability/:id', async (req, res) => {
    try {
        const productId = parseInt(req.params.id);
        console.log('Toggling availability for product:', productId);

        const product = await Product.findOne({ id: productId });
        
        if (!product) {
            console.log('Product not found:', productId);
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        // Toggle the availability
        product.available = !product.available;
        await product.save();
        console.log('Updated product availability:', product.id, product.available);

        res.json({
            success: true,
            message: `Product ${product.available ? 'enabled' : 'disabled'}`,
            product: product
        });

    } catch (error) {
        console.error('Toggle error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating availability',
            error: error.message
        });
    }
});

app.delete('/delete-order/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await Order.findByIdAndDelete(id);
        
        if (!result) {
            return res.status(404).json({ message: 'Order not found' });
        }
        
        res.json({ message: 'Order deleted successfully' });
    } catch (error) {
        console.error('Error deleting order:', error);
        res.status(500).json({ message: 'Error deleting order' });
    }
});

// Endpoint to fetch all orders (for admin dashboard).
app.get('/all-orders', async (req, res) => {
    try {
        const orders = await Order.find().sort({ orderDate: -1 });
        res.json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ message: 'Error fetching orders' });
    }
});

// API Creation
app.get('/', (req, res) => {
    res.send('Express app is running!');
});

app.listen(port, (error) => {
    if (error) {
        console.error('Error starting the server:', error);
    } else {
        console.log(`Server is running on port ${port}.`);
    }
});