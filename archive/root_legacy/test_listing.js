const { GET } = require('./apps/command/app/api/v1/nodlrs/route.js');

async function run() {
    const res = await GET();
    const data = await res.json();
    console.log("Returned records length:", data.length);
    
    // Check if test record is there (or actual records)
    const owner = data.find(r => r.wuid === "W-OWNER-TEST" || r.isOwner);
    if (owner) {
        console.log("Owner test record found. Badges present:");
        console.log("Owner:", owner.isOwner);
        console.log("Founder:", owner.isFounderOrPartner);
        console.log("CMD:", owner.isCommand);
        console.log("Mesh In:", owner.isMeshInt);
        console.log("Tech Founder:", owner.isTechFounder);
    } else {
        console.log("No owner record found!");
    }
}
run();
