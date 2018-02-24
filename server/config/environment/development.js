'use strict';

var privateKey = "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDMQCj48xDAuO/x\n87L4ujNR1WE1mp3TnBr2X7hcRNpAEuBcve0wCBqnnarT5yL9mr7GGPkKfR0Kq5D0\nJ/3ll4wEltKEIKttbLE5TpPaNMAQHTYcchD70RESpKa8ZKqFYe1uZOJAWHjoncjJ\n6Arj0RuKh6cEmVuH3BH5PSlFC+OWlOuTRtDJ8NfMoxZIhqricmd921rvD2U9iy7j\nUU1bW0scElDP+5+nQpZbzMCBEX9UT5ZO7j0wfe0AfgLPqeuj+XMaM/tAhvHYq/Tn\nwDPe4JIKc97kWcEEvliQKh0EDP6jkB4c5O2bdE8mhJDPolHdu6bp0BllVsqAqh7P\nAvi4y7PFAgMBAAECggEAFBfiv/zvgroe1std6bStrEkE12hmyuTCTUcE5MTcQK3q\ntwzzKsS9VIyA+/gy28aPqn7V7yd4Ri6zI6XUhzPlsSTiQF/TZYAqHiRiDLcgRuWM\nx3ccPx2l45LhmUqA8P69hBz2GhTqDh5JnL1QZvGRF0t5jY0FsWOfvAh9iR6ejNdb\n4fdaHMpnUT1mvfRdmbyNrDtEIzNRF42nlCsV+4Jbubx3YXjo7/U4Xz82Ac8gMM0+\n/klNhZ31G8Wbk7yAnmhLdUV5B02klqb+UgxBzT5bqgigrtisbPVHSjPIN6pGVdag\nqtd63oIovdJWH+dmXQCF0rXjB0CLQ3ilN9sIu3PX+QKBgQD/eEqOxdXg7BSmlate\n2tvkkum6tPn7ZQ8cR/NvLc/70/VF0y2brgsxgkwIZkIwdFPz4GPCMz1uYlex4Pwq\nJ7lo/n8rb6hvr2KSikD1StCWqxq32YyBnyOPr0kDxLubogRYhGJ//m5ffsANgkCr\nRy6+uMBvfEeZ1nEQRtmPYTJlPQKBgQDMrKkWuFBx+P9IrraBo8dVpoqSa49pPD+N\n37m0LyOGycI1d2NbSMC8nO084jZbeY083EJSIlQ62VL7f9Lv5XT20WhYJflYOqKi\n6sBHwrOjKwDGu/gwkjJ+pbGA0yMMgAsmtcH17/g8vziq4WXPMTaPvEFRTI1J27sj\niWmVjmlBKQKBgEu1fHL/UjkL/bq4lEbSGWSN3VKFm6fS9T1uXUhPjVmWIRQGV3fR\nhmOvt5StqWPutYqKr0W4JbZ20oJWqKRdjWb+NPXMa2Bd25qN+l43Q8XDA3IEuM0Z\nOlK0obDKNscSprMM2JwR7OfECmp2dW/M8p925SCk9hszH+Kw/HyvU14JAoGABnYo\n/GujNoXq4UuKvXsDLwQL+eVlaKgbRYpbnYGjeHzkIbX8MASS+SFnJ/XoS2kB+Xrm\nqRsmV5lG0mPNr/8peyVPSwEf5xYqzkPlAB74dt1DsAJ9KmNjLrZibTO9NobQU0+H\nqREDYD+VNWfaQ/lExLLnyP5Gs585QDz1VWBimEkCgYEAlZBdsetNe8Lqdl40H+Yk\nryVGfxTKuRN9IQdEfyfrBH9Xl3JE5H+b/qHjZitcHGzbrmd9vhqh95g15KrS3CrG\nye6Kj8VP1s1eRelmA+9nhiNqUeB68cO9XAHW5rzc6oMzfh3RHVlmCu+/Ni/mI9aB\nboiDTSeJP2Mlg9PioEOBk3k=\n-----END PRIVATE KEY-----\n";
//var privateKey = JSON.parse('"' + process.env.FIRE_KEY + '"');

// Development specific configuration
// ==================================
module.exports = {
  // MongoDB connection options
  mongo: {
    uri: 'mongodb://localhost/exam-dev'
  },
  
  sql: {
    maxLimit: 100,
    host: 'localhost',
    user : 'root',
    password: 'root',
    database: 'Insti'
  },
  
  sql: {
    maxLimit: 100,
    host: '43.255.154.28',
    user : 'alpha101',
    password: 'ciitdc#123',
    database: 'Sharma_Infotech'
  },
  
  firebase: {
    type: "service_account",
    project_id: "exam-daf1e",
    storage_bucket:"exam-daf1e.appspot.com",
    private_key_id: "95b87f15289a5ce67d5fdf4c4abd9563ff1e7f35",
    private_key: privateKey,
    client_email: "firebase-adminsdk-axwza@exam-daf1e.iam.gserviceaccount.com",
    client_id: "102687349807043669343",
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://accounts.google.com/o/oauth2/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-axwza%40exam-daf1e.iam.gserviceaccount.com"
  },
  log: {
    logLevel : 'debug' 
  },
  seedDB: false
};
