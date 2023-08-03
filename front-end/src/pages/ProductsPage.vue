<template>
  <h1>Products</h1>
  <ProductsList :products="products" />
</template>

<script>
import axios from 'axios';
import ProductsList from '../components/ProductsList.vue'
export default {
  name: "ProductsPage",
  components: {
    ProductsList,
  },
  data() {
    return {
      products: [], 
    }
  },
  async created () {
    // axios.get is going to return a response object that will be able to get all the products from
    const response = await axios.get('/api/products');
    // get the response body
    const products = response.data;
    // setting this components products data to the data we got back from the server 
    this.products = products;
  }
};
</script>