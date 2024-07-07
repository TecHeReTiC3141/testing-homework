export default {
  gridUrl: "http://localhost:4444/wd/hub",
  baseUrl: "http://localhost",
  pageLoadTimeout: 0,
  httpTimeout: 60000,
  testTimeout: 90000,
  resetCursor: false,
  sets: {
    desktop: {
      files: [
        "test/testplane-tests/**/*.testplane.(t|j)s"
      ],
      browsers: [
        "chrome"
      ]
    }
  },
  browsers: {
    chrome: {
      automationProtocol: "devtools",
      headless: false,
      desiredCapabilities: {
        browserName: "chrome"
      },
      windowSize: {
        width: 1024,
        height: 800,
      },
      screenshotDelay: 300,
    },
  },
  plugins: {
    "html-reporter/testplane": {
      // https://github.com/gemini-testing/html-reporter
      enabled: true,
      path: "testplane-report",
      defaultView: "all",
      diffMode: "3-up-scaled"
    },
    '@testplane/headless-chrome': {
      enabled: true,
      browserId: "chrome",
    }
  }
};
