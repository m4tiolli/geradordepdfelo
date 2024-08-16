import { ToastProps } from "@/interfaces/Toast";
import { Bounce, toast } from "react-toastify";

export const ShowToast = ({ text, options, type }: ToastProps) => {
  type === "success"
    ? toast.success(text, {
        position: options.position,
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
      })
    : type === "error"
    ? toast.error(text, {
        position: options.position,
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
      })
    : type === "info"
    ? toast.info(text, {
        position: options.position,
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
      })
    : toast.warning(text, {
        position: options.position,
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
      });
};
