const rootMain = require("../../../../../.storybook/main");

module.exports = {
  ...rootMain,

  core: { ...rootMain.core, builder: "webpack5" },

  stories: [
    ...rootMain.stories,
    "../src/**/*.stories.mdx",
    "../src/**/*.stories.@(js|jsx|ts|tsx)",
  ],
  addons: [
    "@storybook/addon-essentials",
    ...rootMain.addons,
    "@nrwl/react/plugins/storybook",
  ],
  webpackFinal: async (config, { configType }) => {
    if (rootMain.webpackFinal) {
      config = await rootMain.webpackFinal(config, { configType });
    }
    return config;
  },
};
