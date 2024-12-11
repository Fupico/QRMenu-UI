import { api } from "boot/axios";
import { useRouter } from "vue-router";

export function useLoginApi() {
  const router = useRouter();

  const isSignedIn = () => {
    return localStorage.getItem("accessToken") ? true : false;
  };

  const getAccessToken = () => {
    return localStorage.getItem("accessToken");
  };

  const login = async (data: any) => {
    try {
      let response = await api.post("/Login/login", data);
      if (response.status === 200) {
        localStorage.removeItem("userDetail");
        localStorage.setItem("accessToken", response.data.data);
        router.replace("/admin2");
        return { success: true };
      } else {
        return { success: false, errors: response.data.errors };
      }
    } catch (error: any) {
      let response = error.response;

      if (response && response.status === 400) {
        return {
          success: false,
          errors: response.data.errors || ["Geçersiz giriş bilgileri."],
        };
      }

      if (response && response.status === 401) {
        router.replace("/unauthorize");
        return { success: false, errors: ["Yetkisiz erişim."] };
      }

      if (response && response.status === 403) {
        router.replace("/is-not-auth");
        return { success: false, errors: ["Erişim izni yok."] };
      }

      return { success: false, errors: ["Bilinmeyen bir hata oluştu."] };
    }
  };
  // Yeni eklenen register fonksiyonu
  const register = async (data: any) => {
    try {
      let response = await api.post("/Login/register", data);
      if (response.status === 200) {
        return { success: true, message: "Kayıt başarılı!" };
      } else {
        return { success: false, errors: response.data.errors };
      }
    } catch (error: any) {
      let response = error.response;

      if (response && response.status === 400) {
        return {
          success: false,
          errors: response.data.errors || ["Geçersiz kayıt bilgileri."],
        };
      }

      return {
        success: false,
        errors: ["Kayıt işlemi sırasında bir hata oluştu."],
      };
    }
  };
  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("newfoodGroupImageUrl");
    localStorage.removeItem("selectedFoodGroupIdForNewFood");
    router.replace("/login");
  };

  const isNotAuth = () => {
    router.replace("/is-not-auth");
  };

  return {
    login,
    register, // Yeni eklenen register fonksiyonunu döndürme
    logout,
    isSignedIn,
    getAccessToken,
    isNotAuth,
  };
}
