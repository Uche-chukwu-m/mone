# Google Authentication Integration

## Overview
The frontend has been set up to integrate with your backend's Google OAuth flow. Users will be redirected to sign in with Google before accessing the onboarding flow.

## Authentication Flow

### 1. Sign In Page (`/auth/signin`)
- Beautiful, minimalist design matching the Mono aesthetic
- Single "Continue with Google" button
- Redirects users to: `${BACKEND_URL}/auth/google`

### 2. Backend Integration Points

#### Required Backend Endpoints:

**OAuth Initiation:**
```
GET /auth/google
- Redirects user to Google OAuth
- Handles the OAuth flow as described in your documentation
```

**OAuth Callback (for your backend):**
```
GET /auth/callback
- Receives OAuth code from Google
- Exchanges for user info and creates JWT
- Redirects to frontend: http://localhost:3000/auth/callback?token=JWT_TOKEN
- On error: http://localhost:3000/auth/callback?error=ERROR_MESSAGE
```

**Token Verification:**
```
GET /auth/verify
Headers: Authorization: Bearer JWT_TOKEN
Response: { "valid": true, "user": { "id": "...", "email": "...", "name": "...", "picture": "..." } }
```

### 3. Frontend Callback Page (`/auth/callback`)
- Receives JWT token from URL parameters
- Stores token in localStorage
- Verifies token with backend
- Redirects to onboarding flow on success

### 4. Protected Routes
All onboarding pages now check for authentication:
- Redirects to `/auth/signin` if no token found
- Uses JWT for API calls to backend

## Configuration

### Environment Variables
Create a `.env.local` file with:
```
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
```

Update this URL to match your backend server.

## Frontend Auth Utilities

The `lib/auth.ts` file provides:
- `authUtils.isAuthenticated()` - Check if user is signed in
- `authUtils.getToken()` - Get JWT token
- `authUtils.getUser()` - Get user data
- `authUtils.signInWithGoogle()` - Redirect to Google OAuth
- `authUtils.signOut()` - Clear auth and redirect to sign-in

## User Flow

1. User visits any page (/, /onboarding, etc.)
2. If not authenticated → Redirect to `/auth/signin`
3. User clicks "Continue with Google"
4. Redirect to backend: `${BACKEND_URL}/auth/google`
5. Backend handles Google OAuth
6. Backend redirects to: `http://localhost:3000/auth/callback?token=JWT`
7. Frontend stores token and verifies with backend
8. User proceeds to onboarding flow

## Testing

To test the integration:
1. Make sure your backend is running on the configured URL
2. Visit `http://localhost:3000`
3. Should redirect to sign-in page
4. Click "Continue with Google"
5. Complete OAuth flow
6. Should return to onboarding

## Notes for Backend Developer

- The frontend expects the OAuth callback URL to include the JWT as a query parameter: `?token=JWT_TOKEN`
- On authentication errors, include: `?error=ERROR_MESSAGE`
- The `/auth/verify` endpoint should validate the JWT and return user information
- All protected API calls from frontend will include: `Authorization: Bearer JWT_TOKEN`

The frontend is now ready to integrate with your backend OAuth implementation!
