import resolve from "@rollup/plugin-node-resolve";

export default {
  input: {
    index: "index.js",
    planets: "planets.js",
    labels: "src/issues/labels.js",
    toggleIssues: "src/issues/toggleIssues.js",
    toggleSideBar: "src/toggleSideBar.js",
    toggleTree: "src/tree/toggleTree.js",
  },

  output: [
    {
      format: "esm",
      dir: "dist",
    },
  ],
  plugins: [resolve()],
};
