# AWS S3 Storage Documentation

This project uses AWS S3 for storing media files (PDF notes, videos, etc.) to ensure scalability and reliability.

## 1. Storage Structure

Files are organized within the S3 bucket using prefixes (folders):

- `notes/`: Directory for PDF documents and study notes.
- `videos/`: Directory for MP4 and other video lecture files.

Each file is stored with a unique name format: `{timestamp}_{original_filename}`.

## 2. Configuration (Environment Variables)

The application uses `DefaultCredentialsProvider`, which means it will automatically find credentials in the following order:
1. Environment variables (`AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`).
2. **IAM Role** (Instance Profile) when running on **EC2** (Recommended).

| Variable | Description | Example | Required for IAM? |
|----------|-------------|---------|-------------------|
| `AWS_REGION` | AWS Region where bucket is located | `us-east-1` | **Yes** |
| `AWS_S3_BUCKET_NAME` | Name of the S3 bucket | `my-jesttprep-bucket` | **Yes** |
| `AWS_ACCESS_KEY_ID` | AWS IAM User Access Key | `AKIA...` | No |
| `AWS_SECRET_ACCESS_KEY` | AWS IAM User Secret Key | `SECRET...` | No |

## 3. Implementation Details

### Metadata
When a file is uploaded, the original filename is stored in the S3 object's user metadata as `original-filename`. This can be useful for auditing or recovery.

### Streaming
To maintain security and existing access controls, the backend serves files by fetching them from S3 and streaming them directly to the client. This means the S3 bucket can remain **private** (no public access required).

### Services
- `S3Config.java`: Initializes the `S3Client` bean.
- `FileStorageService.java`: Provides methods for `save`, `load`, and `delete` operations.

## 4. Troubleshooting

- **Access Denied**: Ensure the IAM user has `s3:PutObject`, `s3:GetObject`, and `s3:DeleteObject` permissions for the specified bucket and its objects (`arn:aws:s3:::bucket-name/*`).
- **Bucket Not Found**: Verify that the `AWS_S3_BUCKET_NAME` matches exactly and exists in the specified `AWS_REGION`.
- **Latency**: Large video files may take time to stream through the backend. For production, consider using CloudFront for delivery if performance becomes an issue.
