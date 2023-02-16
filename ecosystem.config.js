module.exports = {
    apps : [{
      name: `ClanBot_${require('path').resolve(__dirname).split("/")[3]}`,
      script: 'index.js',
      cron_restart: "0 1 * * *"
    }]
  };
