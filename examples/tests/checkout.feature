Feature: Checkout

  @spec:checkout/place-an-order/cart-with-items
  Scenario: Cart with items
    Given a cart with 2 items
    When the customer confirms the order
    Then an order with 2 items exists
    And the customer sees the order number
