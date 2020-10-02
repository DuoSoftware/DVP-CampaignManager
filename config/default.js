module.exports = {
  DB: {
    Type: "postgres",
    User: "",
    Password: "",
    Port: 5432,
    Host: "", //104.131.105.222
    Database: "duo",
  },
  Redis: {
    ip: "",
    port: 6379,
    password: "",
    db: 4,
    mode: "instance",
    sentinels: {
      hosts: "",
      port: 16389,
      name: "redis-cluster",
    },
  },
  Security: {
    ip: "",
    port: 6379,
    user: "",
    password: "",
    mode: "instance", //instance, cluster, sentinel
    sentinels: {
      hosts: "",
      port: 16389,
      name: "redis-cluster",
    },
  },
  Host: {
    domain: "0.0.0.0",
    port: 8827,
    version: "1.0.0.0",
    hostpath: "./config",
    logfilepath: "",
  },
  Services: {
    accessToken:
      "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdWtpdGhhIiwianRpIjoiYWEzOGRmZWYtNDFhOC00MWUyLTgwMzktOTJjZTY0YjM4ZDFmIiwic3ViIjoiNTZhOWU3NTlmYjA3MTkwN2EwMDAwMDAxMjVkOWU4MGI1YzdjNGY5ODQ2NmY5MjExNzk2ZWJmNDMiLCJleHAiOjE5MDIzODExMTgsInRlbmFudCI6LTEsImNvbXBhbnkiOi0xLCJzY29wZSI6W3sicmVzb3VyY2UiOiJhbGwiLCJhY3Rpb25zIjoiYWxsIn1dLCJpYXQiOjE0NzAzODExMTh9.Gmlu00Uj66Fzts-w6qEwNUz46XYGzE8wHUhAJOFtiRo",
    notificationServiceHost: "notificationservice.app.veery.cloud",
    notificationServicePort: "8089",
    notificationServiceVersion: "1.0.0.0",
    dynamicPort: false,
  },
};
