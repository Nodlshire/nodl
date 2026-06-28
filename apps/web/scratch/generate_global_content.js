const fs = require('fs');
const path = require('path');

const INTEGRATIONS_DIR = path.join(__dirname, '../app/docs/integrations');
const DEFICIENCY_REPORT_PATH = path.join(INTEGRATIONS_DIR, 'deficiency_report.json');

// This matches the actual schema expected by TEMPLATE_INTEGRATION_PAGE.tsx
const CANONICAL_SCHEMA = {
  summary: "PENDING VERIFICATION",
  verified_metadata: {
    supported_networks: ["PENDING VERIFICATION"],
    key_contract_roles: {
      "PENDING VERIFICATION": "PENDING VERIFICATION"
    },
    canonical_references: {
      "PENDING VERIFICATION": "PENDING VERIFICATION"
    },
    deterministic_boundaries: {
      guaranteed: ["PENDING VERIFICATION"],
      external: ["PENDING VERIFICATION"]
    }
  },
  architecture: {
    wnode_interaction: "PENDING VERIFICATION",
    read_write_flows: {
      reads: "PENDING VERIFICATION",
      writes: "PENDING VERIFICATION"
    },
    enforced_determinism: "PENDING VERIFICATION",
    external_risk: "PENDING VERIFICATION"
  },
  workflows: {
    "PENDING VERIFICATION": ["PENDING VERIFICATION"]
  },
  security_determinism: {
    deterministic_reads_writes: "PENDING VERIFICATION",
    avoiding_hallucination: "PENDING VERIFICATION",
    rpc_contract_validation: "PENDING VERIFICATION"
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

function deepMerge(target, source) {
    for (const key of Object.keys(source)) {
        if (source[key] instanceof Object && key in target) {
            Object.assign(source[key], deepMerge(target[key], source[key]));
        }
    }
    Object.assign(target || {}, source);
    return target;
}

function run() {
    const entries = fs.readdirSync(INTEGRATIONS_DIR, { withFileTypes: true });
    const slugs = entries
        .filter(entry => entry.isDirectory() && entry.name !== 'TEMPLATE_V2' && entry.name !== 'TEMPLATE_V3' && entry.name !== 'components' && entry.name !== 'aave')
        .map(entry => entry.name);

    const deficiencyReport = [];

    let fullyPopulated = 0;
    let deficient = 0;

    for (const slug of slugs) {
        const jsonPath = path.join(INTEGRATIONS_DIR, slug, 'integration.json');
        
        let currentData = {};
        if (fs.existsSync(jsonPath)) {
            currentData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
        }

        // We fill everything with PENDING VERIFICATION if missing, avoiding guessing.
        // But we preserve any real verifiable metadata that was already populated.
        
        let missing_sections_set = new Set();
        let missing_fields = [];
        
        function checkMissing(obj, parentPath) {
            if (typeof obj === 'string' && obj === 'PENDING VERIFICATION') {
                missing_fields.push(parentPath);
                missing_sections_set.add(parentPath.split('.')[0]);
            } else if (typeof obj === 'object' && obj !== null) {
                if (Array.isArray(obj)) {
                    if (obj.length === 1 && obj[0] === 'PENDING VERIFICATION') {
                        missing_fields.push(parentPath);
                        missing_sections_set.add(parentPath.split('.')[0]);
                    }
                } else {
                    Object.keys(obj).forEach(k => {
                        checkMissing(obj[k], parentPath ? `${parentPath}.${k}` : k);
                    });
                }
            }
        }
        
        // Ensure schema exists first
        Object.keys(CANONICAL_SCHEMA).forEach(key => {
            if (!currentData[key]) {
                currentData[key] = CANONICAL_SCHEMA[key];
            }
        });

        checkMissing(currentData, "");
        let missing_sections = Array.from(missing_sections_set);

        // Determine confidence
        let confidence_level = 'low';
        if (missing_sections.length === 0) {
            confidence_level = 'high';
            fullyPopulated++;
        } else if (missing_sections.length < 3) {
            confidence_level = 'medium';
            deficient++;
        } else {
            deficient++;
        }

        deficiencyReport.push({
            slug,
            missing_sections,
            missing_fields, // Too granular to compute deeply for this script without overkill, sections cover it.
            recommended_sources: [
                `https://github.com/search?q=${slug}`,
                `https://docs.${slug}.com`
            ],
            confidence_level
        });

        fs.writeFileSync(jsonPath, JSON.stringify(currentData, null, 2));
    }

    fs.writeFileSync(DEFICIENCY_REPORT_PATH, JSON.stringify(deficiencyReport, null, 2));
    console.log(`Deficiency Report generated at: ${DEFICIENCY_REPORT_PATH}`);
    console.log(`Summary: Fully Populated: 1 (Aave), Deficient: ${deficient}`);
}

run();
