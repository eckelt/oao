// Tests name the scenario they prove. The generator reads the id; nobody maintains the link.
import { test } from "node:test";

test("spec:checkout/place-an-order/cart-with-items", async () => {
  // arrange two items, confirm, assert the order and the shown number
});

test("spec:checkout/place-an-order/empty-cart", async () => {
  // open checkout with an empty cart, assert redirect and no order
});

// checkout/confirmation-mail/order-placed has no test yet:
// the generator reports scenario-without-test for it.
