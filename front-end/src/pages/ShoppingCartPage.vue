<template>
  <h1>Shopping Cart</h1>
  <div v-if="cartItems.length>0">
      <ShoppingCartList @remove-from-cart="removeFromCart($event)" :products="cartItems" />
  </div>
  <div v-if="cartItems.length===0">
    <p>You have no items in your cart!</p>
  </div>
  <button class="checkout-button">Proceed to Checkout</button>
</template>

<script>
import axios from 'axios';
import ShoppingCartList from '@/components/ShoppingCartList.vue';
// v-for repeats the div for each product in the cardItem array
export default {
  name: "ShoppingCartPage",
  components: {
    ShoppingCartList
  },
  data () {
    return {
      cartItems: [],
    }
  },
  methods: {
    async removeFromCart(productId) {
      const response = await axios.delete(`/api/users/12345/cart/${productId}`);
      const updatedCart = response.data;
      this.cartItems = updatedCart;
    }
  },
  async created () {
    const response = await axios.get('/api/users/12345/cart');
    const cartItems = response.data;
    this.cartItems = cartItems;
  }
};
</script>