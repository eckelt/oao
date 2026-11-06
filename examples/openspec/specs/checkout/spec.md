# checkout Specification

## Purpose

Customers order the items in their cart without calling. Checkout confirms the order and tells the customer what happens next.

## Requirements

### Requirement: Place an order
The storefront SHALL create an order from the cart when the customer confirms it, and SHALL show the order number.

#### Scenario: Cart with items
- **WHEN** a customer with two items in the cart confirms the order
- **THEN** an order with both items exists
- **AND** the customer sees its order number

#### Scenario: Empty cart
- **WHEN** a customer with an empty cart opens checkout
- **THEN** no order is created
- **AND** the customer is sent back to the cart

### Requirement: Confirmation mail
The shop SHALL send a confirmation mail within five minutes of a placed order.

#### Scenario: Order placed
- **WHEN** an order is placed
- **THEN** the customer receives one confirmation mail with the order number
