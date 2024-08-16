export interface ToastProps {
  text: string;
  type: "success" | "error" | "info" | "warning"
  options: {
    position: "top-left" | "top-right" | "top-center" | "bottom-left" | "bottom-right" | "bottom-center";
  }
}