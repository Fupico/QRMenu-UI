<template>
  <div class="all">
    <div class="register-container">
      <div class="register-box">
        <h2><b>Kayıt Ol</b></h2>
        <form @submit.prevent="onRegister">
          <div class="input-group">
            <i class="fas fa-user icon"></i>
            <input
              type="text"
              v-model="dataReqRegister.username"
              required
              placeholder="Kullanıcı Adı"
            />
          </div>
          <div class="input-group">
            <i class="fas fa-envelope icon"></i>
            <input
              type="email"
              v-model="dataReqRegister.email"
              required
              placeholder="E-posta"
            />
          </div>
          <div class="input-group">
            <i class="fas fa-lock icon"></i>
            <input
              type="password"
              v-model="dataReqRegister.password"
              required
              placeholder="Şifre"
            />
          </div>
          <button type="submit" class="btn-register">Kayıt Ol</button>
        </form>
        <button @click="goBack" class="btn-back">Geri</button>
        <br />
        <br />
        <FooterComponent />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useLoginApi } from "../composables/login";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar"; // Quasar kullanımı için import
const $q = useQuasar(); // $q değişkenini tanımlama
import FooterComponent from "../components/FooterComponent.vue";

const router = useRouter();
const { register } = useLoginApi();

const dataReqRegister = ref({
  username: "",
  email: "",
  password: "",
});

const onRegister = async () => {
  try {
    let result = await register(dataReqRegister.value);
    if (result.success) {
      $q.notify({
        type: "positive",
        message: "Kayıt başarılı! Lütfen giriş yapınız.",
      });
      router.replace("/login"); // Başarılı kayıttan sonra giriş sayfasına yönlendirme
    } else {
      $q.notify({
        type: "negative",
        message: result.errors[0] || "Bir hata oluştu!",
      });
    }
  } catch (error) {
    $q.notify({
      type: "negative",
      message: "Sunucuya bağlanırken bir hata oluştu!",
    });
  }
};

const goBack = () => {
  router.push("/login"); // Giriş sayfasına geri yönlendirme
};
</script>

<style scoped>
.all {
  margin: 0;
  padding: 0;
  font-family: "Arial", sans-serif;
  background-size: cover;
  background-position: center;
  height: 100vh;
}
.icon {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #3973a3;
  font-size: 18px;
}

.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: url("src/img/FuPiC.png") no-repeat center center; /* Görseli arka plan olarak ekledik */
  background-size: cover; /* Görselin sayfanın tamamını kaplamasını sağlarız */
  background-attachment: fixed; /* Görselin kaymasını engeller */
  padding: 60px 20px;
  text-align: center;
  min-height: 100vh; /* Sayfa yüksekliğini %100 viewport yüksekliğine ayarlıyoruz */
}

.register-box {
  background-color: rgba(255, 255, 255, 0.5); /* Beyaz rengin %80 opaklığı */
  padding: 40px;
  border-radius: 15px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.6);
  width: 550px;
  text-align: center;
}

h2 {
  color: #3973a3;
  margin-bottom: 20px;
  font-size: 28px;
}

.input-group {
  position: relative;
  margin-bottom: 20px;
}

.input-group input {
  width: 100%;
  padding: 12px 40px;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  font-size: 16px;
  transition: border-color 0.3s;
}

.input-group input:focus {
  border-color: #a2c71c;
  outline: none;
}
.btn-register {
  background-color: #4da339;
  color: white;
  padding: 12px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  width: 100%;
  transition: background-color 0.3s, transform 0.2s;
}

.btn-register:hover {
  background-color: #a2c71c;
  transform: scale(1.05);
}

.btn-back {
  margin-top: 10px;
  background-color: #d14242;
  color: white;
  padding: 10px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  width: 100%;
  transition: background-color 0.3s, transform 0.2s;
}

.btn-back:hover {
  background-color: #c12e2e;
  transform: scale(1.05);
}
</style>
