# Mono Frontend Auth0 Integration Guide

This document outlines how to set up Auth0 authentication for the Mono frontend application.

## 🔧 Setup Instructions

### 1. Auth0 Configuration

Create a `.env.local` file in the root directory with the following variables:

```bash
# Auth0 Configuration
NEXT_PUBLIC_AUTH0_DOMAIN=your-auth0-domain.auth0.com
NEXT_PUBLIC_AUTH0_CLIENT_ID=your-auth0-client-id

# Backend URL
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
```

### 2. Auth0 Dashboard Setup

In your Auth0 Dashboard:

1. **Create a new Application**:
   - Application Type: "Single Page Application"
   - Name: "Mono Frontend"

2. **Configure Application Settings**:
   - **Allowed Callback URLs**: `http://localhost:3000/auth/callback`
   - **Allowed Logout URLs**: `http://localhost:3000/auth/signin`
   - **Allowed Web Origins**: `http://localhost:3000`

3. **Enable Google Social Connection**:
   - Go to Authentication > Social
   - Enable Google OAuth 2.0
   - Configure with your Google OAuth credentials

### 3. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Set authorized redirect URIs to your Auth0 callback:
   `https://your-auth0-domain.auth0.com/login/callback`

## 🔄 Authentication Flow

The application follows the exact flow outlined by your backend developer:

### Step 1: User Clicks "Sign in with Google"
- User lands on `/auth/signin`
- Clicks "Continue with Google" button

### Step 2: Frontend Asks Auth0 to Handle It
- `loginWithRedirect()` is called with Google connection
- Auth0 SDK handles the redirect to Auth0's servers

### Step 3: Auth0 Redirects User to Google
- Auth0 redirects to Google's OAuth consent screen
- User authenticates with Google

### Step 4: User Authenticates with Google
- Google handles authentication
- User grants permissions

### Step 5: Google Confirms User's Identity to Auth0
- Google redirects back to Auth0 with authorization code
- Auth0 exchanges code for user profile information

### Step 6: Auth0 Creates User Profile and Issues JWT
- Auth0 creates user profile in its database
- Issues access token (JWT) for your application

### Step 7: Auth0 Redirects Back to Frontend
- User is redirected to `/auth/callback`
- Frontend processes the authentication result

## 🛡️ Security Features

- **JWT Access Tokens**: Automatically managed by Auth0
- **Secure Token Storage**: Auth0 SDK handles token storage
- **Automatic Token Refresh**: Built-in token refresh mechanism
- **Session Management**: Auth0 manages user sessions

## 🚀 Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables (see above)

3. Start development server:
   ```bash
   npm run dev
   ```

4. Navigate to `http://localhost:3000`

## 📱 Application Pages

- **`/auth/signin`**: Auth0 sign-in page with Google OAuth
- **`/auth/callback`**: Handles Auth0 callback and token processing
- **`/`**: Main welcome page (protected)
- **`/onboarding`**: First onboarding step (protected)
- **`/income`**: Income collection page (protected)
- **`/rent`**: Rent collection page (protected)
- **`/debts`**: Debt collection page (protected)
- **`/loading`**: Data processing page (protected)

## 🔧 Technical Implementation

### Auth0 Provider
- Wraps entire application in `Auth0Provider`
- Configured in `app/layout.tsx`

### Authentication Hook
- Custom `useMonoAuth()` hook for consistent auth state
- Provides: `isAuthenticated`, `isLoading`, `user`, `signInWithGoogle`, `signOut`, `getAccessToken`

### Route Protection
- All protected pages check auth status
- Automatic redirect to sign-in if not authenticated
- Loading states during authentication checks

### Token Management
- Access tokens automatically included in backend API calls
- Tokens refresh automatically
- Secure storage handled by Auth0 SDK

## 🐛 Troubleshooting

### Common Issues

1. **"Auth0 configuration missing" error**:
   - Ensure `.env.local` file exists with correct variables
   - Check that domain and client ID are correct

2. **Redirect loop**:
   - Verify callback URL in Auth0 dashboard matches exactly
   - Check that the domain in environment variables matches Auth0 app

3. **Google authentication fails**:
   - Ensure Google social connection is enabled in Auth0
   - Verify Google OAuth credentials are configured correctly

### Debug Mode

Enable Auth0 debugging by adding to your environment:
```bash
AUTH0_DEBUG=true
```

---

## 📞 Support

If you need help with Auth0 setup, refer to:
- [Auth0 Documentation](https://auth0.com/docs)
- [Auth0 React SDK](https://auth0.com/docs/libraries/auth0-react)
- [Google OAuth Setup](https://developers.google.com/identity/protocols/oauth2)
