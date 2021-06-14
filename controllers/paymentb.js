const braintree = require("braintree");

const gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: "c7hsr369w6qfc9hq",
  publicKey: "52xdyzcs4mm8jkxm",
  privateKey: "3cc458bb163e6de0d52ea1dc28bd4a3c"
});

exports.getToken =(req,res) =>{
    gateway.clientToken.generate({}, (err, response) => {
        // pass clientToken to your front-end
        if(err){
            res.status(500).send(err);
        }
        else{
            res.send(response);
        }
      });
}

exports.processPayment =(req,res) =>{
    let nonceFromTheClient = req.body.paymentMethodNonce;
    let amountFromTheClient = req.body.amount;
    gateway.transaction.sale({
        amount: amountFromTheClient,
        paymentMethodNonce: nonceFromTheClient,
    
        options: {
          submitForSettlement: true
        }
      }, (err, result) => {
          if(err){
              res.status(500).send(err);
          }
          else{
              res.send(result);
          }
      });
}