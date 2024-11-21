<template>
  <div class="contact-page">
    <div class="container">
      <!-- PWA Popup -->
      <div v-if="showPopup" class="pwa-popup">
        <p>Uygulamayı yüklemek ister misiniz?</p>
        <div class="popup-buttons">
          <button @click="installPWA" class="btn-popup-install">Yükle</button>
          <button @click="closePopup" class="btn-popup-close">Kapat</button>
        </div>
      </div>
      <!-- Hizmet Verdiğimiz Kafeler Başta -->
      <section class="cafes">
        <h2 class="cafes-title">Hizmet Verdiğimiz Kafeler</h2>
        <div class="cafes-list">
          <div
            class="cafe-card"
            @click="navigateToCafe('69a5662f-e37d-4012-8820-a3166a8f5807')"
          >
            <span class="cafe-name">BaristaTime</span>
          </div>

          <div class="cafe-card">
            <span
              class="cafe-name"
              @click="navigateToCafe('1f327e7a-0d39-404e-9fff-c6ff37deef00')"
              >Köşebaşı Cafe</span
            >
          </div>
        </div>
      </section>

      <!-- Biz Kimiz Başlık ve Metin -->
      <section class="about">
        <h2 class="page-title" style="color: white">
          Geleceğin Öncüleri Topluluğu
        </h2>

        <img
          src="images/fupico_logo.jpeg"
          alt="Fupico Logo"
          style="max-width: 300px"
        />

        <h5 class="page-title">Biz Kimiz?</h5>
        <q-card-section style="text-align: left">
          <p class="q-my-sm">
            🔵 Geleceğin Öncüleri Topluluğu olarak, teknoloji ve yenilik
            alanında en iyi çözümleri üretmek için çalışıyoruz.
          </p>
          <p class="q-my-sm">
            🔵 Amacımız, üyelerimizin sürekli öğrenme ve gelişme fırsatlarını
            desteklemek, bilgi paylaşımını ve işbirliğini teşvik etmektir.
          </p>
          <p class="q-my-sm">
            🔵 Eğitim ve uygulama süreçlerimizle, teknoloji dünyasına katkı
            sağlamayı hedefliyoruz.
          </p>
          <p class="q-my-sm">
            🔵 Teknoloji alanında yenilikçi projelerle geleceğe katkı
            sağlamaktır.
          </p>
          <p class="q-my-sm">
            🔵 Topluluğumuzdaki herkesin teknoloji ve yeniliklere ilgi duymasını
            ve bu alanlarda kendini geliştirmesini istiyoruz.
          </p>

          <p class="q-my-sm">
            🔵 Bilgi paylaşımı ve sürekli öğrenme kültürüyle, birlikte büyüyen
            ve gelişen bir topluluk oluşturmayı amaçlıyoruz.
          </p>
        </q-card-section>
      </section>
      <div class="action-buttons">
        <!-- Kayıt Ol Butonu -->
        <button @click="goToRegister" class="btn-register">Kayıt Ol</button>

        <!-- Giriş Yap Butonu -->
        <button @click="goToLogin" class="btn-login">Giriş Yap</button>
      </div>

      <!-- İletişim Bilgileri Kartı -->
      <section class="contact-info">
        <h5 class="info-title" style="color: tomato">İletişim Bilgilerimiz</h5>
        <p class="phone-text">
          <a href="tel:+905438194976" class="phone-icon" style="color: white">
            <i class="fa fa-phone"></i>
          </a>
        </p>

        <!-- Site Linki -->
        <p class="website-text">
          <i
            class="fa fa-globe"
            style="font-size: 24px; margin-right: 10px; color: white"
          ></i>
          <a href="https://fupico.com/faq" class="website-link"> fupico.com </a>
        </p>
      </section>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
const navigateToCafe = (menuId: string): void => {
  const url = `/menu/${menuId}`;
  window.location.href = url; // Yeni sayfaya yönlendirme
};
// Router tanımı
const router = useRouter();

// Yönlendirme Fonksiyonları
const goToRegister = () => {
  router.push("/register");
};

const goToLogin = () => {
  router.push("/login");
};

const goToForgetPassword = () => {
  router.push("/forget-password");
};

// PWA Popup ve Yükleme İşlemleri
const showPopup = ref(false);
const deferredPrompt = ref<Event | null>(null);

const installPWA = () => {
  if (deferredPrompt.value) {
    (deferredPrompt.value as any).prompt();
    (deferredPrompt.value as any).userChoice.then((choice: any) => {
      if (choice.outcome === "accepted") {
        console.log("PWA yükleme kabul edildi.");
      } else {
        console.log("PWA yükleme reddedildi.");
      }
      deferredPrompt.value = null;
      closePopup();
    });
  }
};

const closePopup = () => {
  showPopup.value = false;
};

onMounted(() => {
  // PWA için "beforeinstallprompt" olayını dinleme
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault(); // Varsayılan davranışı engelle
    deferredPrompt.value = e;
    showPopup.value = true;

    // Popup'ı 5 saniye sonra otomatik kapat
    setTimeout(() => {
      if (showPopup.value) closePopup();
    }, 5000);
  });
});

onBeforeUnmount(() => {
  // Event temizliği
  window.removeEventListener("beforeinstallprompt", () => {});
});
</script>

<style scoped>
.btn-login {
  background-color: #1558d4;
  color: white;
  padding: 12px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  width: 48%;
  transition: background-color 0.3s, transform 0.2s;
}

.btn-login:hover {
  background-color: #0075fc;
  transform: scale(1.05);
}
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

.website-text {
  font-size: 24px; /* Normal metin boyutu */
  font-weight: bold; /* Kalın metin */
  text-align: center; /* Ortalı */
  margin-top: 20px; /* Yukarıdan boşluk */
}

.website-link {
  color: #f3f3f3; /* Varsayılan metin rengi */
  text-decoration: none; /* Alt çizgiyi kaldır */
  transition: color 0.3s ease, transform 0.3s ease; /* Hover efekti için animasyon */
}

.website-link:hover {
  color: #ff9900; /* Hover sırasında renk değişimi */
  transform: scale(1.2); /* Yazıyı büyütme efekti */
}

.fa-globe {
  font-size: 32px; /* Daha büyük ikon */
  color: #003366; /* İkon rengi */
}

/* Genel Sayfa Stili */
.contact-page {
  font-family: "Poppins", sans-serif;
  position: relative; /* ::before için gerekli */
  padding: 60px 20px;
  text-align: center;
  color: #fff; /* Yazı rengi beyaz, görsel ile kontrast oluşturmak için */
  min-height: 100vh; /* Sayfa yüksekliğini %100 viewport yüksekliğine ayarlıyoruz */
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow: hidden; /* Taşan içeriği gizlemek için */
}

.contact-page::before {
  content: ""; /* Pseudo-element içeriği boş */
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: url("src/img/FuPiC.png") no-repeat center center;
  background-size: cover;
  opacity: 0.8; /* Şeffaflık seviyesi */
  z-index: -1; /* Arka planda tutmak için */
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

/* Hizmet Verdiğimiz Kafeler Bölümü */
.cafes {
  margin-bottom: 50px;
}

.cafes-title {
  font-size: 30px; /* Başlık boyutunu biraz küçülttüm */
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 20px;
}

.cafes-list {
  display: flex;
  justify-content: space-around;
  gap: 20px;
  flex-wrap: wrap;
}

.cafe-card {
  background-color: #003366;
  padding: 20px;
  width: 250px; /* Kart genişliğini ayarladım */
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.cafe-name {
  font-size: 20px;
  font-weight: 700;
  color: #ffffff;
  text-align: center;
  transition: color 0.3s ease;
}

.cafe-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
}

.cafe-card:hover .cafe-name {
  color: #5259b6; /* Hover efekti */
}

/* Başlık ve Biz Kimiz Bölümü */
.about {
  margin-bottom: 50px;
}

.page-title {
  font-size: 36px;
  font-weight: 700;
  color: #003366;
  margin-bottom: 20px;
}

.about-text {
  font-size: 18px;
  line-height: 1.6;
  color: #fff;
  margin: 0 auto;
  max-width: 800px;
  font-weight: 700;
}

/* İletişim Bilgileri Kartı */
.contact-info {
  margin-top: 30px;
  background-color: #15416d;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.info-title {
  font-size: 24px; /* Başlık boyutunu küçülttüm */
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 20px;
}

.phone-number {
  font-size: 20px; /* Numara boyutunu küçülttüm */
  font-weight: 700;
  color: #00e1ff;
  text-decoration: none;
  transition: color 0.3s ease;
}

.phone-text {
  text-align: center; /* Ortalanmış */
  margin-top: 20px;
}

.phone-icon {
  display: inline-block;
  font-size: 32px; /* Büyük ikon */
  color: white; /* Varsayılan ikon rengi */
  text-decoration: none; /* Alt çizgiyi kaldır */
  transition: color 0.3s ease, transform 0.3s ease; /* Hover efekti için animasyon */
}

.phone-icon:hover i {
  color: #ff9900; /* Hover sırasında renk değişimi */
  transform: scale(1.2); /* Hafif büyüme efekti */
  cursor: pointer; /* İşaretçi ikonu */
}
/* PWA Popup */
.pwa-popup {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 15px;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  max-width: 300px;
  text-align: center;
}

.popup-buttons {
  display: flex;
  justify-content: space-around;
  margin-top: 10px;
}

.btn-popup-install,
.btn-popup-close {
  background-color: #08d112;
  color: white;
  padding: 8px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s, transform 0.2s;
}

.btn-popup-close {
  background-color: #d41414;
}

.btn-popup-install:hover {
  background-color: #01a501;
  transform: scale(1.05);
}

.btn-popup-close:hover {
  background-color: #a50000;
  transform: scale(1.05);
}
</style>
