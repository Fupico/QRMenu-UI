<template>
  <div class="all" translate="no" lang="tr">
    <div class="login-container">
      <div class="login-box">
        <h2><b>Admin Paneli</b></h2>
        <form @submit.prevent="onSubmit">
          <div class="input-group">
            <i class="fas fa-user icon"></i>
            <input
              type="text"
              v-model="dataReqlogin.username"
              required
              placeholder="Kullanıcı Adı"
            />
          </div>
          <div class="input-group">
            <i class="fas fa-lock icon"></i>
            <input
              type="password"
              v-model="dataReqlogin.password"
              required
              placeholder="Şifre"
            />
          </div>
          <button type="submit" class="btn-login">Giriş Yap</button>
        </form>
        <div class="action-buttons">
          <button @click="goToRegister" class="btn-register">Kayıt Ol</button>
          <button @click="goToForgetPassword" class="btn-forgetpassword">
            Şifremi Unuttum
          </button>
        </div>
        <br />
        <FooterComponent />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar"; // Quasar özelliklerini kullanmak için import
import { useLoginApi } from "../composables/login";
import FooterComponent from "../components/FooterComponent.vue";

const $q = useQuasar(); // $q değişkenini tanımlıyoruz

const { login } = useLoginApi();
const router = useRouter();

const dataReqlogin = ref({
  username: "",
  password: "",
});

const onSubmit = async () => {
  const result = await login(dataReqlogin.value);
  if (result.success) {
    $q.notify({
      type: "positive",
      message: "Giriş başarılı!",
    });
  } else {
    $q.notify({
      type: "negative",
      message: result.errors[0] || "Bir hata oluştu!",
    });
  }
};

const goToRegister = () => {
  router.push("/register");
};
</script>

<style scoped>
.action-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
}

.btn-register,
.btn-forgetpassword {
  width: 48%; /* %50 genişlikten biraz az */
  padding: 10px;
  height: 50px; /* Yükseklik aynı */
  border-radius: 10px;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;
}

.btn-register {
  background-color: #08d112;
  color: white;
}

.btn-register:hover {
  background-color: #01fd01;
  transform: scale(1.05);
}

.btn-forgetpassword {
  background-color: #ff7300;
  color: white;
  font-size: small;
}

.btn-forgetpassword:hover {
  background-color: #ff8f33;
  transform: scale(1.05);
}

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
  left: 10px; /* İkonun inputun içinde uygun bir pozisyonda olmasını sağlamak için */
  top: 50%;
  transform: translateY(-50%);
  color: #3973a3; /* İkon rengi */
  font-size: 18px; /* İkon boyutu */
}

.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: url("/images/FuPiC.png") no-repeat center center; /* Görseli arka plan olarak ekledik */
  background-size: cover; /* Görselin sayfanın tamamını kaplamasını sağlarız */
  background-attachment: fixed; /* Görselin kaymasını engeller */
  padding: 60px 20px;
  text-align: center;
  min-height: 100vh; /* Sayfa yüksekliğini %100 viewport yüksekliğine ayarlıyoruz */
}

.login-box {
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
.btn-login {
  background-color: #1558d4;
  color: white;
  padding: 12px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  width: 100%;
  transition: background-color 0.3s, transform 0.2s;
}

.btn-login:hover {
  background-color: #0075fc;
  transform: scale(1.05);
}
</style>
