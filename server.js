import express from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: '*' }));
app.use(express.json());

// In-memory storage
let products = [];
let customers = [];
let orders = [];

/* ============================
   ROOT
============================ */
app.get('/', (req, res) => {
  res.json({ message: 'Online Store API is running ✅' });
});

/* ============================
   PRODUCTS CRUD
============================ */

// GET all products
app.get('/products', (req, res) => {
  res.json(products);
});

// GET product by ID
app.get('/products/:id', (req, res) => {
  const product = products.find((p) => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }
  res.json(product);
});

// CREATE product
app.post('/products', (req, res) => {
  const { name, price, stock } = req.body;

  if (!name || price == null || stock == null) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const newProduct = {
    id: uuidv4(),
    name,
    price,
    stock,
  };

  products.push(newProduct);
  res.status(201).json(newProduct);
});

// UPDATE product
app.put('/products/:id', (req, res) => {
  const product = products.find((p) => p.id === req.params.id);

  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }

  const { name, price, stock } = req.body;

  if (name) product.name = name;
  if (price != null) product.price = price;
  if (stock != null) product.stock = stock;

  res.json(product);
});

// DELETE product
app.delete('/products/:id', (req, res) => {
  const index = products.findIndex((p) => p.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ message: 'Product not found' });
  }

  products.splice(index, 1);
  res.json({ message: 'Product deleted successfully' });
});

/* ============================
   CUSTOMERS CRUD
============================ */

// GET all customers
app.get('/customers', (req, res) => {
  res.json(customers);
});

// CREATE customer
app.post('/customers', (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const newCustomer = {
    id: uuidv4(),
    name,
    email,
  };

  customers.push(newCustomer);
  res.status(201).json(newCustomer);
});

// DELETE customer
app.delete('/customers/:id', (req, res) => {
  const index = customers.findIndex((c) => c.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ message: 'Customer not found' });
  }

  customers.splice(index, 1);
  res.json({ message: 'Customer deleted successfully' });
});

/* ============================
   ORDERS
============================ */

// GET all orders
app.get('/orders', (req, res) => {
  res.json(orders);
});

// CREATE order
app.post('/orders', (req, res) => {
  const { customerId, productId, quantity } = req.body;

  const customer = customers.find((c) => c.id === customerId);
  const product = products.find((p) => p.id === productId);

  if (!customer || !product) {
    return res.status(400).json({ message: 'Invalid customer or product ID' });
  }

  if (product.stock < quantity) {
    return res.status(400).json({ message: 'Not enough stock available' });
  }

  product.stock -= quantity;

  const newOrder = {
    id: uuidv4(),
    customerId,
    productId,
    quantity,
  };

  orders.push(newOrder);
  res.status(201).json(newOrder);
});

// DELETE order
app.delete('/orders/:id', (req, res) => {
  const index = orders.findIndex((o) => o.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ message: 'Order not found' });
  }

  orders.splice(index, 1);
  res.json({ message: 'Order deleted successfully' });
});

/* ============================
   START SERVER
============================ */

app.listen(PORT, () => {
  console.log(`Store API running on port ${PORT}`);
});
