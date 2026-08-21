async function run() {
    try {
        const pricingRes = await fetch(`http://localhost:3003/api/v1/meta/tiers`);
        console.log(`Mesh Pricing Status: ${pricingRes.status}`);
        const data = await pricingRes.json();
        console.log(`Mesh Pricing Data:`, data);
    } catch (e) {
        console.error(`Error:`, e.message);
    }
}
run();
