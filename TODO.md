# TODO: Fix Authentication Issue After Login

## Problem
After login, user selects city and time, clicks "Найти автосервисы", but gets redirected back to login page instead of seeing services.

## Root Cause
- No global handling for 401 unauthorized errors in frontend API client
- Possible token invalidation or loss on page reload/navigation
- Route mismatch: frontend calls '/service', backend has '/services'

## Steps
- [x] Add global axios interceptor in frontend/src/api/apiClient.ts to handle 401 errors by logging out user
- [x] Add debug logs in frontend/src/contexts/AuthContext.tsx for token storage/retrieval and user loading
- [x] Fix route in frontend/src/pages/services/ServiceListPage.tsx: change '/service' to '/services'
- [ ] Test login flow and navigation to services page
- [ ] Verify token persistence and API headers in browser dev tools
