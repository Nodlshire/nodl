# Google Vision API → Wnode Integration

## Overview

Google Cloud Vision API provides pre-trained ML models for image understanding. This integration positions Wnode as a pre- and post-processing orchestration layer: Wnode prepares images, sends them to Vision API for analysis, and consumes the structured results for downstream pipelines.

## Use Cases

- **Document processing**: Wnode receives documents → Vision OCR extracts text → Wnode structures and stores.
- **Content moderation**: Images uploaded → Wnode sends to SafeSearch → routes based on classification.
- **Product cataloging**: Product photos → Vision labels + object detection → Wnode builds catalog entries.
- **Accessibility**: Images → Vision API description → Wnode generates alt-text.

## Setup

### Prerequisites

- GCP project with Vision API enabled (`vision.googleapis.com`)
- Service account with `roles/cloudvision.user`
- Wnode cluster running

### Step 1 — Enable Vision API

```bash
gcloud services enable vision.googleapis.com --project=<PROJECT_ID>
```

### Step 2 — Configure Wnode pipeline

Set the service account credentials and project in Wnode:

```bash
export GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json
export GCP_PROJECT_ID=<PROJECT_ID>
```

## Configuration

| Field | Type | Required | Description |
|---|---|---|---|
| `gcp_service_account_json` | string | Yes | Service account key JSON |
| `gcp_project_id` | string | Yes | GCP project ID |
| `vision_features` | string[] | No | Features to detect (default: all) |
| `max_results` | int | No | Max results per feature (default: 10) |

## Example Pipeline

```
Image Input → Wnode Preprocess (resize/format) → Vision API → Wnode Postprocess → Output
```

### Vision annotation (Python)

```python
from google.cloud import vision

def annotate_image(image_path):
    client = vision.ImageAnnotatorClient()
    with open(image_path, 'rb') as f:
        content = f.read()
    image = vision.Image(content=content)
    response = client.annotate_image({
        'image': image,
        'features': [
            {'type_': vision.Feature.Type.LABEL_DETECTION, 'max_results': 10},
            {'type_': vision.Feature.Type.TEXT_DETECTION},
            {'type_': vision.Feature.Type.SAFE_SEARCH_DETECTION}
        ]
    })
    return {
        'labels': [l.description for l in response.label_annotations],
        'text': response.full_text_annotation.text if response.full_text_annotation else '',
        'safe_search': {
            'adult': response.safe_search_annotation.adult.name,
            'violence': response.safe_search_annotation.violence.name
        }
    }
```

## Limits

| Limit | Value |
|---|---|
| Image size | 20 MB (inline), 2 GB (GCS URI) |
| Requests/minute | 1,800 (default quota) |
| Batch size | 16 images per request |
| Features per image | 14 types available |

## Notes

- For large images, upload to GCS first and pass the `gs://` URI instead of inline bytes.
- Vision API pricing is per-feature per-image. Wnode can cache results to reduce costs.
- Use batch annotation for processing multiple images in a single API call.
