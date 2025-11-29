export default defineNuxtRouteMiddleware((to, from) => {
  if (to.path === "/login") return;

  if (process.client) {
    const currentUser = localStorage.getItem("currentUser");
    if (!currentUser) {
      return navigateTo("/login");
    }
  }
});
