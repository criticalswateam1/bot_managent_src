module.exports = (client, app, paypal, webConfig, logChannel) => {
    
    app.post('/pay/monthlyhosted/clan', (req, res) => {
        const create_payment_json = {
            "intent": "sale",
            "payer": {
                "payment_method": "paypal"
            },
            "redirect_urls": {
                "return_url": `${webConfig.domain}/success/monthlyhosted/clan`,
                "cancel_url": `${webConfig.domain}/cancel`
            },
            "transactions": [{
                "item_list": {
                    "items": [{
                        "name": `Clan Bot Monthly Hosted`,
                        "sku": `302`,
                        "price": `2.00`,
                        "currency": `EUR`,
                        "quantity": 1
                    }]
                },
                "amount": {
                    "currency": `EUR`,
                    "total": `2.00`
                },
                "description": `Clan Bot Monthly Hosted`
            }]
        };
        paypal.payment.create(create_payment_json, function (error, payment) {
        if (error) {
            throw error;
        } else {
            for(let i = 0;i < payment.links.length;i++){
                if(payment.links[i].rel === 'approval_url'){
                    res.redirect(payment.links[i].href);
                }
            }
        }
        });
    });
    app.get('/success/monthlyhosted/clan', (req, res) => {
        const payerId = req.query.PayerID;
        const paymentId = req.query.paymentId;
        const execute_payment_json = {
          "payer_id": payerId,
          "transactions": [{
              "amount": {
                  "currency": `EUR`,
                  "total": `2.00`
              }
          }]
        };
        paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
          if (error) {
              console.log(error.response);
              throw error;
          } else {
              logChannel.send(`✅ **Successfully payed!** \` - \` <:clanbot:832697296687726654> **CLAN BOT**\n\n**PAYER:**\n> __Name:__ \`${payment.payer?.payer_info?.first_name} ${payment.payer?.payer_info?.last_name}\`\n> __Email:__ \`${payment.payer?.payer_info?.email}\`\n\n${payment.transactions.map(t => `> **Product:** \`${t.description}\`\n> **Price:** \`${t.amount.total}${t.amount.currency}\`\n`).join("\n")}`.substr(0, 2000))
              res.sendFile(`${process.cwd()}/modules/paypal/success/monthlyhosted/clan.html`)
          }
      });
    });
}