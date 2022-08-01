import { FaUsers } from "react-icons/fa";
import { IoMdHome } from "react-icons/io";

export const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const days = Array.from({ length: 31 }, (_, index) => index + 1);

export function years() {
  const thisYear = new Date().getFullYear();
  let years = [];
  for (let i = thisYear; i >= 1905; i--) {
    years.push(i);
  }

  return years;
}

export const CLOUDINARY_UPLOAD_WIDGET_DEF_CONFIG = {
  cloudName: "dmkcfie45",
  uploadPreset: "sssaoyjo",
  defaultSource: "local",
  showAdvancedOptions: false,
  styles: {
    palette: {
      window: "#ffffff",
      sourceBg: "#f4f4f5",
      windowBorder: "#90a0b3",
      tabIcon: "#000000",
      inactiveTabIcon: "#555a5f",
      menuIcons: "#555a5f",
      link: "#0094EC",
      action: "#339933",
      inProgress: "#0433ff",
      complete: "#339933",
      error: "#cc0000",
      textDark: "#000000",
      textLight: "#fcfffd",
    },
    fonts: {
      default: null,
      "'Poppins', sans-serif": {
        url: "https://fonts.googleapis.com/css?family=Poppins",
        active: true,
      },
    },
  },
};

export const NAV_LINKS = [
  {
    label: "Home",
    Icon: IoMdHome,
    to: "/",
  },
  {
    label: "Friends",
    Icon: FaUsers,
    to: "/friends",
  },
];
