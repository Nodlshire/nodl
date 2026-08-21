-- Example nodls table entry for a Dummy VM
INSERT INTO nodls (
    id, 
    user_id, 
    node_name, 
    status, 
    cpu_specs, 
    gpu_specs, 
    ram_total, 
    uptime, 
    last_seen
) VALUES (
    '8f4a-2b3c-4d5e-6f7g-8h9i0j1k2l3m', -- id
    'your-user-id-uuid',                 -- user_id (links to auth.users)
    'VM_UBUNTU_NODE_01',                -- node_name
    'Active',                            -- status
    '{"cores": 8, "model": "Intel Xeon (Virtual)"}', -- cpu_specs (JSONB)
    '{"model": "None (Virtual)", "vram": "0GB"}',    -- gpu_specs (JSONB)
    '16GB',                              -- ram_total
    '48:22:15',                         -- uptime
    now()                                -- last_seen
);
