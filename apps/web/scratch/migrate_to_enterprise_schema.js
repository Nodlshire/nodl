const fs = require('fs');
const path = require('path');

const INTEGRATIONS_DIR = path.join(__dirname, '../app/docs/v1.0/integrations');

function run() {
    const entries = fs.readdirSync(INTEGRATIONS_DIR, { withFileTypes: true });
    const integrations = entries
        .filter(entry => entry.isDirectory() && entry.name !== 'TEMPLATE_V2' && entry.name !== 'TEMPLATE_V3' && entry.name !== 'components')
        .map(entry => entry.name);

    const deficientList = [];

    for (const slug of integrations) {
        const jsonPath = path.join(INTEGRATIONS_DIR, slug, 'integration.json');
        if (!fs.existsSync(jsonPath)) continue;

        const rawData = fs.readFileSync(jsonPath, 'utf8');
        let data;
        try {
            data = JSON.parse(rawData);
        } catch (e) {
            console.error(`Failed to parse JSON for ${slug}`);
            continue;
        }

        // If it already has 'verified_metadata' or 'architecture', skip migration (e.g. Aave)
        if (data.verified_metadata || data.architecture) {
            continue;
        }

        // Migrate Old Schema to New Enterprise Schema
        const newSchema = {
            summary: data.displayName ? `${data.displayName} is a ${data.category || 'protocol'} integration.` : "PENDING VERIFICATION",
            verified_metadata: {
                supported_networks: data.chain ? data.chain.split(',').map(s => s.trim()) : ["PENDING VERIFICATION"],
                key_contract_roles: {
                    "Main Contract": data.contractAddress || "PENDING VERIFICATION"
                },
                canonical_references: {
                    "documentation": data.docLink || "PENDING VERIFICATION",
                    "github": data.githubRepo || "PENDING VERIFICATION"
                },
                deterministic_boundaries: {
                    guaranteed: data.deterministicGuarantees ? [data.deterministicGuarantees] : ["PENDING VERIFICATION"],
                    external: ["PENDING VERIFICATION"]
                }
            },
            architecture: {
                wnode_interaction: "Wnode acts as a stateless, deterministic execution layer using WASM.",
                read_write_flows: {
                    reads: "PENDING VERIFICATION",
                    writes: "PENDING VERIFICATION"
                },
                enforced_determinism: data.memoryPageUsage || "PENDING VERIFICATION",
                external_risk: data.failureModeBehaviour || "PENDING VERIFICATION"
            },
            workflows: {
                "core_operation": ["PENDING VERIFICATION"]
            },
            security_determinism: {
                deterministic_reads_writes: "All reads and writes are securely executed in deterministic WASM containers.",
                avoiding_hallucination: "PENDING VERIFICATION",
                rpc_contract_validation: data.rpcEndpoint ? `Validates via ${data.rpcEndpoint}` : "PENDING VERIFICATION"
            },
            economic_model: {
                interest_model: "PENDING VERIFICATION",
                wnode_job_exposure: "PENDING VERIFICATION",
                pricing_and_predictability: "PENDING VERIFICATION"
            },
            testing_validation: {
                deterministic_test_cases: ["PENDING VERIFICATION"],
                validation_strategies: ["PENDING VERIFICATION"],
                example_scenarios: ["PENDING VERIFICATION"]
            }
        };

        fs.writeFileSync(jsonPath, JSON.stringify(newSchema, null, 2));

        // Deficiency Check
        const missingSections = [];
        if (newSchema.summary === "PENDING VERIFICATION") missingSections.push("summary");
        if (newSchema.verified_metadata.supported_networks[0] === "PENDING VERIFICATION") missingSections.push("supported_networks");
        if (newSchema.verified_metadata.key_contract_roles["Main Contract"] === "PENDING VERIFICATION") missingSections.push("contracts");
        if (newSchema.workflows.core_operation[0] === "PENDING VERIFICATION") missingSections.push("workflows");
        if (newSchema.economic_model.interest_model === "PENDING VERIFICATION") missingSections.push("economic_model");
        if (newSchema.testing_validation.deterministic_test_cases[0] === "PENDING VERIFICATION") missingSections.push("testing_validation");

        if (missingSections.length > 0) {
            deficientList.push({
                name: data.displayName || slug,
                slug: slug,
                missing_sections: missingSections,
                recommended_source: data.docLink || data.githubRepo || ""
            });
        }
    }

    // Write deficient list
    const reportPath = path.join(INTEGRATIONS_DIR, 'deficient_integrations.json');
    fs.writeFileSync(reportPath, JSON.stringify(deficientList, null, 2));
    console.log(`Migrated ${integrations.length} integrations. Found ${deficientList.length} deficient protocols.`);
}

run();
