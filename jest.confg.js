module.exports = {
    rootDir: "./src",
    roots:  ["<rootDir>"],
    transform: {
        "^.+\\.tsx?$": "ts-jest",
    },
    setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
};