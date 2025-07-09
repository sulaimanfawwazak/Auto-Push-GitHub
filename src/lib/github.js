import { Octokit } from "@octokit/rest";
import dotenv from 'dotenv';
import { execOnce } from "next/dist/shared/lib/utils";

dotenv.config({ path: './.env' });

const octokit = new Octokit({
  auth: process.env.GITHUB_PAT_CLASSIC
});

export async function createCommit({
  owner,
  repo,
  filePath,
  content,
  commitMessage,
  branch = "main"
}) {
  try {
    // 1. Get latest commit SHA and tree SHA
    const { data: refData } = await octokit.git.getRef({
      owner, 
      repo, 
      ref: `heads/${branch}`,
    });

    const latestCommitSHA = refData.object.sha;

    const { data: commitData } = await octokit.git.getCommit({
      owner,
      repo,
      commit_sha: latestCommitSHA,
    });

    const baseTreeSHA = commitData.tree.sha;

    // 2. Create a new blob (file content)
    const { data: blobData } = await octokit.git.createBlob({
      owner,
      repo,
      content: Buffer.from(content).toString("base64"),
      encoding: "base64",
    });

    // 3. Create a new tree
    const { data: newTree } = await octokit.git.createTree({
      owner,
      repo,
      base_tree: baseTreeSHA,
      tree: [
        {
          path: filePath,
          mode: "100644", // Regular file
          type: "blob",
          sha: blobData.sha,
        },
      ],
    });

    // 4. Create a new commit
    const { data: newCommit } = await octokit.git.createCommit({
      owner,
      repo,
      message: commitMessage,
      tree: newTree.sha,
      parents: [latestCommitSHA],
    });

    // 5. Update the reference (push)
    await octokit.git.updateRef({
      owner,
      repo,
      ref: `heads/${branch}`,
      sha: newCommit.sha,
    });

    return newCommit;
  }
  catch (error) {
    console.error("GitHub commit failed:", error);
    throw new Error(`GitHub Error: ${error.message}`);
  }
}