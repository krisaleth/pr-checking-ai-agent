import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createAppAuth } from '@octokit/auth-app';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const appId = process.env.GITHUB_APP_ID;

const privateKeyPath = path.resolve(
  __dirname,
  '../..',
  process.env.GITHUB_APP_PRIVATE_KEY_PATH
);

const privateKey = fs.readFileSync(privateKeyPath, 'utf8');

const auth = createAppAuth({
  appId,
  privateKey,
});

export async function getInstallationToken(installationId) {
  const authentication = await auth({
    type: 'installation',
    installationId,
  });

  return authentication.token;
}