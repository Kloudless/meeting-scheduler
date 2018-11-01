module.exports = {
  KLOUDLESS_APP_ID: JSON.stringify(process.env.KLOUDLESS_APP_ID),
  BASE_URL: JSON.stringify(
    process.env.BASE_URL || 'https://api.kloudless.com'),
  // used in authenticator js
  DEBUG: 'false'
}