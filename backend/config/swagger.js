const swaggerSpec = {
  openapi: '3.0.3',
  info: {
    title: 'CampusBite – University Cafeteria Management API',
    version: '1.0.0',
    description:
      'REST API documentation for CampusBite (CSE 3206 Software Engineering Sessional, RUET). Supports JWT authentication, Food Management, Discount Strategy calculation, and Cash on Pickup Order Management.'
  },
  servers: [
    {
      url: 'http://localhost:5000',
      description: 'Local Development Server'
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    },
    schemas: {
      User: {
        type: 'object',
        properties: {
          id: { type: 'string', example: '665f1a2b3c4d5e6f7a8b9c0d' },
          name: { type: 'string', example: 'Rahim Ahmed' },
          email: { type: 'string', example: 'rahim@student.ruet.ac.bd' },
          role: { type: 'string', enum: ['student', 'admin'], example: 'student' }
        }
      },
      Food: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '665f1a2b3c4d5e6f7a8b9c0e' },
          name: { type: 'string', example: 'Chicken Burger' },
          description: { type: 'string', example: 'Grilled chicken patty with lettuce.' },
          category: {
            type: 'string',
            enum: ['Snacks', 'Drinks', 'Fast Food', 'Desserts'],
            example: 'Fast Food'
          },
          price: { type: 'number', example: 150 },
          stock: { type: 'integer', example: 20 },
          image: { type: 'string', example: '/images/fast-food.svg' },
          isAvailable: { type: 'boolean', example: true }
        }
      },
      Order: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '665f1a2b3c4d5e6f7a8b9c10' },
          orderCode: { type: 'string', example: 'CB-842190-4312' },
          userId: { type: 'string', example: '665f1a2b3c4d5e6f7a8b9c0d' },
          items: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                foodId: { type: 'string' },
                name: { type: 'string', example: 'Chips' },
                price: { type: 'number', example: 30 },
                quantity: { type: 'integer', example: 1 }
              }
            }
          },
          subtotal: { type: 'number', example: 180 },
          discount: { type: 'number', example: 30 },
          total: { type: 'number', example: 150 },
          promotionName: {
            type: 'string',
            example: 'Snack Trio Combo (Chips + Cake + Juice = ৳150)'
          },
          paymentMethod: { type: 'string', example: 'Cash on Pickup' },
          paymentStatus: { type: 'string', enum: ['Pending', 'Paid'], example: 'Pending' },
          status: {
            type: 'string',
            enum: ['Pending', 'Preparing', 'Ready', 'Completed', 'Cancelled'],
            example: 'Pending'
          }
        }
      }
    }
  },
  paths: {
    '/api/auth/register': {
      post: {
        tags: ['Authentication'],
        summary: 'Register a new student account',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'email', 'password'],
                properties: {
                  name: { type: 'string', example: 'Tanvir Hasan' },
                  email: { type: 'string', example: 'tanvir@student.ruet.ac.bd' },
                  password: { type: 'string', example: 'Password@123' }
                }
              }
            }
          }
        },
        responses: {
          201: { description: 'Student registered successfully' },
          400: { description: 'Validation error' },
          409: { description: 'Email already registered' }
        }
      }
    },
    '/api/auth/login': {
      post: {
        tags: ['Authentication'],
        summary: 'Login as student or admin',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string', example: 'rahim@student.ruet.ac.bd' },
                  password: { type: 'string', example: 'Password@123' }
                }
              }
            }
          }
        },
        responses: {
          200: { description: 'Login successful, returns JWT token and user info' },
          401: { description: 'Invalid credentials' }
        }
      }
    },
    '/api/auth/me': {
      get: {
        tags: ['Authentication'],
        summary: 'Get currently authenticated user profile',
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Current user object' },
          401: { description: 'Unauthorized' }
        }
      }
    },
    '/api/foods': {
      get: {
        tags: ['Foods'],
        summary: 'List all food items with optional search/category filter',
        parameters: [
          { name: 'search', in: 'query', schema: { type: 'string' }, description: 'Search by name' },
          {
            name: 'category',
            in: 'query',
            schema: { type: 'string', enum: ['All', 'Snacks', 'Drinks', 'Fast Food', 'Desserts'] }
          },
          { name: 'available', in: 'query', schema: { type: 'boolean' } }
        ],
        responses: {
          200: { description: 'Array of food items' }
        }
      },
      post: {
        tags: ['Foods'],
        summary: 'Create a new food item (Admin only)',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'category', 'price', 'stock'],
                properties: {
                  name: { type: 'string', example: 'Vegetable Sandwich' },
                  description: { type: 'string', example: 'Toasted bread with fresh veggies.' },
                  category: { type: 'string', example: 'Snacks' },
                  price: { type: 'number', example: 60 },
                  stock: { type: 'integer', example: 25 },
                  image: { type: 'string', example: '/images/snacks.svg' }
                }
              }
            }
          }
        },
        responses: {
          201: { description: 'Food item created' },
          400: { description: 'Validation error' },
          403: { description: 'Admin access required' }
        }
      }
    },
    '/api/foods/{id}': {
      get: {
        tags: ['Foods'],
        summary: 'Get a single food item by ID',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Food item details' },
          404: { description: 'Food not found' }
        }
      },
      put: {
        tags: ['Foods'],
        summary: 'Update a food item (Admin only)',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  price: { type: 'number', example: 65 },
                  stock: { type: 'integer', example: 30 },
                  isAvailable: { type: 'boolean', example: true }
                }
              }
            }
          }
        },
        responses: {
          200: { description: 'Food updated' },
          403: { description: 'Admin access required' },
          404: { description: 'Food not found' }
        }
      },
      delete: {
        tags: ['Foods'],
        summary: 'Delete a food item (Admin only)',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Food deleted' },
          403: { description: 'Admin access required' },
          404: { description: 'Food not found' }
        }
      }
    },
    '/api/orders/preview': {
      post: {
        tags: ['Orders'],
        summary: 'Preview subtotal and best non-combinable discount for cart items',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  items: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        name: { type: 'string', example: 'Chips' },
                        price: { type: 'number', example: 30 },
                        quantity: { type: 'integer', example: 1 }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        responses: {
          200: { description: 'Discount breakdown (subtotal, discount, total, promotionName)' }
        }
      }
    },
    '/api/orders': {
      post: {
        tags: ['Orders'],
        summary: 'Place a new Cash on Pickup order (Student/Admin)',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['items'],
                properties: {
                  items: {
                    type: 'array',
                    items: {
                      type: 'object',
                      required: ['foodId', 'quantity'],
                      properties: {
                        foodId: { type: 'string', example: '665f1a2b3c4d5e6f7a8b9c0e' },
                        quantity: { type: 'integer', example: 2 }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        responses: {
          201: { description: 'Order created and stock deducted' },
          400: { description: 'Insufficient stock or invalid cart' },
          401: { description: 'Unauthorized' }
        }
      },
      get: {
        tags: ['Orders'],
        summary: 'List all orders (Admin only)',
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'List of all orders' },
          403: { description: 'Admin access required' }
        }
      }
    },
    '/api/orders/my': {
      get: {
        tags: ['Orders'],
        summary: 'Get logged-in student order history',
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'List of user orders' },
          401: { description: 'Unauthorized' }
        }
      }
    },
    '/api/orders/notifications': {
      get: {
        tags: ['Orders'],
        summary: 'Get order status notifications for logged-in student (Observer pattern)',
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'List of status change notifications' }
        }
      }
    },
    '/api/orders/{id}': {
      get: {
        tags: ['Orders'],
        summary: 'Get order details by ID (Owner or Admin only)',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Order receipt details' },
          403: { description: 'Forbidden' },
          404: { description: 'Order not found' }
        }
      }
    },
    '/api/orders/{id}/status': {
      patch: {
        tags: ['Orders'],
        summary: 'Update order status or payment status (Admin only)',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  status: {
                    type: 'string',
                    enum: ['Pending', 'Preparing', 'Ready', 'Completed', 'Cancelled'],
                    example: 'Preparing'
                  },
                  paymentStatus: {
                    type: 'string',
                    enum: ['Pending', 'Paid'],
                    example: 'Paid'
                  }
                }
              }
            }
          }
        },
        responses: {
          200: { description: 'Order updated and student observer notified' },
          400: { description: 'Invalid status transition' },
          403: { description: 'Admin access required' }
        }
      }
    },
    '/api/orders/{id}/cancel': {
      patch: {
        tags: ['Orders'],
        summary: 'Cancel a Pending order and restore stock (Owner or Admin)',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Order cancelled and stock restored' },
          400: { description: 'Only Pending orders can be cancelled' },
          403: { description: 'Forbidden' }
        }
      }
    }
  }
};

module.exports = swaggerSpec;
