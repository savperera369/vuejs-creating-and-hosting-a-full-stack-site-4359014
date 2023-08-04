<template>
  <div v-if="product">
    <div class="img-wrap">
      <img :src="product.imageUrl" />
    </div>
    <div class="product-details">
      <h1>{{ product.name }}</h1>
      <h3 class="price">{{ product.price }}</h3>
      <button @click="addToCart" class="add-to-cart" v-if="user && !itemIsInCart">Add to Cart</button>
      <button class="grey-button" v-if="user && itemIsInCart">Item is already in cart</button>
      <button class="sign-in" @click="signIn" v-if="!user">Sign in to add to cart</button>
    </div>
  </div>
  <div v-if="!product">
    <NotFoundPage />
  </div>
  
</template>

<script>
import axios from 'axios';
import { getAuth, sendSignInLinkToEmail, isSignInWithEmailLink, signInWithEmailLink} from 'firebase/auth';
import NotFoundPage from '@/pages/NotFoundPage.vue';
export default {
  name: "ProductDetailPage",
  props: ['user'],
  // what data component has access to
  data () {
    return {
      product: {},
      cartItems: [],
    }
  },
  methods: {
    async addToCart() {
      // request body is given in form of a JS object
      await axios.post('/api/users/12345/cart', {id: this.$route.params.productId});
      alert('Successfully added item to cart');
    }, 
    async signIn(){
      const email = prompt("Please enter your email to sign in: ");
      // reference to firebase auth object
      const auth = getAuth();
      // settings object that tells firebase auth how to redirect the user
      const actionCodeSettings = {
        // this is the url we want to redirect the user back to when they log in
        url: `http://localhost:8080/products/${this.$route.params.productId}`,
        handleCodeInApp: true,
      }
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      alert("Check your email!");
      // store the users email that they gave us for later so that we can use it to sign in when the user clicks the link
      window.localStorage.setItem('emailForSignIn', email);
    }
  },
  components: {
    NotFoundPage
  },
  // add a watch for when the user changes
  watch: {
    async user(newUserValue){
      if (newUserValue){
        const cartResponse = await axios.get(`/api/users/${newUserValue.uid}/cart`);
        const cartItems = cartResponse.data;
        this.cartItems = cartItems;
      }
    }
  },
  computed: {
    itemIsInCart(){
      return this.cartItems.some(item => item.id === this.$route.params.productId);
    }
  },
  async created(){
    // add logic to check to see if the url indicates that the user got to this page using an email link
    const auth = getAuth();
    if (isSignInWithEmailLink(auth, window.location.href)){
      const email = window.localStorage.getItem('emailForSignIn');
      await signInWithEmailLink(auth, email, window.location.href);
      alert('Successfully signed in!');
      window.localStorage.removeItem('emailForSignIn');
    }
    const response = await axios.get(`/api/products/${this.$route.params.productId}`);
    const product = response.data;
    this.product = product;

    if (this.user){
      const cartResponse = await axios.get(`/api/users/${this.user.uid}/cart`);
      const cartItems = cartResponse.data;
      this.cartItems = cartItems;
    }
  }
};
</script>