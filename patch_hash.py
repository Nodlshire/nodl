import json

hash_val = "$2a$10$B.oRhXWZQepaX93FgsPug.WzqzLw8fswUBl7wammPraIAdxr.YeL."

def patch(file_path, key):
    try:
        with open(file_path, "r") as f:
            data = json.load(f)
        if key in data and "100001-0426-02-AB" in data[key]:
            data[key]["100001-0426-02-AB"]["password"] = hash_val
            with open(file_path, "w") as f:
                json.dump(data, f, indent=2)
            print(f"Patched {file_path}")
    except Exception as e:
        print(f"Failed {file_path}: {e}")

patch("/var/wnode-data/crm/crm.json", "nodlrs")
patch("/home/obregan/Documents/nodl/state/engine.json", "nodlrs")
