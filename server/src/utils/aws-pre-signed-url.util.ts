import { Hash } from '@aws-sdk/hash-node';
import { HttpRequest } from '@aws-sdk/protocol-http';
import { S3RequestPresigner } from '@aws-sdk/s3-request-presigner';
import { parseUrl } from '@aws-sdk/url-parser';
import { formatUrl } from '@aws-sdk/util-format-url';

class AwsPreSignedUrlUtil {

  public createTemporarySignedPUTUrl = async(key: string): Promise<string> => {

    const region = process.env.AWS_REGION || '';
    const accessKeyId = process.env.AWS_ACCESS_KEY_ID || '';
    const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY || '';
    const credentials = {
      accessKeyId,
      secretAccessKey
    };
    const s3ObjectUrl = parseUrl(`https://${process.env.AWS_BUCKET_NAME}.s3.${region}.amazonaws.com/${process.env.AWS_DOCUMENTS_BASE_PATH}${key}`);
    const presigner = new S3RequestPresigner({
      credentials,
      region,
      sha256: Hash.bind(null, 'sha256'),
    });
    const url = await presigner.presign(new HttpRequest({
      ...s3ObjectUrl,
      method: 'PUT'
    }), { expiresIn: Number(process.env.TEMP_PUT_URL_EXPIRY) });
    const signedPutUrl = formatUrl(url);
    return signedPutUrl;

  }

  public createTemporarySignedGETUrl = async(key: string): Promise<string> => {

    const region = process.env.AWS_REGION || '';
    const accessKeyId = process.env.AWS_ACCESS_KEY_ID || '';
    const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY || '';
    const credentials = {
      accessKeyId,
      secretAccessKey
    };
    const s3ObjectUrl = parseUrl(`https://${process.env.AWS_BUCKET_NAME}.s3.${region}.amazonaws.com/${process.env.AWS_DOCUMENTS_BASE_PATH}${key}`);
    const presigner = new S3RequestPresigner({
      credentials,
      region,
      sha256: Hash.bind(null, 'sha256'),
    });
    const url = await presigner.presign(
      new HttpRequest(s3ObjectUrl), { expiresIn: Number(process.env.TEMP_GET_URL_EXPIRY) });
    const signedPutUrl = formatUrl(url);
    return signedPutUrl;

  }

}

export const awsPreSignedUrlUtil = new AwsPreSignedUrlUtil();
