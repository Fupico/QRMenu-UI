<template>
  <footer class="footer">
    <div class="footer-content">
      <a href="/" class="footer-link"> © {{ currentYear }} FuPiCo </a>
    </div>
  </footer>
</template>

<script lang="ts">
import { computed } from "vue";
export default {
  name: "FooterComponent",
  setup() {
    const currentYear = computed(() => new Date().getFullYear());
    return { currentYear };
  },
};
</script>

<style scoped>
.footer {
  display: flex;

  justify-content: center;
  align-items: center;
  background-color: rgba(70, 84, 148, 0.8);
  padding: 8px 12px;
  border-top: 2px solid #22d3ff;
  color: #f0f0f0;
  font-family: "Poppins", sans-serif;
  box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.2);
  bottom: 0;
  width: 100%;
}

.footer-content {
  text-align: center;
  max-width: 600px;
}

.footer-link {
  color: #5692ca;
  text-decoration: none;
  font-size: 12px;
  font-weight: 600;
  transition: color 0.3s ease;
}

.footer-link:hover {
  color: #ffffff;
}
</style>
