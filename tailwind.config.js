/** @type {import('tailwindcss').Config} */
const flowbite = require("flowbite-react/tailwind");

module.exports = {
  mode: "jit",
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/@headlessui/react/**/*.{js,ts,jsx,tsx}",
    "./node_modules/flowbite/**/*.js",
    flowbite.content(),
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: "Poppins",
        kaushan: "Kaushan Script",
      },
      backgroundImage: {
        hero1: "url(src/assets/images/hero1.jpg)",
        hero2: "url(src/assets/images/hero2.jpg)",
        hero3: "url(src/assets/images/hero3.jpg)",
      },
    },
    colors: {
      "light-green": "#C4EAD0",
      "dark-green": "#0B8E11",
      "light-yellow": "#FFF6DE",
      "dark-yellow": "#E68A00",
      "light-red": "#FFDEDE",
      "dark-red": "#E60000",
      "danger-red": "#E60E00",
      "ice-blue": "#F5F7FD",
      "regal-blue": "#243C5A",
      "primary-blue": "#3758f9",
      "dark-blue": "#163AEB",
      "light-gray": "#F3F4F6",
      "secondary-black": "#111928",
      "off-white:": "#CCCCCE",
      "lilac-gray": "#DFE4EA",
      "steel-gray": "#637381",
      "dark-gray": "#656668",
      "soft-mint": "#DAF8E6",
    },
  },
  plugins: [
    require("flowbite/plugin"),
    flowbite.plugin(),
    require("tailwindcss"),
    require("@tailwindcss/typography"),
  ],
};
