var CronJob = require('cron').CronJob;
const Discord = require("discord.js");
const emoji = require("../../emoji")
module.exports = client => {

  var job3 = new CronJob('0 */15 * * * *', function () {
    client.channels.fetch(`${mainconfig.OrdersChannelID.TicketChannelID}`).then(ch => {
      ch.messages.fetch(`${mainconfig.OrdersChannelID.TicketMessageID}`).then(async msg => {
        let allmembers = await msg.guild.members.fetch();
        let onlinesupporters = [
          ...allmembers.filter(m => !m.user.bot && m.roles.highest.rawPosition >= msg.guild.roles.cache.get(`${mainconfig.SeverRoles.NewSupporterRoleId}`).rawPosition)
          .filter(m => m.presence)
          .values()
        ]

        if (!onlinesupporters || onlinesupporters.length == 0) onlinesupporters = ["Noone Online :cry:"]
        if (msg.embeds[0].fields && msg.embeds[0].fields.length > 0) {
          msg.embeds[0].fields[0].name = `<a:online:1075486861960679425> **[${onlinesupporters.length}] Supporters online:**`;
          msg.embeds[0].fields[0].value = onlinesupporters.length > 25 ? +onlinesupporters.slice(0, 25).join(", ") + `, ${onlinesupporters.length - 25} ***More...***` : onlinesupporters.join(", ");
        } else {
          msg.embeds[0].addField(`<a:online:1075486861960679425> **[${onlinesupporters.length}] Online Supporter:**`, onlinesupporters.length > 25 ? +onlinesupporters.slice(0, 25).join(", ") + `, ${onlinesupporters.length - 25} ***More...***` : onlinesupporters.join(", "))
        }
        msg.edit({
          embeds: [msg.embeds[0]]
        }).catch((e) => {
          console.warn(e.stack ? String(e.stack).grey : String(e).grey)
        });
      }).catch((e) => {
        console.warn(e.stack ? String(e.stack).grey : String(e).grey)
      });
    }).catch((e) => {
      console.warn(e.stack ? String(e.stack).grey : String(e).grey)
    });

    //WAIt 1 minute before editing the second message
    setTimeout(async () => {

      //ORDER MESSAGE
      client.channels.fetch("1075477021456617483").then(ch => {
        ch.messages.fetch("881566678922698802").then(async msg => {
          let allmembers = await msg.guild.members.fetch();
          let onlinesupporters = [
            ...allmembers.filter(m => !m.user.bot && m.roles.highest.rawPosition >= msg.guild.roles.cache.get(`${mainconfig.SeverRoles.NewSupporterRoleId}`).rawPosition)
            .filter(m => m.presence)
            .values()
          ]

          if (!onlinesupporters || onlinesupporters.length == 0) onlinesupporters = ["Noone Online :cry:"]
          if (msg.embeds[0].fields && msg.embeds[0].fields.length > 0) {
            msg.embeds[0].fields[0].name = `<a:online:1075486861960679425> **[${onlinesupporters.length}] Supporters online:**`;
            msg.embeds[0].fields[0].value = onlinesupporters.length > 25 ? +onlinesupporters.slice(0, 25).join(", ") + `, ${onlinesupporters.length - 25} ***More...***` : onlinesupporters.join(", ");
          } else {
            msg.embeds[0].addField(`<a:online:1075486861960679425> **[${onlinesupporters.length}] Online Supporter:**`, onlinesupporters.length > 25 ? +onlinesupporters.slice(0, 25).join(", ") + `, ${onlinesupporters.length - 25} ***More...***` : onlinesupporters.join(", "))
          }
          msg.edit({
            embeds: [msg.embeds[0]]
          }).catch((e) => {
            console.warn(e.stack ? String(e.stack).grey : String(e).grey)
          });
        }).catch((e) => {
          console.warn(e.stack ? String(e.stack).grey : String(e).grey)
        });
      }).catch((e) => {
        console.warn(e.stack ? String(e.stack).grey : String(e).grey)
      });
    }, 1 * 60 * 1000)
  }, null, true, 'Europe/Berlin');

  client.on("ready", () => {
    job3.start();
  })
}