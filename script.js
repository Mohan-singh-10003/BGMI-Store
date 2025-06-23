// script.js
function payNow(product, amount) {
  const options = {
    key: "rzp_test_xxxxxxxxxx", // Replace with your Razorpay key
    amount: amount * 100,
    currency: "INR",
    name: "BGMI UC Store",
    description: product,
    handler: function (response) {
      alert("Payment Successful! ID: " + response.razorpay_payment_id);
      fetchAndDeliverCode(product);
    },
    theme: { color: "#ffcc00" }
  };
  const rzp = new Razorpay(options);
  rzp.open();
}

function fetchAndDeliverCode(product) {
  const db = firebase.database();
  const codesRef = db.ref("codes/" + product);

  codesRef.once("value", (snapshot) => {
    const allCodes = snapshot.val();
    let codeToGive = null;
    for (const key in allCodes) {
      if (!allCodes[key].used) {
        codeToGive = { id: key, code: allCodes[key].code };
        break;
      }
    }

    if (codeToGive) {
      // Mark as used
      codesRef.child(codeToGive.id).update({ used: true });

      // Show code to user
      alert("Your code: " + codeToGive.code);
    } else {
      alert("Out of stock! Please contact admin.");
    }
  });
}
