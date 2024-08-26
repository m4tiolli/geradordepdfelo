import {jwtDecode} from "jwt-decode";

export const isTokenValid = (token?: string): boolean => {
  try {
    const tokenToCheck = token ?? localStorage.getItem("token");
    if (!tokenToCheck) {
      return false;
    }

    const decodedToken: any = jwtDecode(tokenToCheck);

    const currentTime = Math.floor(Date.now() / 1000);

    if (decodedToken.exp < currentTime) {
      return false;
    }
    return true;
  } catch (error) {
    console.error("Erro ao decodificar o token:", error);
    return false;
  }
};

export const getToken = () => {
if(typeof window !== "undefined"){
  return localStorage.getItem("token")
}
}