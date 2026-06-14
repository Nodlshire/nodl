export async function checkStatus() {
  const secretKey = process.env.STRIPE_SECRET_KEY || '';
  if (!secretKey) {
    console.log("No STRIPE_SECRET_KEY provided, skipping live ping.");
    return false;
  }
  
  try {
    const res = await fetch('https://api.stripe.com/v1/payment_intents?limit=1', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${secretKey}`
      }
    });
    
    if (res.status === 200) {
      console.log("Stripe Status: ONLINE (API Keys valid)");
      return true;
    } else {
      const err = await res.json();
      console.error("Stripe Status Error:", err);
      return false;
    }
  } catch (error) {
    console.error("Stripe Network Error:", error);
    return false;
  }
}
