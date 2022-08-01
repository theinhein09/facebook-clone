import { FaUsers } from "react-icons/fa";
import { IoMdHome } from "react-icons/io";
import { Users } from "./firebase/firestore";

export const MONTHS = [
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

export const DAYS = Array.from({ length: 31 }, (_, index) => index + 1);

export function YEARS() {
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

const TODAY = new Date();

export const NEW_USER = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  day: TODAY.getDay(),
  month: TODAY.getMonth(),
  year: TODAY.getFullYear(),
  gender: "female",
};

export const LOGIN_FORM_FIELDS = [
  {
    label: "Email",
    id: "email",
    name: "email",
    type: "email",
    placeholder: "Email",
    autocomplete: "email",
  },
  {
    label: "Password",
    id: "password",
    name: "password",
    type: "password",
    placeholder: "Password",
    autocomplete: "current-password",
  },
];

export const SIGN_UP_FORM_FIELDS = [
  {
    label: "First name",
    id: "firstName",
    name: "firstName",
    type: "text",
    placeholder: "First name",
    autocomplete: "given-name",
  },
  {
    label: "Last name",
    id: "lastName",
    name: "lastName",
    type: "text",
    placeholder: "Last name",
    autocomplete: "family-name",
  },
  {
    label: "Email",
    id: "email",
    name: "email",
    type: "email",
    placeholder: "Email",
    autocomplete: "email",
  },
  {
    label: "New password",
    id: "password",
    name: "password",
    type: "password",
    placeholder: "New password",
    autocomplete: "new-password",
  },
];

export const SIGN_UP_FORM_GENDERS = [
  {
    label: "Female",
    id: "female",
    type: "radio",
    name: "gender",
    value: "female",
    defaultChecked: true,
  },
  {
    label: "Male",
    id: "male",
    type: "radio",
    name: "gender",
    value: "male",
    defaultChecked: false,
  },
  {
    label: "Other",
    id: "other",
    type: "radio",
    name: "gender",
    value: "other",
    defaultChecked: false,
  },
];

export const SIGN_UP_FORM_DOB = [
  {
    name: "month",
    options: MONTHS,
  },
  {
    name: "day",
    options: DAYS,
  },
  {
    name: "year",
    options: YEARS(),
  },
];

export function createCloudinaryUploadWidget({ options, type }) {
  let config = {};

  switch (type) {
    case "feed-images":
      const media = [];

      config = {
        ...CLOUDINARY_UPLOAD_WIDGET_DEF_CONFIG,
        folder: options.folder,
        multiple: true,
        maxFiles: 5,
        clientAllowedFormats: ["webp", "gif", "jpg", "png", "jpeg"],
        resourceType: "image",
      };

      return {
        widget: window.cloudinary.createUploadWidget(
          config,
          (error, result) => {
            if (!error && result && result.event === "success") {
              console.log("Done! Here is the image info: ", result.info);
              media.push(result.info.public_id);
            }
          }
        ),
        media,
      };
    case "profile-pic":
      let profileUrl;
      config = {
        ...CLOUDINARY_UPLOAD_WIDGET_DEF_CONFIG,
        folder: options.folder,
        cropping: true,
        clientAllowedFormats: ["webp", "gif", "jpg", "png", "jpeg"],
        resourceType: "image",
      };
      return {
        widget: window.cloudinary.createUploadWidget(
          config,
          async (error, result) => {
            if (!error && result && result.event === "success") {
              console.log("Done! Here is the image info: ", result.info);
              profileUrl = result.info.public_id;
              await Users.updateUser(options.folder, {
                profileUrl,
              });
            }
          }
        ),
      };
    default:
      throw new Error("ERROR IN CREATING WIDGET");
  }
}
