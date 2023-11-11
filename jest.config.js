module.exports = {
  "roots": [
    "<rootDir>/",
    "<rootDir>/__tests__"
  ],
  testMatch: [
    "<rootDir>/__tests__/*.+(ts|tsx|js)",
    "<rootDir>/__tests__/*.(test|spec).+(ts|tsx|js)",

    "**/*.(spec|test).+(ts|tsx|js)"
  ],
  "transform": {
    "^.+\\.(ts|tsx)$": "ts-jest"
  },
}
