module.exports = (client, app, paypal, webConfig, logChannel) => {
    
    app.post('/pay/yearlyhosted/waitingroom', (req, res) => {
        const create_payment_json = {
            "intent": "sale",
            "payer": {
                "payment_method": "paypal"
            },
            "redirect_urls": {
                "return_url": `${webConfig.domain}/success/yearlyhosted/waitingroom`,
                "cancel_url": `${webConfig.domain}/cancel`
            },
            "transactions": [{
                "item_list": {
                    "items": [{
                        "name": `Waitingroom Bot Yearly Hosted`,
                        "sku": `305`,
                        "price": `5.00`,
                        "currency": `EUR`,
                        "quantity": 1
                    }]
                },
                "amount": {
                    "currency": `EUR`,
                    "total": `5.00`
                },
                "description": `Waitingroom Bot Yearly Hosted`
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
    app.get('/success/yearlyhosted/waitingroom', (req, res) => {
        const payerId = req.query.PayerID;
        const paymentId = req.query.paymentId;
        const execute_payment_json = {
          "payer_id": payerId,
          "transactions": [{
              "amount": {
                  "currency": `EUR`,
                  "total": `5.00`
              }
          }]
        };
        paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
          if (error) {
              console.log(error.response);
              throw error;
          } else {
              logChannel.send(`✅ **Successfully payed!** \` - \` <:Public_Waitingroom:867718814015684618> **WAITINGROOM BOT**\n\n**PAYER:**\n> __Name:__ \`${payment.payer?.payer_info?.first_name} ${payment.payer?.payer_info?.last_name}\`\n> __Email:__ \`${payment.payer?.payer_info?.email}\`\n\n${payment.transactions.map(t => `> **Product:** \`${t.description}\`\n> **Price:** \`${t.amount.total}${t.amount.currency}\`\n`).join("\n")}`.substr(0, 2000))
              res.sendFile(`${process.cwd()}/modules/paypal/success/yearlyhosted/waitingroom.html`)
          }
      });
    });
}