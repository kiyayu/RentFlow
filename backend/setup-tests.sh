#!/bin/bash
# setup-tests.sh — creates the full test folder structure with placeholder files

set -e

# Unit tests
mkdir -p test/unit/auth
touch test/unit/auth/auth.helpers.test.ts
touch test/unit/auth/deviceLabel.test.ts

# Integration tests
mkdir -p test/integration/auth
touch test/integration/auth/register.test.ts
touch test/integration/auth/login.test.ts
touch test/integration/auth/refreshToken.test.ts
touch test/integration/auth/logout.test.ts
touch test/integration/auth/forgotPassword.test.ts
touch test/integration/auth/resetPassword.test.ts
touch test/integration/auth/verifyOtp.test.ts
touch test/integration/auth/resendOtp.test.ts
touch test/integration/auth/changePassword.test.ts
touch test/integration/auth/sessions.test.ts

mkdir -p test/integration/user
touch test/integration/user/getProfile.test.ts
touch test/integration/user/updateProfile.test.ts
touch test/integration/user/changeEmail.test.ts
touch test/integration/user/deactivate.test.ts
touch test/integration/user/hardDelete.test.ts
touch test/integration/user/listUsers.test.ts

# E2E tests
mkdir -p test/e2e/auth
touch test/e2e/auth/fullAuthFlow.test.ts

# Fixtures — reusable fake data
mkdir -p test/fixtures
touch test/fixtures/users.ts

# Helpers — reusable setup/teardown plumbing
mkdir -p test/helpers
touch test/helpers/testDb.ts
touch test/helpers/testApp.ts

echo "Test folder structure created:"
find test -type f | sort
