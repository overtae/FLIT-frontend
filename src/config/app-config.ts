import packageJson from "../../package.json";

const currentYear = new Date().getFullYear();

export const APP_CONFIG = {
  name: "Flit Admin",
  version: packageJson.version,
  copyright: `© ${currentYear}, Flit Admin.`,
  meta: {
    title: "Flit Admin",
    description: "웹사이트 설명",
  },
};
