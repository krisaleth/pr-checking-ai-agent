import 'dotenv/config';
import { getInstallationToken } from '../src/services/github-app.service.js';

const installationId = 162980399;

try {
  const token = await getInstallationToken(installationId);

  console.log('GitHub App authentication: SUCCESS');
  console.log('Token received:', `${token.slice(0, 8)}...`);

  process.exit(0);
} catch (err) {
  console.error('GitHub App authentication: FAILED');

  if (err.response?.data) {
    console.error(err.response.data);
  } else {
    console.error(err.message);
  }

  process.exit(1);
}