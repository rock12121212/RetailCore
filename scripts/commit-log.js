import { execSync } from 'child_process';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const mongodbUri = process.env.MONGODB_URI;

if (!mongodbUri) {
  console.log('[commit-log] MONGODB_URI missing, skipping.');
  process.exit(0);
}

const getGitValue = (command) => {
  try {
    return execSync(command, { encoding: 'utf8' }).trim();
  } catch {
    return '';
  }
};

const commitHash = getGitValue('git rev-parse HEAD');
const commitMessage = getGitValue('git log -1 --pretty=%B');
const commitAuthor = getGitValue('git log -1 --pretty=%an');
const commitEmail = getGitValue('git log -1 --pretty=%ae');
const commitDate = getGitValue('git log -1 --pretty=%aI');
const repoRoot = getGitValue('git rev-parse --show-toplevel');

const commitLogSchema = new mongoose.Schema({
  hash: String,
  message: String,
  author: String,
  email: String,
  date: String,
  repoRoot: String,
  createdAt: { type: Date, default: Date.now },
});

const CommitLog = mongoose.model('CommitLog', commitLogSchema, 'commit_logs');

const logCommit = async () => {
  try {
    await mongoose.connect(mongodbUri, {
      serverSelectionTimeoutMS: 5000,
    });

    await CommitLog.create({
      hash: commitHash,
      message: commitMessage,
      author: commitAuthor,
      email: commitEmail,
      date: commitDate,
      repoRoot,
    });
  } catch (error) {
    console.log('[commit-log] Failed to log commit:', error?.message || error);
  } finally {
    await mongoose.disconnect().catch(() => undefined);
  }
};

logCommit().then(() => process.exit(0));
