## Repository Setup

First we have to create a Github Personal Access Token (PAT) by following these steps:

1. Go to GitHub Settings → Developer settings → Personal access tokens → Fine-grained tokens
2. Click "Generate new token"
3. Configure token:
   - Name: `crowdfunding-pro-sync` (or any other name)
   - Expiration: Choose `No expiration`
   - Repository access: Select `growfund` & `growfund-pro` repositories
   - Permissions:
     - Repository permissions:
       - Contents: Read and write
       - Metadata: Read-only
       - Workflows: Read and write
       - Pull requests: Read and write
4. Click "Generate token"
5. Copy the token immediately (it won't be shown again)
6. Store the token as a GitHub secret in source repository

Then store the PAT key into the `growfund` and `growfund-pro` repositories.

#### Store PAT into growfund repository

1. Go to `growfund` repository → Settings → Secrets and variables → Actions
2. Click "New repository secret"
3. Configure secret:
   - Name: `GROWFUND_SYNC_TOKEN_FREE`
   - Secret: Paste the PAT token copied from the earlier step
4. Click "Add secret"

#### Store PAT into growfund-pro repository

1. Go to `growfund-pro` repository → Settings → Secrets and variables → Actions
2. Click "New repository secret"
3. Configure secret:
   - Name: `GROWFUND_SYNC_TOKEN_PRO`
   - Secret: Paste the same PAT token copied from the earlier step
4. Click "Add secret"

## Trigger split request from the "growfund-pro" repository

Splitting of the free-only features and sending them into the free repository will be triggered by creating a tag with a `v*` prefixed tag name.
For initiating the splitting follow the steps:

1. `git tag -a v1.0.0 -m "Your release commit message"`
2. `git push origin v1.0.0`

Note: this will also be triggered by pushing the changing into the `split/pro-features` branch. But the tag creation is recommended.

## Trigger syncing the growfund changes into the growfund-pro repository

If the contributors contribute into the `growfund` repository and the contributions are accepted then we have to sync the `growfund` changes into the `growfund-pro` repository.
For doing that we have to push the latest changes into the `sync/to-growfund-pro` branch. That's all. A new PR will be created into the `growfund-pro` repository with the changes
of the `growfund` repository.
