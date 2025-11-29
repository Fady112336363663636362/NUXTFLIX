<template>
  <div
    class="relative flex items-center justify-center min-h-screen bg-center bg-cover"
    style="background-image: url(&quot;/bg-login.jpg&quot;)"
  >
    <div class="w-full max-w-md p-8 space-y-6 rounded-lg shadow-lg bg-zinc-900">
      <h2 class="text-3xl font-bold text-center text-white">
        {{ isSignup ? "Sign Up" : "Login" }}
      </h2>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <!-- Email -->
        <div>
          <label
            for="email"
            class="block mb-1 text-sm font-medium text-gray-200"
            >Email</label
          >
          <input
            id="email"
            type="email"
            v-model="email"
            placeholder="Enter your email"
            class="w-full px-4 py-2 text-black rounded focus:outline-none focus:ring-2 focus:ring-red-600"
            required
          />
        </div>

        <!-- Password -->
        <div>
          <label
            for="password"
            class="block mb-1 text-sm font-medium text-gray-200"
            >Password</label
          >
          <input
            id="password"
            type="password"
            v-model="password"
            placeholder="Enter your password"
            class="w-full px-4 py-2 text-black rounded focus:outline-none focus:ring-2 focus:ring-red-600"
            required
          />
        </div>

        <!-- Confirm Password (for signup) -->
        <div v-if="isSignup">
          <label
            for="confirmPassword"
            class="block mb-1 text-sm font-medium text-gray-200"
            >Confirm Password</label
          >
          <input
            id="confirmPassword"
            type="password"
            v-model="confirmPassword"
            placeholder="Confirm password"
            class="w-full px-4 py-2 text-black rounded focus:outline-none focus:ring-2 focus:ring-red-600"
            required
          />
        </div>

        <!-- Error message -->
        <p v-if="errorMessage" class="text-sm text-red-500">
          {{ errorMessage }}
        </p>

        <!-- Submit button -->
        <button
          type="submit"
          class="w-full px-4 py-2 text-white transition bg-red-600 rounded hover:bg-red-700"
        >
          {{ isSignup ? "Sign Up" : "Login" }}
        </button>
      </form>

      <!-- Toggle link -->
      <p class="text-sm text-center text-gray-400">
        {{ isSignup ? "Already have an account?" : "Don't have an account?" }}
        <button @click="toggleMode" class="ml-1 text-red-600 hover:underline">
          {{ isSignup ? "Login" : "Sign Up" }}
        </button>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();


const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const errorMessage = ref("");
const isSignup = ref(false);

const toggleMode = () => {
  isSignup.value = !isSignup.value;
  errorMessage.value = "";
  email.value = "";
  password.value = "";
  confirmPassword.value = "";
};

const handleSubmit = () => {
  errorMessage.value = "";

  if (
    !email.value ||
    !password.value ||
    (isSignup.value && !confirmPassword.value)
  ) {
    errorMessage.value = "Please fill in all fields.";
    return;
  }

  if (isSignup.value) {
    if (password.value !== confirmPassword.value) {
      errorMessage.value = "Passwords don't match.";
      return;
    }

    const users = JSON.parse(localStorage.getItem("users") || "[]");
    if (users.find((u) => u.email === email.value)) {
      errorMessage.value = "Email already exists.";
      return;
    }
    users.push({ email: email.value, password: password.value });
    localStorage.setItem("users", JSON.stringify(users));
    alert("Account created successfully! You can login now.");
    toggleMode();
    return;
  }

  const users = JSON.parse(localStorage.getItem("users") || "[]");
  const user = users.find(
    (u) => u.email === email.value && u.password === password.value
  );
  if (!user) {
    errorMessage.value = "Invalid email or password.";
    return;
  }

  localStorage.setItem("currentUser", JSON.stringify(user));

  router.push("/");
};
</script>
