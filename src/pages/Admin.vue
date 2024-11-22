<template>
  <div translate="no" lang="tr">
    <q-tabs
      v-model="tab"
      inline-label
      switch-indicator
      class="bg-lime text-dark shadow-2 rounded-lg"
      @input="resetViewOnTabChange"
    >
      <q-tab name="companyInfo" icon="business" label="Anasayfa" />
      <q-tab name="edit" icon="edit" label="Menü Düzenleme" />
      <q-space />
      <q-btn
        flat
        round
        style="color: red"
        icon="logout"
        @click="confirmLogout"
      />
    </q-tabs>

    <q-tab-panels
      v-model="tab"
      animated
      transition-prev="fade-out"
      transition-next="fade-in"
    >
      <!-- Kurum Bilgileri Tabı -->
      <q-tab-panel name="companyInfo" class="q-pa-md full-width-panel">
        <!-- Kurum Bilgileri -->
        <q-card
          bordered
          flat
          class="q-pa-md text-center"
          style="max-width: 1200px; width: 100%; margin: 0 auto"
        >
          <!-- Resim Alanı -->
          <q-img
            @click="triggerFileInput"
            :src="
              previewUrl || companyDto.imageUrl || '/images/fupico_logo.jpeg'
            "
            alt="Company Logo"
            style="
              width: 100%;
              max-width: 800px;
              height: 100%; /* Yüksekliği %100 yaparak tam görünmesini sağlıyoruz */
              min-height: 400px; /* Minimum bir yükseklik belirliyoruz */
              object-fit: cover; /* Resmi boyutuna göre kesmeden orantılı bir şekilde doldur */
              margin: 0 auto;
              cursor: pointer;
            "
            v-if="previewUrl || companyDto.imageUrl"
          />

          <q-img
            src="/images/fupico_logo.jpeg"
            alt="Default Company Logo"
            contain
            ratio="1"
            style="max-width: 800px; margin: 0 auto; height: 100%; width: 100%"
            v-else
          />

          <!-- Gizli Dosya Seçici -->
          <input
            type="file"
            ref="fileInput"
            @change="onFileChange"
            accept="image/*"
            style="display: none"
          />

          <div
            class="info-container"
            style="
              width: 100%;
              max-width: 1000px;
              margin: 0 auto;
              text-align: center;
            "
          >
            <!-- Açıklama -->
            <a
              :href="companyDto.domain"
              target="_blank"
              style="margin-top: 15px; display: block; text-decoration: none"
            >
              <q-btn
                label="Menüye Git"
                outline
                class="q-py-md"
                style="width: 100%; font-size: larger"
              />
            </a>
            <!-- Linki Göster ve Kopyala -->
            <q-input
              v-model="fullMenuLink"
              label="Menü Linki"
              outlined
              dense
              readonly
              class="q-pa-md"
              style="margin-top: 10px; font-size: larger; width: 100%"
            >
              <!-- Append icon for copy function -->
              <template v-slot:append>
                <q-icon
                  name="content_copy"
                  @click="copyUrlLink"
                  style="cursor: pointer"
                />
              </template>
            </q-input>
            <!-- Kurum Adı -->
            <div class="text-h6 q-mb-xs" style="color: blue; margin-top: 15px">
              Kurum Adı
            </div>
            <q-input
              v-model="companyDto.name"
              label="Kurum Adı"
              outlined
              dense
              class="text-center"
              style="font-size: larger; width: 100%"
            />
          </div>

          <!-- Değişiklikleri Kaydet Butonu -->
          <q-btn
            v-if="isModified"
            label="Değişiklikleri Kaydet"
            color="primary"
            @click="saveChanges"
            class="q-mt-md"
            style="max-width: 1000px; margin: 0 auto"
          />
        </q-card>
      </q-tab-panel>

      <!-- Ürün Grupları Düzenleme Tabı -->
      <q-tab-panel name="edit" class="q-pa-md">
        <div class="text-center text-h6 q-mb-md">Ürün Yönetimi</div>

        <!-- Yeni Gıda Grubu Ekle Butonu -->
        <q-btn
          v-if="isFoodGroupVisible"
          label="Yeni Menü Grubu Ekle"
          color="primary"
          icon="add"
          @click="openAddMenuGroupDialog"
          class="q-mb-md"
        />
        <!-- Yeni Gıda Grubu Ekle Butonu -->
        <q-btn
          v-if="!isFoodGroupVisible"
          label="Menüye Yeni Ürün Ekle"
          color="primary"
          icon="add"
          @click="openAddMenuFoodDialog"
          class="q-mb-md"
        />
        <!-- Mevcut Ürün Grupları -->
        <div
          v-if="foodGroups.length > 0 && isFoodGroupVisible"
          class="row q-gutter-md justify-center"
          style="margin: 0 auto; max-width: 100%"
        >
          <!-- Food Group Cards (Zaten mevcut) -->
          <!-- ... -->
        </div>

        <!-- Geri dön butonu -->
        <q-btn
          v-if="!isFoodGroupVisible"
          label="Geri Dön"
          icon="arrow_back"
          color="primary"
          @click="showFoodGroups"
          class="q-mb-md"
        />

        <div class="q-pa-md edit-tab">
          <!-- Ürün Grupları -->
          <div
            v-if="foodGroups.length > 0 && isFoodGroupVisible"
            class="row q-gutter-md justify-center"
            style="margin: 0 auto; max-width: 100%"
          >
            <q-card
              v-for="(group, index) in foodGroups"
              :key="index"
              class="col-12 col-sm-6 col-md-3 col-lg-2 q-mb-md"
              bordered
              flat
            >
              <q-card-section>
                <q-img
                  :src="group.imageUrl"
                  @click="fetchFoods(group.foodGroupId)"
                  alt="Food Group Image"
                  contain
                  style="max-width: 100%"
                />
                <div class="text-h6 q-mt-md">{{ group.groupName }}</div>
                <div class="text-body1 text-grey-7">
                  {{ group.description || "Açıklama Yok" }}
                </div>
                <q-card-actions align="center">
                  <q-btn
                    flat
                    icon="edit"
                    color="primary"
                    size="lg"
                    @click="openUpdateFoodGroupDialog(group)"
                  >
                  </q-btn>
                  <q-btn
                    flat
                    icon="delete"
                    size="lg"
                    color="negative"
                    @click="confirmDeleteFoodGroup(group.foodGroupId)"
                  >
                  </q-btn>
                  <q-btn
                    flat
                    icon="visibility"
                    color="secondary"
                    size="lg"
                    @click="fetchFoods(group.foodGroupId)"
                  >
                    Ürünler
                  </q-btn>
                </q-card-actions>
              </q-card-section>
            </q-card>
          </div>
          <q-dialog
            v-model="isAddMenuGroupDialogOpen"
            persistent
            class="custom-dialog"
          >
            <q-card style="max-width: 800px; width: 100%">
              <q-card-section>
                <div class="text-h6">Yeni Menü Grubu Ekle</div>
              </q-card-section>

              <q-card-section>
                <q-input
                  v-model="newMenuGroup.groupName"
                  label="Grup Adı"
                  outlined
                />
                <q-input
                  v-model="newMenuGroup.description"
                  style="margin-top: 5px"
                  label="Açıklama"
                  outlined
                />

                <!-- Resim Yükleme ve Önizleme -->
                <q-img
                  :src="previewMenuGroupImageUrl || '/images/menu-img.png'"
                  alt="Preview Image"
                  contain
                  style="
                    width: 100%;
                    max-width: 300px;
                    font-size: 20px;
                    display: block;
                    margin: 24px auto;
                  "
                  @click="triggerMenuGroupFileInput"
                />

                <!-- Gizli Dosya Seçici -->
                <input
                  type="file"
                  ref="menuGroupFileInput"
                  @change="onMenuGroupFileChange"
                  accept="image/*"
                  style="display: none"
                />

                <!-- Resim Seçme Butonu -->
              </q-card-section>
              <q-card-actions align="right">
                <q-btn
                  flat
                  label="İptal"
                  @click="closeAddMenuGroupDialog"
                  style="
                    width: 100px;
                    height: 50px;
                    font-size: 18px;
                    margin-right: 10px;
                  "
                />
                <q-btn
                  flat
                  label="Kaydet"
                  color="primary"
                  @click="saveMenuGroup"
                  style="width: 100px; height: 50px; font-size: 18px"
                />
              </q-card-actions>
            </q-card>
          </q-dialog>

          <!-- Ürün Listesi -->
          <div v-if="foods.length > 0 && !isFoodGroupVisible" class="q-pa-md">
            <div
              class="text-center text-h6 q-mb-md"
              style="margin-top: 0px; padding-top: 0px"
            >
              Ürünler
            </div>

            <div class="row q-gutter-md justify-center">
              <q-card
                v-for="(food, index) in foods"
                :key="index"
                class="col-12 col-sm-6 col-md-3 col-lg-2 q-mb-md"
                bordered
                flat
              >
                <q-card-section>
                  <q-img
                    :src="food.imageUrl"
                    alt="Food Image"
                    @click="openUpdateFoodDialog(food)"
                    contain
                    style="max-width: 100%"
                  />
                  <div class="text-h6 q-mt-md">{{ food.name }}</div>
                  <div class="text-body1">
                    {{ food.description || "Açıklama Yok" }}
                  </div>
                  <div class="text-body2">Fiyat: {{ food.price }} ₺</div>
                </q-card-section>

                <!-- Düzenle ve Sil Butonları -->
                <q-card-actions align="center">
                  <q-btn
                    flat
                    icon="edit"
                    color="primary"
                    size="xl"
                    @click="openUpdateFoodDialog(food)"
                  >
                  </q-btn>
                  <q-btn
                    flat
                    icon="delete"
                    color="negative"
                    size="xl"
                    @click="confirmDeleteFood(food.foodId)"
                  >
                  </q-btn>
                </q-card-actions>
              </q-card>
            </div>
          </div>

          <div v-else-if="isFoodGroupVisible && foodGroups.length === 0">
            Ürün grubu bulunamadı...
          </div>
        </div>
      </q-tab-panel>
    </q-tab-panels>

    <!-- Ürün Grubu Ekleme Dialog -->
    <q-dialog
      v-model="isAddMenuGroupDialogOpen"
      persistent
      class="custom-dialog"
    >
      <q-card style="max-width: 800px; width: 100%">
        <q-card-section>
          <div class="text-h6">Yeni Menü Grubu Ekle</div>
        </q-card-section>

        <q-card-section>
          <q-input v-model="newMenuGroup.groupName" label="Grup Adı" outlined />
          <q-input
            v-model="newMenuGroup.description"
            label="Açıklama"
            outlined
          />

          <!-- Resim Yükleme ve Önizleme -->
          <q-img
            v-if="previewMenuGroupImageUrl"
            :src="previewMenuGroupImageUrl"
            alt="Preview Image"
            contain
            style="max-width: 100%; margin-top: 16px"
            @click="triggerMenuGroupFileInput"
          />

          <!-- Gizli Dosya Seçici -->
          <input
            type="file"
            ref="menuGroupFileInput"
            @change="onMenuGroupFileChange"
            accept="image/*"
            style="display: none"
          />

          <!-- Resim Seçme Butonu -->
          <q-btn
            flat
            label="Resim Ekle"
            icon="add_a_photo"
            color="primary"
            @click="triggerMenuGroupFileInput"
            class="q-mt-md"
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="İptal" @click="closeAddMenuGroupDialog" />
          <q-btn flat label="Kaydet" color="primary" @click="saveMenuGroup" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Ürün Grubu Güncelleme Dialog -->
    <q-dialog v-model="isUpdateDialogOpen" class="custom-dialog">
      <q-card style="max-width: 800px; width: 100%">
        <q-card-section>
          <div class="text-h6">Ürün Grubunu Güncelle</div>
        </q-card-section>
        <q-card-section>
          <!-- Resim Önizleme Alanı -->
          <q-img
            v-if="imagePreviewUrl"
            :src="imagePreviewUrl"
            alt="Preview Image"
            contain
            class="dialog-img-preview"
            @click="triggerFileInputForGroup"
          />
          <!-- Gizli Dosya Seçici -->
          <input
            type="file"
            ref="fileInputForGroup"
            @change="onFileChangeForGroup"
            accept="image/*"
            style="display: none"
          />
          <q-input v-model="selectedGroup.groupName" label="Ürün Grubu Adı" />
          <q-input v-model="selectedGroup.description" label="Açıklama" />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="İptal" @click="closeUpdateDialog" />
          <q-btn
            flat
            label="Güncelle"
            color="primary"
            @click="performUpdateFoodGroup"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Ürün Güncelleme Dialog -->
    <q-dialog v-model="isAddMenuFoodDialogOpen" persistent>
      <q-card style="max-width: 800px; width: 100%">
        <q-card-section>
          <div class="text-h6">Yeni Ürün Ekle</div>
        </q-card-section>

        <q-card-section>
          <!-- Ürün Adı -->

          <q-input
            style="max-width: 100%; margin-top: 16px"
            v-model="newFood.name"
            label="Ürün Adı"
            outlined
            required
          />

          <!-- Ürün Açıklaması -->

          <q-input
            style="max-width: 100%; margin-top: 16px"
            v-model="newFood.description"
            label="Açıklama"
            outlined
          />

          <!-- Ürün Fiyatı -->
          <q-input
            v-model="newFood.price"
            label="Fiyat"
            type="number"
            outlined
            style="max-width: 100%; margin-top: 16px"
            required
          />

          <!-- Resim Yükleme ve Önizleme -->
          <q-img
            :src="previewFoodImageUrl || '/images/menu-img.png'"
            alt="Preview Image"
            contain
            style="max-width: 100%; margin-top: 16px"
            @click="triggerMenuFoodFileInput"
          />

          <!-- Gizli Dosya Seçici -->
          <input
            type="file"
            ref="menuFoodFileInput"
            @change="onMenuFoodFileChange"
            accept="image/*"
            style="display: none"
          />

          <!-- Resim Seçme Butonu -->

          <!-- <q-btn
            flat
            label="Resim Ekle"
            icon="add_a_photo"
            color="primary"
            @click="triggerMenuFoodFileInput"
            class="q-mt-md"
            style="
              width: 100%;
              max-width: 300px;
              font-size: 20px;
              display: block;
              margin: 20px auto;
            "
          /> -->
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            flat
            label="İptal"
            @click="closeAddMenuFoodDialog"
            style="
              width: 100px;
              height: 50px;
              font-size: 18px;
              margin-right: 10px;
            "
          />
          <q-btn
            flat
            label="Kaydet"
            color="primary"
            @click="saveMenuFood"
            style="width: 100px; height: 50px; font-size: 18px"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Çıkış Onayı Dialog -->
    <q-dialog v-model="showLogoutDialog" persistent>
      <q-card class="dialog-card">
        <!-- Başlık ve İkon -->
        <q-card-section class="row items-center justify-center">
          <q-icon name="warning" size="48px" color="red" />
          <div class="text-h5 text-center text-bold q-ml-sm">
            Çıkış Yapmak İstediğinize Emin misiniz?
          </div>
        </q-card-section>

        <!-- Açıklama -->
        <q-card-section class="text-center q-pt-md">
          <p>
            Çıkış yaptığınızda oturumunuz sonlandırılacak ve tekrar giriş
            yapmanız gerekecek.
          </p>
        </q-card-section>

        <!-- Aksiyon Butonları -->
        <q-card-actions align="around" class="q-pt-md">
          <q-btn
            flat
            label="Hayır, Vazgeç"
            color="negative"
            icon="close"
            @click="closeDialog"
          />
          <q-btn
            flat
            label="Evet, Çıkış Yap"
            color="positive"
            icon="logout"
            @click="performLogout"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>

  <q-dialog v-model="isUpdateFoodDialogOpen" class="custom-dialog">
    <q-card style="max-width: 800px; width: 100%">
      <q-card-section>
        <div class="text-h6">Yemeği Güncelle</div>
      </q-card-section>
      <q-card-section>
        <!-- Resim Önizleme Alanı -->
        <q-img
          v-if="foodImagePreviewUrl"
          :src="foodImagePreviewUrl"
          alt="Food Preview Image"
          contain
          class="dialog-img-preview"
          @click="triggerFileInputForFood"
        />
        <!-- Gizli Dosya Seçici -->
        <input
          type="file"
          ref="fileInputForFood"
          @change="onFileChangeForFood"
          accept="image/*"
          style="display: none"
        />
        <q-input v-model="selectedFood.name" label="Ürün Adı" />
        <q-input v-model="selectedFood.description" label="Açıklama" />
        <q-input v-model="selectedFood.price" label="Fiyat" type="number" />
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat label="İptal" @click="closeUpdateFoodDialog" />
        <q-btn
          flat
          label="Güncelle"
          color="primary"
          @click="performUpdateFood"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <!--Ürün Grubu Silme Onayı Dialog -->
  <q-dialog v-model="showDeleteDialog" persistent>
    <q-card class="dialog-card">
      <!-- Başlık ve İkon -->
      <q-card-section class="row items-center justify-center">
        <q-icon name="warning" size="48px" color="red" />
        <div class="text-h5 text-center text-bold q-ml-sm">
          Bu ürün grubunu silmek istediğinize emin misiniz?
        </div>
      </q-card-section>

      <!-- Açıklama -->
      <q-card-section class="text-center q-pt-md">
        <p>
          Bu işlem geri alınamaz ve ürün grubuyla ilişkili tüm veriler kalıcı
          olarak silinecektir.
        </p>
      </q-card-section>

      <!-- Aksiyon Butonları -->
      <q-card-actions align="around" class="q-pt-md">
        <q-btn
          flat
          label="Hayır, İptal"
          color="negative"
          icon="close"
          @click="closeDeleteDialog"
        />
        <q-btn
          flat
          label="Evet, Sil"
          color="positive"
          icon="delete"
          @click="performDeleteFoodGroup"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <!-- Ürün Silme Onayı Dialog -->
  <q-dialog v-model="showFoodDeleteDialog" persistent>
    <q-card class="food-dialog-card">
      <!-- Başlık ve İkon -->
      <q-card-section class="row items-center justify-center">
        <q-icon name="warning" size="48px" color="red" />
        <div class="text-h5 text-center text-bold q-ml-sm">
          Bu ürünü silmek istediğinize emin misiniz?
        </div>
      </q-card-section>

      <!-- Açıklama -->
      <q-card-section class="text-center q-pt-md">
        <p>Bu işlem geri alınamaz ve ürün kalıcı olarak silinecektir.</p>
      </q-card-section>

      <!-- Aksiyon Butonları -->
      <q-card-actions align="around" class="q-pt-md">
        <q-btn
          flat
          label="Hayır, İptal"
          color="negative"
          icon="close"
          @click="closeFoodDialog"
        />
        <q-btn
          flat
          label="Evet, Sil"
          color="positive"
          icon="delete"
          @click="performDeleteFood"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
  <FooterComponent />
</template>
<script setup lang="ts">
import { ref, watch, onMounted, computed } from "vue";
import { adminAPIs } from "../composables/admin";
import { uploadImageAPI } from "../composables/upload";
import { useLoginApi } from "../composables/login";
import { Notify } from "quasar";
import FooterComponent from "../components/FooterComponent.vue";

interface CompanyUrlDto {
  domain: string;
}

// Örnek değer; gerçekte bu değer API'den gelir.
const CompanyUrlDto = ref<CompanyUrlDto>({
  domain: "/menu/69a5662f-e37d-4012-8820-a3166a8f5807",
});

// Base URL'yi dinamik olarak belirle
const baseUrl = ref<string>(`https://${window.location.host}`);

// Full menu linki oluştur
const fullMenuLink = computed<string>(
  () => `${baseUrl.value}${CompanyUrlDto.value.domain}`
);

// Kopyalama fonksiyonu
const copyUrlLink = (): void => {
  navigator.clipboard.writeText(fullMenuLink.value).then(() => {
    alert("Link başarıyla kopyalandı!");
  });
};

// Dialog kontrolü
const showFoodDeleteDialog = ref(false);

// Silinecek ürünün ID'si
const selectedFoodId = ref<number | null>(null);

// Silme işlemi başlatmak için dialogu aç
const confirmDeleteFood = (foodId: number): void => {
  selectedFoodId.value = foodId; // Silinecek ID'yi ayarla
  showFoodDeleteDialog.value = true; // Dialogu göster
};

// Dialogu kapat
const closeFoodDialog = (): void => {
  showFoodDeleteDialog.value = false;
};

// Silme işlemini gerçekleştir
const performDeleteFood = (): void => {
  if (selectedFoodId.value !== null) {
    console.log("Ürün silme işlemi başlıyor:", selectedFoodId.value);
    // Örneğin: handleDeleteFood(selectedFoodId.value);
    closeFoodDialog(); // Dialogu kapat
  }
};

// Dialog kontrolü
const showDeleteDialog = ref(false);

// Silinecek grubun ID'si
const selectedFoodGroupId = ref<number | null>(null);

// Silme işlemi başlatmak için dialogu aç
const confirmDeleteFoodGroup = (foodGroupId: number): void => {
  selectedFoodGroupId.value = foodGroupId; // Silinecek ID'yi ayarla
  showDeleteDialog.value = true; // Dialogu göster
};

// Dialogu kapat
const closeDeleteDialog = (): void => {
  showDeleteDialog.value = false;
};

// Silme işlemini gerçekleştir
const performDeleteFoodGroup = (): void => {
  if (selectedFoodGroupId.value !== null) {
    console.log("Silme işlemi başlıyor:", selectedFoodGroupId.value);
    // Örneğin: handleDeleteFoodGroup(selectedFoodGroupId.value);
    closeDeleteDialog(); // Dialogu kapat
  }
};

const isAddMenuFoodDialogOpen = ref(false);
const newFood = ref({
  name: "",
  description: "",
  price: 0,
  imageUrl: "",
  foodGroupId: 1, // Seçilen menü grubunun ID'si
});
const { logout } = useLoginApi();
const showLogoutDialog = ref(false);
const confirmLogout = () => {
  // Çıkış işlemi için onay pop-up'ını aç
  showLogoutDialog.value = true;
};

const closeDialog = () => {
  // Pop-up'ı kapat
  showLogoutDialog.value = false;
};

const performLogout = () => {
  // Çıkış işlemini gerçekleştir
  logout();
  closeDialog();
};
const previewFoodImageUrl = ref("");
const menuFoodFileInput = ref<HTMLInputElement | null>(null); // Tipi belirledik

const openAddMenuFoodDialog = () => {
  isAddMenuFoodDialogOpen.value = true;
};

const closeAddMenuFoodDialog = () => {
  resetNewFoodForm(); // Formu sıfırlıyoruz
  isAddMenuFoodDialogOpen.value = false;
};
const resetNewFoodForm = () => {
  newFood.value = {
    name: "",
    description: "",
    price: 0,
    imageUrl: "",
    foodGroupId: 1,
  };
  previewFoodImageUrl.value = ""; // Resim önizlemesini de sıfırlıyoruz
};
const triggerMenuFoodFileInput = () => {
  // menuFoodFileInput'ın tanımlı olup olmadığını kontrol ediyoruz
  if (menuFoodFileInput.value) {
    menuFoodFileInput.value.click();
  }
};

const onMenuFoodFileChange = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files ? target.files[0] : null;

  if (file) {
    // Görseli yükleyip önizleme URL'sini ayarlıyoruz
    const reader = new FileReader();
    reader.onload = (e) => {
      previewFoodImageUrl.value = e.target?.result as string;
    };
    reader.readAsDataURL(file);

    // Görseli backend'e yükleyip URL'yi alıyoruz
    const uploadedImageUrl = await uploadImageAPI(file);
    const fullImageUrlFood = `${apiDomain}${uploadedImageUrl.imageUrl}`;
    if (uploadedImageUrl) {
      newFood.value.imageUrl = fullImageUrlFood; // API'den gelen resim URL'si
    }
  }
};

const saveMenuFood = async () => {
  try {
    // Seçili gıda grubunu ekle
    const storedFoodGroupId = localStorage.getItem(
      "selectedFoodGroupIdForNewFood"
    );
    if (storedFoodGroupId) {
      newFood.value.foodGroupId = parseInt(storedFoodGroupId); // localStorage'den gelen ID'yi kullanıyoruz
    }

    // Eğer imageUrl boşsa varsayılan resmi ayarla
    if (!newFood.value.imageUrl) {
      newFood.value.imageUrl = "/images/menu-img.png"; // Varsayılan resim yolu
    }

    // API'ye POST isteği atıyoruz
    const result = await addFood(newFood.value);
    await fetchFoods(newFood.value.foodGroupId);
    if (result) {
      closeAddMenuFoodDialog();
      // Gıdaları yenileme işlemi burada yapılabilir
    }
  } catch (error) {
    console.error("Ürün eklenirken bir hata oluştu:", error);
  }
};

// Ürün grubu için seçilen dosya ve önizleme URL'si

// Menü Grubu Verisi
interface MenuGroup {
  companyId: number;
  groupName: string;
  description: string;
  imageUrl: string | null;
}

// newMenuGroup'u bu tip ile tanımlıyoruz
const newMenuGroup = ref<MenuGroup>({
  companyId: 0,
  groupName: "",
  description: "",
  imageUrl: null, // Başlangıçta imageUrl null olabilir
});

// Resim Önizlemesi ve Dosya
const previewMenuGroupImageUrl = ref(""); // Önizleme URL'si
const selectedMenuGroupFile = ref<File | null>(null); // Seçilen dosya

// Dialog Kontrol
const isAddMenuGroupDialogOpen = ref(false);

// Dialogu açma ve kapatma
const openAddMenuGroupDialog = () => {
  isAddMenuGroupDialogOpen.value = true;
};

const closeAddMenuGroupDialog = () => {
  isAddMenuGroupDialogOpen.value = false;
  newMenuGroup.value = {
    companyId: 0,
    groupName: "",
    description: "",
    imageUrl: selectedMenuGroupFile.value
      ? previewMenuGroupImageUrl.value
      : "/images/menu-img.png",
  };
  previewMenuGroupImageUrl.value = selectedMenuGroupFile.value
    ? previewMenuGroupImageUrl.value
    : "/images/menu-img.png";
  selectedMenuGroupFile.value = null;
};

// Resim seçildiğinde tetiklenen fonksiyon
const onMenuGroupFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    selectedMenuGroupFile.value = input.files[0]; // Dosyayı seç
    previewMenuGroupImageUrl.value = URL.createObjectURL(input.files[0]); // Önizleme URL'si oluştur
    uploadSelectedMenuGroupImage(); // Resmi yükleme fonksiyonu çağrılıyor
  }
};

// Resim yükleme işlemi
const uploadSelectedMenuGroupImage = async () => {
  if (selectedMenuGroupFile.value) {
    // Resmi API'ye yüklüyoruz
    const uploadedImageUrl = await uploadImageAPI(selectedMenuGroupFile.value);

    if (uploadedImageUrl) {
      let fullImageUrl = uploadedImageUrl;

      // uploadedImageUrl'in tam bir URL olup olmadığını kontrol ediyoruz
      if (!uploadedImageUrl.imageUrl.startsWith("http")) {
        // Eğer tam URL değilse, başına apiDomain ekliyoruz
        fullImageUrl = `${apiDomain}${uploadedImageUrl.imageUrl}`;
      }

      // Resim URL'sini localStorage'e kaydediyoruz
      localStorage.setItem("newfoodGroupImageUrl", fullImageUrl);
      // Ayrıca resim URL'sini modele ekliyoruz
      newMenuGroup.value.imageUrl = fullImageUrl;
    }
  }
};

// Resim dosyası seçme tetikleyicisi
const triggerMenuGroupFileInput = () => {
  const fileInput = document.querySelector(
    'input[type="file"]'
  ) as HTMLInputElement;
  fileInput.click();
};

// Menü grubunu kaydetme işlemi
const saveMenuGroup = async () => {
  // Şirket ID'sini newMenuGroup'a atıyoruz
  newMenuGroup.value.companyId = originalCompanyDto.value.companyId;

  // Eğer Şirket ID yoksa hata mesajı ver ve işlemi durdur
  if (!newMenuGroup.value.companyId) {
    console.error("Şirket ID'si bulunamadı.");
    return;
  }

  // Resim URL'sini kontrol ediyoruz; eğer boşsa varsayılan resmi ayarlıyoruz
  if (!newMenuGroup.value.imageUrl || newMenuGroup.value.imageUrl === "null") {
    newMenuGroup.value.imageUrl = "/images/menu-img.png"; // Varsayılan resim yolu
  }

  try {
    // API'ye menü grubu ekleme isteği gönderiliyor
    const result = await addFoodGroup(newMenuGroup.value);

    if (result) {
      // Menü grubu başarıyla eklendiyse dialogu kapat ve menü gruplarını yeniden getir
      closeAddMenuGroupDialog();
      await fetchFoodGroups();
      localStorage.removeItem("newfoodGroupImageUrl");
      selectedMenuGroupFile.value = null;
      previewMenuGroupImageUrl.value = "";
    } else {
      console.error("Menü grubu eklenirken bir hata oluştu");
    }
  } catch (error) {
    console.error("API hatası:", error);
  }
};

const selectedImageFileForGroup = ref<File | null>(null); // Ürün grubu için seçilen dosya

// selectedGroup değişkeni, imageUrl özelliği ile birlikte tanımlandı
const selectedGroup = ref({
  foodGroupId: -1,
  groupName: "",
  description: "",
  imageUrl: "", // imageUrl özelliği eklendi
  image: null,
});
// Ürün için seçilen dosya ve önizleme URL'si
const selectedImageFileForFood = ref<File | null>(null);
const foodImagePreviewUrl = ref<string | null>(null); // Resim önizleme URL'si
const foods = ref<Array<any>>([]); // Ürün verisi
const imagePreviewUrl = ref<string | null>(null);
const originalCompanyDto = ref({
  companyId: 0,
  name: "",
  domain: "",
  imageUrl: "",
});
const companyDto = ref({
  companyId: 0,
  name: "",
  domain: "",
  imageUrl: "",
});

// Dosya değiştiğinde ön izleme yapacak fonksiyon
const onFileChangeForGroup = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    selectedImageFileForGroup.value = target.files[0];

    // Resim önizlemesi için base64'e çevirme
    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      if (e.target?.result) {
        imagePreviewUrl.value = e.target.result as string; // Ön izleme URL'si güncelleniyor
      }
    };
    reader.readAsDataURL(selectedImageFileForGroup.value); // Dosyayı base64 formatına çeviriyoruz

    // Resmi otomatik olarak yükle ve localStorage'de sakla
    await uploadAndSaveImage();
  }
};

// Resim yükleyip, linkini localStorage'e kaydetme fonksiyonu
const uploadAndSaveImage = async () => {
  try {
    const imageData = await uploadImageAPI(selectedImageFileForGroup.value!); // Resmi yükle
    if (imageData && imageData.imageUrl) {
      const fullImageUrl = `${apiDomain}${imageData.imageUrl}`; // Yüklenen resmin tam URL'si
      localStorage.setItem("foodGroupImageUrl", fullImageUrl); // localStorage'e kaydet
      console.log("Resim yüklendi ve localStorage'e kaydedildi:", fullImageUrl);
    } else {
      console.error("Resim yükleme başarısız.");
    }
  } catch (error) {
    console.error("Resim yükleme hatası:", error);
  }
};
// Ürün gruplarının görünürlüğünü kontrol eden flag
const isFoodGroupVisible = ref(true);

// Değişiklikleri izlemek için kullanılan flag
const isModified = ref(false);

watch(
  [companyDto, originalCompanyDto],
  ([newVal, oldVal]) => {
    isModified.value =
      newVal.name !== originalCompanyDto.value.name ||
      newVal.domain !== originalCompanyDto.value.domain ||
      newVal.imageUrl !== originalCompanyDto.value.imageUrl; // imageUrl farkını da izleyelim
  },
  { deep: true }
);

// Verileri kaydetmek için fonksiyon
const saveChanges = async () => {
  const payload = {
    name: companyDto.value.name,
    domain: companyDto.value.domain,
    imageUrl: companyDto.value.imageUrl, // Resim URL'sini ekliyoruz
  };

  const response = await addOrUpdateCompany(payload);

  if (response) {
    console.log("Şirket başarıyla kaydedildi:", response);
  } else {
    console.error("Şirket kaydedilirken hata oluştu.");
  }
};

// Tab ayarları
const tab = ref("companyInfo");

// Reactive değişkenler tanımlanıyor
const selectedFile = ref<File | null>(null);
const previewUrl = ref<string | undefined>(undefined); // string | undefined olarak değiştirildi
const companyLogoUrl = ref<string | undefined>(
  localStorage.getItem("companyLogoUrl") || undefined
); // null yerine undefined

const isImageDialogOpen = ref(false);

// Dialog açma fonksiyonu
function openImageDialog() {
  isImageDialogOpen.value = true;
}

// Dialog kapama fonksiyonu
function closeImageDialog() {
  isImageDialogOpen.value = false;
}

// Dosya değişiminde çağrılacak fonksiyon
const onFileChange = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    selectedFile.value = target.files[0];

    // Ön izleme için FileReader ile base64 formatına çevirme
    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      if (e.target?.result) {
        previewUrl.value = e.target.result as string; // Ön izleme için URL'yi güncelle
      }
    };
    reader.readAsDataURL(selectedFile.value); // Dosyayı base64 formatına çevir

    // Resmi otomatik olarak yükle
    await uploadImage();
  } else {
    console.error("Dosya bulunamadı veya geçersiz.");
  }
};

// Resim yükleme ve API'ye istek atma fonksiyonu
const apiDomain = "https://api.qrmenu.fupico.com"; // API domainini tanımla
// Resim yükleme işlemi

const uploadImage = async () => {
  if (!selectedFile.value) {
    console.error("Lütfen bir dosya seçin.");
    return;
  }

  try {
    const imageData = await uploadImageAPI(selectedFile.value); // Resmi yükle
    if (imageData && imageData.imageUrl) {
      // Eğer gelen imageUrl varsa, tam URL'yi oluştur
      const fullImageUrl = `${apiDomain}${imageData.imageUrl}`;

      companyLogoUrl.value = fullImageUrl; // Yüklenen tam resim URL'sini güncelle
      localStorage.setItem("companyLogoUrl", fullImageUrl); // localStorage'ye yaz
      companyDto.value.imageUrl = fullImageUrl;
      previewUrl.value = undefined; // Ön izlemeyi sıfırla
      console.log("Yüklenen resim URL:", fullImageUrl);
    } else {
      console.error("Resim URL'si alınamadı.");
    }
  } catch (error) {
    console.error("Resim yükleme hatası:", error);
  }
};
// Ürün güncelleme işlemi
const performUpdateFood = async () => {
  try {
    let imageUrl = selectedFood.value.imageUrl;

    // Eğer yeni bir resim seçildiyse resmi yükle
    if (selectedImageFileForFood.value) {
      const imageData = await uploadImageAPI(selectedImageFileForFood.value);
      if (imageData && imageData.imageUrl) {
        imageUrl = `${apiDomain}${imageData.imageUrl}`;
      }
    }

    const payload = {
      name: selectedFood.value.name,
      description: selectedFood.value.description,
      price: selectedFood.value.price,
      imageUrl: imageUrl,
    };

    await updateFood(selectedFood.value.foodId, payload);

    const defaultFoodGroupId = localStorage.getItem(
      "selectedFoodGroupIdForNewFood"
    );
    if (defaultFoodGroupId) {
      // LocalStorage'den alınan değeri 10 tabanında tam sayıya çevirme
      const foodGroupId = parseInt(defaultFoodGroupId, 10);

      // `fetchFoods` fonksiyonunu `foodGroupId` ile çağır
      await fetchFoods(foodGroupId);
    }

    closeUpdateFoodDialog();

    // Ürünleri tekrar yükleyerek güncelleme işlemini yansıt
    console.log("Ürün başarıyla güncellendi.");
  } catch (error) {
    console.error("Ürün güncellenirken hata oluştu:", error);
  }
};

// Ürünleri çekme fonksiyonu
const fetchFoods = async (foodGroupId: any) => {
  try {
    const foodsData = await getFoodsByFoodGroupId(foodGroupId);
    localStorage.setItem(
      "selectedFoodGroupIdForNewFood",
      foodGroupId.toString()
    );

    if (foodsData && foodsData.length > 0) {
      foods.value = foodsData;
      isFoodGroupVisible.value = false; // Ürünler görünsün, gruplar gizlensin
    } else if (foodsData === null) {
      // Eğer 404 durumundaysa (foodsData null döndüyse), Ürün ekleme dialogunu aç
      openAddMenuFoodDialog();
      foods.value = [];
    } else {
      // foodsData boşsa yine dialogu açıyoruz
      foods.value = [];
    }

    selectedImageFileForFood.value = null;
  } catch (error: any) {
    console.error(
      "Ürünler alınırken hata oluştu:",
      error?.response?.data || error.message
    );
  }
};

function resetViewOnTabChange(newTab: string) {
  if (newTab === "companyInfo") {
    isFoodGroupVisible.value = true;
  }
}
// Ürün için dosya seçildiğinde tetiklenecek fonksiyon
const onFileChangeForFood = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    selectedImageFileForFood.value = target.files[0];

    // Resim önizlemesi için base64'e çevirme
    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      if (e.target?.result) {
        foodImagePreviewUrl.value = e.target.result as string; // Ön izleme URL'si güncelleniyor
      }
    };
    reader.readAsDataURL(selectedImageFileForFood.value); // Dosyayı base64 formatına çeviriyoruz

    // Resmi otomatik olarak yükle ve localStorage'de sakla
    await uploadAndSaveFoodImage();
  }
};

// Ürün için resim dosyası seçici tetikleme fonksiyonu
const fileInputForFood = ref<HTMLInputElement | null>(null);
const triggerFileInputForFood = () => {
  if (fileInputForFood.value) {
    fileInputForFood.value.click(); // Dosya seçici tetikleniyor
  }
};

// Resim yükleyip, linkini localStorage'e kaydetme fonksiyonu
const uploadAndSaveFoodImage = async () => {
  try {
    const imageData = await uploadImageAPI(selectedImageFileForFood.value!); // Resmi yükle
    if (imageData && imageData.imageUrl) {
      const fullImageUrl = `${apiDomain}${imageData.imageUrl}`; // Yüklenen resmin tam URL'si
      localStorage.setItem("foodImageUrl", fullImageUrl); // localStorage'e kaydet
      console.log(
        "Ürün resmi yüklendi ve localStorage'e kaydedildi:",
        fullImageUrl
      );
    } else {
      console.error("Resim yükleme başarısız.");
    }
  } catch (error) {
    console.error("Resim yükleme hatası:", error);
  }
};

// Ürün güncelleme dialogunu açma
function openUpdateFoodDialog(food: any) {
  selectedFood.value = { ...food }; // Mevcut yemeği seçiyoruz
  isUpdateFoodDialogOpen.value = true; // Dialogu açıyoruz
  foodImagePreviewUrl.value = selectedFood.value.imageUrl; // Var olan resmi göster
}

// Dialog kapatma fonksiyonu
function closeUpdateFoodDialog() {
  isUpdateFoodDialogOpen.value = false;
  foodImagePreviewUrl.value = null; // Önizlemeyi sıfırla
}

// Dialog durumları ve seçilen Ürün
const isUpdateFoodDialogOpen = ref(false);
const selectedFood = ref({
  foodId: 1,
  name: "",
  description: "",
  price: 0,
  imageUrl: "",
});

const triggerFileInput = () => {
  if (fileInput.value) {
    fileInput.value.click(); // Gizli input'u tetikle
  }
};
const fileInputForGroup = ref<HTMLInputElement | null>(null);
const triggerFileInputForGroup = () => {
  if (fileInputForGroup.value) {
    fileInputForGroup.value.click(); // Dosya seçici tetikleniyor
  }
};
const fileInput = ref<HTMLInputElement | null>(null);
// Ürün grupları verisi
const foodGroups = ref<Array<any>>([]);

// Dialog durumu
const isUpdateDialogOpen = ref(false);
const copyLink = () => {
  const link = companyDto.value.domain;
  navigator.clipboard
    .writeText(link)
    .then(() => {
      // Başarılı bildirim
      Notify.create({
        message: "Link kopyalandı!",
        color: "positive",
        timeout: 2000,
      });
    })
    .catch(() => {
      // Hata bildirimi
      Notify.create({
        message: "Link kopyalanamadı!",
        color: "negative",
        timeout: 2000,
      });
    });
};
// Admin menü fonksiyonları
const {
  getCompany,
  getFoodGroups,
  deleteFoodGroup,
  updateFoodGroup,
  getFoodsByFoodGroupId,
  deleteFood,
  updateFood,
  addOrUpdateCompany,
  addFoodGroup,
  addFood,
} = adminAPIs();

// Şirket verilerini çekme fonksiyonu
async function fetchCompanyData() {
  try {
    const response = await getCompany();

    if (response) {
      companyDto.value = response;
    }
  } catch (error) {
    console.error("Şirket verileri alınırken hata:", error);
  }
}

// Ürün gruplarını çekme fonksiyonu
const fetchFoodGroups = async () => {
  try {
    const groupsData = await getFoodGroups();
    foodGroups.value = groupsData || [];
    if (localStorage.getItem("foodGroupImageUrl")) {
      // Eğer varsa, sil
      localStorage.removeItem("foodGroupImageUrl");
    }
    selectedImageFileForGroup.value = null;
  } catch (error) {
    console.error("Ürün grupları alınırken hata:", error);
  }
};

// Geri dönme fonksiyonu
function showFoodGroups() {
  isFoodGroupVisible.value = true; // Ürün gruplarını tekrar göster
  localStorage.removeItem("selectedFoodGroupIdForNewFood");
}

// Ürün grubu silme işlemi
async function handleDeleteFoodGroup(id: any) {
  try {
    const response = await deleteFoodGroup(id);
    if (response) {
      // Silme işlemi başarılı olursa grupları yeniden çekiyoruz
      await fetchFoodGroups();
    }
  } catch (error) {
    console.error("Ürün grubu silinirken hata:", error);
  }
}

// Ürün silme işlemi
async function handleDeleteFood(id: number) {
  try {
    const response = await deleteFood(id);
    console.log(response);
    if (response) {
      // "message" anahtarındaki değeri alıp tam sayıya çeviriyoruz
      const foodGroupId = parseInt(response.message, 10); // 10 tabanında tam sayıya çevirme
      console.log(foodGroupId); // Çevrilen değeri kontrol etmek için
      await fetchFoods(foodGroupId);
    }
  } catch (error) {
    console.error("Ürün silinirken hata:", error);
  }
}

// Ürün grubu seçildiğinde Ürünleri getiriyoruz
function openUpdateFoodGroupDialog(group: any) {
  selectedGroup.value = { ...group }; // Seçilen grubu ayarlıyoruz
  imagePreviewUrl.value = selectedGroup.value.imageUrl || null; // Var olan resim URL'sini gösteriyoruz

  isUpdateDialogOpen.value = true; // Dialogu açıyoruz

  // Ürünleri çekme işlemi
  // if (selectedGroup.value.foodGroupId) {
  //   fetchFoods(selectedGroup.value.foodGroupId); // Seçilen Ürün grubunun Ürünlerini getiriyoruz
  // }
}
// Ürün grubu güncelleme işlemi
// Ürün grubunu güncelleme fonksiyonu
// Ürün grubunu güncelleme işlemi
const performUpdateFoodGroup = async () => {
  try {
    let imageUrl = selectedGroup.value.imageUrl; // Mevcut imageUrl

    // Eğer yeni bir resim seçildiyse, resmi yükle ve URL'yi al
    if (selectedImageFileForGroup.value) {
      const imageData = await uploadImageAPI(selectedImageFileForGroup.value);
      if (imageData && imageData.imageUrl) {
        imageUrl = `${apiDomain}${imageData.imageUrl}`; // Tam URL'yi oluştur
      }
    }

    // Güncelleme isteği, güncellenmiş imageUrl ile gönderiliyor
    const payload = {
      groupName: selectedGroup.value.groupName,
      description: selectedGroup.value.description,
      imageUrl: imageUrl, // Güncellenmiş veya eski imageUrl
    };

    await updateFoodGroup(selectedGroup.value.foodGroupId, payload);
    closeUpdateDialog(); // Dialogu kapat
    await fetchFoodGroups(); // Ürün gruplarını tekrar yükle (otomatik yenileme)
    console.log("Ürün grubu başarıyla güncellendi.");
  } catch (error) {
    console.error("Ürün grubu güncellenirken hata oluştu:", error);
  }
};

// Ürün gruplarını çekme fonksiyonu

// Dialog kapatma

// Dialog kapatma fonksiyonları
// Dialog kapatma fonksiyonları
function closeUpdateDialog() {
  isUpdateDialogOpen.value = false;
  imagePreviewUrl.value = null; // Önizlemeyi sıfırla
}

// Sayfa yüklendiğinde veriyi çek
onMounted(async () => {
  await fetchCompanyData();
  await fetchFoodGroups();
  // Orijinal verileri kaydediyoruz
  originalCompanyDto.value = { ...companyDto.value };
  if (selectedGroup.value.foodGroupId > 0 && !isUpdateDialogOpen.value) {
    await fetchFoods(selectedGroup.value.foodGroupId); // Ürünleri sadece ID 0'dan büyükse ve dialog açık değilse çek
  }
});
</script>

<style scoped>
.food-dialog-card {
  max-width: 400px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  background: linear-gradient(135deg, #ffe5e5, #ffffff);
  padding: 20px;
}

.food-dialog-card .q-card-section {
  margin-bottom: 10px;
}

.text-bold {
  font-weight: bold;
}

.q-card-actions .q-btn {
  font-size: 16px;
  padding: 10px 20px;
}

.dialog-card {
  max-width: 400px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  background: linear-gradient(135deg, #ffe5e5, #ffffff);
  padding: 20px;
}

.dialog-card .q-card-section {
  margin-bottom: 10px;
}

.text-bold {
  font-weight: bold;
}

.q-card-actions .q-btn {
  font-size: 16px;
  padding: 10px 20px;
}
.q-tab-panel {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.q-pa-md.edit-tab {
  width: 100%;
}

.row {
  margin-left: auto;
  margin-right: auto;
  max-width: 1600px;
}

.q-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 400px;
}

.q-img {
  display: block;
  width: 270px;
  height: 270px;
  object-fit: contain;
  margin: auto;
}

.q-dialog .q-card-section {
  text-align: center;
}

.q-dialog .q-card-actions {
  justify-content: flex-end;
}

.custom-dialog .q-dialog {
  max-width: 800px;
  width: 100%;
}

.custom-dialog .q-card {
  max-height: 90vh; /* Card'ın çok büyük ekranlarda maksimum yüksekliğini ayarla */
  margin: auto; /* Ortalamak için */
}

.custom-dialog .q-dialog__inner {
  justify-content: center; /* Diyaloğun yukarıda değil, ortada açılmasını sağlar */
  align-items: center;
}

.q-input__inner {
  white-space: nowrap; /* Metni tek satırda tut */
  overflow: hidden; /* Taşan kısmı gizle */
  text-overflow: ellipsis; /* Çok uzun olduğunda üç nokta ile kes */
}
.footer {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 16px 0;
  /* background-color: #f4f4f4; */
  border-top: 1px solid #ff0000;
  gap: 20px;
}

.footer-link {
  color: #ff0000;
  text-decoration: none;
  font-size: 18px;
  font-weight: bold;
}

.footer-phone {
  color: #00e1ff;
  text-decoration: none;
}

.footer-phone q-icon {
  cursor: pointer;
}
</style>
