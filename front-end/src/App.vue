<template>
  <NavBar />
  <div class="page-wrap">
    <router-view :user="user"></router-view>
  </div>
</template>

<script>
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import NavBar from '@/components/NavBar.vue'
export default {
  name: "App",
  components: {
    NavBar,
  },
  data () {
    return {
      user: null,
    }
  },
  created () {
    const auth = getAuth();
    // user is null if user is logged out, or user data from firebase if user is logged in
    onAuthStateChanged(auth, user => {
      this.user = user;
    });
  }
};
</script>


