/* eslint-disable */
export default {
  displayName: "the-form",
  preset: "../../../../jest.preset.js",
  transform: {
    "^.+\\.[tj]sx?$": ["babel-jest", { presets: ["@nrwl/react/babel"] }],
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
};
