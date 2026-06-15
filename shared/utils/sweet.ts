// shared/utils/sweet.ts

import Swal, { SweetAlertIcon } from "sweetalert2";

type SweetOptions = {
  title: string;
  text?: string;
  icon?: SweetAlertIcon;
  confirmButtonText?: string;
  cancelText?: string;
  timer?: number;
  confirmButtonColor?: string;
  cancelButtonColor?: string;
};

type SweetInputOptions = {
  title: string;
  text?: string;
  inputLabel?: string;
  inputPlaceholder?: string;
  inputValue?: string;
  inputValidator?: (value: string) => string | null;
  confirmButtonText?: string;
  cancelText?: string;
};

// Tokopedia Green
const COLORS = {
  success: '#25c95f',
  error: '#ef4444',
  warning: '#f59e0b',
  info: '#3b82f6',
  confirm: '#25c95f',
  cancel: '#6b7280',
  question: '#25c95f', // <- TAMBAHIN
};

// Styles
const style = {
  popup: 'swal2-popup',
  title: 'swal2-title',
  htmlContainer: 'swal2-html-container',
  confirmButton: 'swal2-confirm',
  cancelButton: 'swal2-cancel',
};

// Get color function
const getColor = (icon?: SweetAlertIcon): string => {
  return COLORS[icon || 'success'] || COLORS.success;
};

export const sweet = {

  /* =========================
     SUCCESS
  ========================= */
  success: (options: SweetOptions) => {
    return Swal.fire({
      ...style,
      title: options.title,
      text: options.text,
      icon: "success",
      iconColor: COLORS.success,
      confirmButtonColor: COLORS.success,
      confirmButtonText: options.confirmButtonText || "OK",
      timer: options.timer || 3000,
      showConfirmButton: !options.timer,
    });
  },

  /* =========================
     ERROR
  ========================= */
  error: (options: SweetOptions) => {
    return Swal.fire({
      ...style,
      title: options.title,
      text: options.text,
      icon: "error",
      iconColor: COLORS.error,
      confirmButtonColor: COLORS.error,
      confirmButtonText: options.confirmButtonText || "OK",
    });
  },

  /* =========================
     WARNING
  ========================= */
  warning: (options: SweetOptions) => {
    return Swal.fire({
      ...style,
      title: options.title,
      text: options.text,
      icon: "warning",
      iconColor: COLORS.warning,
      confirmButtonColor: COLORS.warning,
      confirmButtonText: options.confirmButtonText || "OK",
    });
  },

  /* =========================
     INFO
  ========================= */
  info: (options: SweetOptions) => {
    return Swal.fire({
      ...style,
      title: options.title,
      text: options.text,
      icon: "info",
      iconColor: COLORS.info,
      confirmButtonColor: COLORS.info,
      confirmButtonText: options.confirmButtonText || "OK",
    });
  },

  /* =========================
     CONFIRM YES/NO
  ========================= */
  confirm: async (options: SweetOptions) => {
    const result = await Swal.fire({
      ...style,
      title: options.title,
      text: options.text,
      icon: "question",
      iconColor: COLORS.question,
      showCancelButton: true,
      confirmButtonColor: COLORS.confirm,
      cancelButtonColor: COLORS.cancel,
      confirmButtonText: options.confirmButtonText || "Ya",
      cancelButtonText: options.cancelText || "Batal",
    });

    return result.isConfirmed;
  },

  /* =========================
     CONFIRM WARNING
  ========================= */
  confirmWarning: async (options: SweetOptions) => {
    const result = await Swal.fire({
      ...style,
      title: options.title,
      text: options.text,
      icon: "warning",
      iconColor: COLORS.warning,

      // 👇 custom delete icon
      iconHtml: '<i class="fa-solid fa-triangle-exclamation" style="font-size: 30pt;"></i>',

      showCancelButton: true,
      confirmButtonColor: COLORS.warning,
      cancelButtonColor: COLORS.cancel,
      confirmButtonText: options.confirmButtonText || "Ya",
      cancelButtonText: options.cancelText || "Batal",
    });

    return result.isConfirmed;
  },

  /* =========================
     CONFIRM DANGER
  ========================= */
  confirmDanger: async (options: SweetOptions) => {
  const result = await Swal.fire({
    ...style,
    title: options.title,
    text: options.text,

    icon: "warning",
    iconColor: COLORS.error,

    // 👇 custom delete icon
    iconHtml: '<i class="fa-regular fa-trash-can" style="font-size: 30pt;"></i>',

    showCancelButton: true,
    confirmButtonColor: COLORS.error,
    cancelButtonColor: COLORS.cancel,
    confirmButtonText: options.confirmButtonText || "Hapus",
    cancelButtonText: options.cancelText || "Batal",
  });

  return result.isConfirmed;
},

  /* =========================
     TOAST
  ========================= */
  toast: (options: SweetOptions) => {
    return Swal.fire({
      title: options.title,
      text: options.text,
      icon: options.icon || "success",
      iconColor: getColor(options.icon),
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: options.timer || 2000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
      },
    });
  },

  /* =========================
     INPUT
  ========================= */
  input: async (options: SweetInputOptions) => {
    const result = await Swal.fire({
      ...style,
      title: options.title,
      text: options.text,
      input: "text",
      inputLabel: options.inputLabel,
      inputPlaceholder: options.inputPlaceholder,
      inputValue: options.inputValue,
      showCancelButton: true,
      confirmButtonColor: COLORS.confirm,
      cancelButtonColor: COLORS.cancel,
      confirmButtonText: options.confirmButtonText || "Lanjut",
      cancelButtonText: options.cancelText || "Batal",
      inputValidator: options.inputValidator,
    });

    if (result.isConfirmed && result.value) {
      return result.value;
    }
    return null;
  },

  /* =========================
     LOADING
  ========================= */
  loading: (title: string = "Memuat...") => {
    return Swal.fire({
      title: title,
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
  },

  /* =========================
     CLOSE
  ========================= */
  close: () => {
    Swal.close();
  },

  /* =========================
     FIRE CUSTOM
  ========================= */
  fire: (options: SweetOptions) => {
    return Swal.fire({
      ...style,
      title: options.title,
      text: options.text,
      icon: options.icon,
      iconColor: getColor(options.icon),
      confirmButtonColor: options.confirmButtonColor || COLORS.success,
      confirmButtonText: options.confirmButtonText || "OK",
      timer: options.timer,
      showConfirmButton: !options.timer,
    });
  },
};

export default sweet;