module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: [
      "<rootDir>/src"
    ],
    transform: {
      '^.+\\.ts?$': 'ts-jest',
    },
    transformIgnorePatterns: ['<rootDir>/node_modules/'],
    moduleNameMapper: {
      "^@/(.*)$": "<rootDir>/src/$1",
      "^#/(.*)$": "<rootDir>/examples/$1"
    }
};
  