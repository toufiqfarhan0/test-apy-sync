# API Specification

Welcome to the REST API specification for test-apy-sync.

---

## Users API

### GET /api/users
Retrieve a list of registered users.

**Request Query Parameters:**
- `status` (string, optional): Filter users by status (`active`, `pending`, `suspended`).

**Responses:**
- `200 OK`: Returns an array of user objects `[{ id, name, email }]`.

---

### GET /api/users/:id
Retrieve a specific user profile by their unique ID.

**Path Parameters:**
- `id` (string, required): User UUID.

**Responses:**
- `200 OK`: Returns the user details.

---

### POST /api/users
Create a new user account in the system.

**Request Body:**
- `name` (string, required): Full name of the user.
- `email` (string, required): Valid user email address.

**Responses:**
- `201 Created`: User successfully registered.
- `400 Bad Request`: Validation failure.

---

## Authentication API

### POST /api/auth/login
Authenticate an existing user and generate an access token.

**Request Body:**
- `email` (string, required): User account email.
- `password` (string, required): Account password.

**Responses:**
- `200 OK`: Returns `{ token, user }`.
- `401 Unauthorized`: Invalid credentials.

---

### POST /api/auth/register
Register a brand new account and create an initial organization.

**Request Body:**
- `email` (string, required): Email address.
- `password` (string, required): Password string.
- `organizationName` (string, required): Company or team name.

**Responses:**
- `201 Created`: Organization and user account created.
- `400 Bad Request`: Missing fields.

---

## Products API

### GET /api/products
List all available products in the catalog.

**Request Query Parameters:**
None.

**Responses:**
- `200 OK`: List of product records.

---

### GET /api/products/:id
Retrieve product details by product ID.

**Path Parameters:**
- `id` (string, required): Product ID.

**Responses:**
- `200 OK`: Product record.
- `404 Not Found`: Product does not exist.

---

### POST /api/products
Publish a new product to the catalog.

**Request Body:**
- `title` (string, required): Product title.
- `price` (number, required): Price in cents.

**Responses:**
- `201 Created`: Product created successfully.
- `400 Bad Request`: Validation failed.

---

### PUT /api/products/:id
Update an existing product's details.

**Path Parameters:**
- `id` (string, required): Product ID.

**Request Body:**
- `title` (string, optional): Updated title.
- `price` (number, optional): Updated price in cents.

**Responses:**
- `200 OK`: Product updated.

---

## Orders API

### GET /api/orders
Retrieve orders placed by the authenticated customer.

**Responses:**
- `200 OK`: List of customer orders.

---

### POST /api/orders
Submit a new checkout order.

**Request Body:**
- `items` (array, required): Array of items with productId and quantity.
- `totalAmount` (number, required): Order total in cents.

**Responses:**
- `200 OK`: Order placed successfully.
- `400 Bad Request`: Invalid items array.

---

### GET /api/orders/:id
Retrieve order details and invoice.

**Path Parameters:**
- `id` (string, required): Order ID.

**Responses:**
- `200 OK`: Order summary.
- `404 Not Found`: Order not found.

---

## Payments API

### POST /api/payments/checkout
Initialize a checkout payment session.

**Request Body:**
- `orderId` (string, required): ID of the order being paid.
- `amount` (number, required): Amount to charge in cents.

**Responses:**
- `200 OK`: Returns `{ clientSecret, paymentId }`.
- `400 Bad Request`: Invalid order or charge amount.

---

## Webhooks API

### POST /api/webhooks/stripe
Receive payment processing events from Stripe.

**Headers:**
- `stripe-signature` (string, required): Webhook signature.

**Responses:**
- `200 OK`: Event processed.

---

## Teams API

### GET /api/teams
List teams belonging to the authenticated account.

**Responses:**
- `200 OK`: Array of teams.

---

### POST /api/teams
Create a new team.

**Request Body:**
- `name` (string, required): Name of the team.

**Responses:**
- `201 Created`: Team created.

---

## Notifications API

### GET /api/notifications
List notifications for the current user.

**Responses:**
- `200 OK`: Array of notifications.

---

## Analytics API

### GET /api/analytics/summary
Retrieve high-level business analytics.

**Responses:**
- `200 OK`: Metrics summary.
