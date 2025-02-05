import { homeIcon, jobIcon, goToIcon, parkIcon } from "./constants.js";

// A function named getStatus was written. This function returns the appropriate expression based on the given status value.
const getStatus = (status) => {
  switch (status) {
    case "goto":
      return "Visit";
    case "park":
      return "Park";
    case "home":
      return "Home";
    case "job":
      return "Job";
    default:
      return "Undefined Status";
  }
};

const getNoteIcon = (status) => {
  switch (status) {
    case "goto":
      return goToIcon;
    case "park":
      return parkIcon;
    case "home":
      return homeIcon;
    case "job":
      return jobIcon;
    default:
      return null;
  }
};

export { getStatus, getNoteIcon };
