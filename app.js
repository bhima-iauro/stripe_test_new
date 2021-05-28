// Create an instance of the Stripe object with your publishable API key
//1
var stripe = Stripe("pk_test_51InLUmSCDDhXqQs2iB1a4z3XIFFDwlp7BacSlm75KfFxRyhYzS06OVVfVMqH2j1oVj5St1ICRtKf1TqC2MbdKAix00ZY5NAcTc");

var checkoutButton = document.getElementById("checkout-button");
//2
var paymentRequest = stripe.paymentRequest({
  country: 'US',
  currency: 'inr',
  total: {
    label: 'Demo total',
    amount: 100,
  },
  requestPayerName: true,
  requestPayerEmail: true,
});
var elements = stripe.elements();
var prButton = elements.create('paymentRequestButton', {
  paymentRequest: paymentRequest,
});

// Check the availability of the Payment Request API first.
paymentRequest.canMakePayment().then(function(result) {
  console.log("canMakePayment ", result);
  if (result) {
    // alert("canmakepayment");
   prButton.mount('#payment-request-button');
    // Replace the instruction.
    document.querySelector('.instruction span').innerText = 'Or ';
    // Show the payment request section.
    // document.getElementById('payment-form').classList.add('visible');
    // prButton.mount('#payment-request-button');
  } else {
    alert("can't make payment");
    document.getElementById('payment-request-button').style.display = 'none';
  }
 });
// Disable the button until we have Stripe set up on the page
// document.querySelector("button").disabled = true;
  var urlencoded = new URLSearchParams();
      urlencoded.append("amount", '100');
      urlencoded.append("currency", 'inr');
      urlencoded.append("publishableKey","pk_test_51InLUmSCDDhXqQs2iB1a4z3XIFFDwlp7BacSlm75KfFxRyhYzS06OVVfVMqH2j1oVj5St1ICRtKf1TqC2MbdKAix00ZY5NAcTc");

fetch("https://external.iauro.com/stripe/create-payment-intent", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body : urlencoded,
  
  headers: {"Content-type": "application/x-www-form-urlencoded",
        "Access-Control-Allow-Credentials":true,
        "Access-Control-Allow-Origin":"*",
        "Access-Control-Allow-Methods":["POST","GET"],
       "Access-Control-Allow-Headers":'Content-Type'}
})
  .then(function(result) {
    return result.json();
  })
  .then(function(data) {
    return setupElements(data);
  })
  .then(function({ stripe, clientSecret }) {
    // document.querySelector("button").disabled = false;
    paymentRequest.on('paymentmethod', function(ev) {
  // Confirm the PaymentIntent without handling potential next actions (yet).
  stripe.confirmCardPayment(
    clientSecret,
    {payment_method: ev.paymentMethod.id},
    {handleActions: false}
  ).then(function(confirmResult) {
    console.log("success result", confirmResult)
    if (confirmResult.error) {
      // Report to the browser that the payment failed, prompting it to
      // re-show the payment interface, or show an error message and close
      // the payment interface.
      ev.complete('fail');
    } else {
      // Report to the browser that the confirmation was successful, prompting
      // it to close the browser payment method collection interface.
      ev.complete('success');
      // Check if the PaymentIntent requires any actions and if so let Stripe.js
      // handle the flow. If using an API version older than "2019-02-11" instead
      // instead check for: `paymentIntent.status === "requires_source_action"`.
      if (confirmResult.paymentIntent.status === "requires_action") {
        // Let Stripe.js handle the rest of the payment flow.
        stripe.confirmCardPayment(clientSecret).then(function(result) {
          if (result.error) {
            // The payment failed -- ask your customer for a new payment method.
            alert(" payment failed! use another payment method");
          } else {
            alert("payment Success");
            // tr_id,amt,payment_method,time,status
      

//       paymentIntent:
// amount: 100
// canceled_at: null
// cancellation_reason: null
// capture_method: "automatic"
// client_secret: "pi_1IvxlKSCDDhXqQs2SG5iSVsk_secret_aYYGyus99JJrjTdsgQNuV6nxx"
// confirmation_method: "automatic"
// created: 1622177854
// currency: "inr"
// description: null
// id: "pi_1IvxlKSCDDhXqQs2SG5iSVsk"
// last_payment_error: null
// livemode: false
// next_action: null
// object: "payment_intent"
// payment_method: "pm_1IvxlzSCDDhXqQs2D7zvb8NN"
// payment_method_types: Array(1)
// 0: "card"
// length: 1
// __proto__: Array(0)
// receipt_email: null
// setup_future_usage: null
// shipping: null
// source: null
// status: "succeeded"
            document.getElementById("payment_success_details").style.display= "block";
            var milis = confirmResult.paymentIntent.created;
            var date = new Date(milis);
            var time = date.toString();
            document.getElementById("tr_id").innerText = confirmResult.paymentIntent.id;
            document.getElementById("amt").innerText = confirmResult.paymentIntent.amount;
            document.getElementById("payment_method").innerText = confirmResult.paymentIntent.payment_method_types[0];
            document.getElementById("time").innerText = time;
            document.getElementById("status").innerText = confirmResult.paymentIntent.status;
          }
        });
      } else {
        // The payment has succeeded.
        alert("payment successfull");
        var milis = confirmResult.paymentIntent.created;
        var date = new Date(milis);
        var time = date.toString();
        document.getElementById("tr_id").innerText = confirmResult.paymentIntent.id;
        document.getElementById("amt").innerText = confirmResult.paymentIntent.amount;
        document.getElementById("payment_method").innerText = confirmResult.paymentIntent.payment_method_types[0];
        document.getElementById("time").innerText = time;
        document.getElementById("status").innerText = confirmResult.paymentIntent.status;
      }
    }
  });
});
  
  });

// Set up Stripe.js and Elements to use in checkout form
var setupElements = function(data) {
  stripe = Stripe(data.publishableKey);
 
  return {
    stripe: stripe,
    clientSecret: data.clientSecret
  };
};

//1
checkoutButton.addEventListener("click", function () {
  var YOUR_DOMAIN = window.location.origin// it will get your actual domain
  var urlencoded = new URLSearchParams();
  urlencoded.append("payment_method_types", 'card');
  
  urlencoded.append("success_url", `${YOUR_DOMAIN}/success.html`);
  urlencoded.append("cancel_url", `${YOUR_DOMAIN}/cancel.html`);
 // urlencoded.append("success_url", "https://preview.wem.io/29822/static/files/94322/success.html");
 // urlencoded.append("cancel_url", "https://preview.wem.io/29822/static/files/94323/cancel.html");
  
  urlencoded.append("currency", "inr");
  urlencoded.append("product_name", "Stubborn Attachments");
  urlencoded.append("product_image", "https://i.imgur.com/EHyR2nP.png");
  urlencoded.append("unit_amount", 1500);
  urlencoded.append("quantity", 1);
  urlencoded.append("stripe_secret_key", "sk_test_51InLUmSCDDhXqQs23fv9r6Ngu61NoJKjzEf4vC8ERltT44qqQ5wF22Ecm35sGGmYep4M6WXDhozIJ9mgZd14Iyzv00bikCEWs1");

fetch("https://external.iauro.com/stripe/create-checkout-session", {
    method: "POST",
    body : urlencoded,
    headers: {"Content-type": "application/x-www-form-urlencoded",
    "Access-Control-Allow-Credentials":true,
    "Access-Control-Allow-Origin":"*",
    "Access-Control-Allow-Methods":["POST","GET"],
   "Access-Control-Allow-Headers":'Content-Type'}
  })
    .then(function (response) {
        return response.json();
    })
    .then(function (result) {
      if (result.error) {
        console.log("error ", result.error)
       alert(result.error.message || result.error.code)
      }else {
        return stripe.redirectToCheckout({ sessionId: result.id });
      }
    })
    .catch(function (error) {
      alert("ERR: ",error);
      console.log("error frontend2 ",error)
    });

  });
function hide_checkout(){
  document.getElementById("container").style.display="none";
}
