# Instagram Platform API Integration Guide (Oct 2025)

This guide provides complete setup instructions for Instagram integration using the **Instagram Platform API** (Instagram Direct Login) that launched in July 2024.

## Overview

The Instagram Platform API allows direct authentication with Instagram accounts without requiring a Facebook Page connection. This implementation supports both Business and Creator accounts for content publishing.

## Prerequisites

1. **Instagram Professional Account** (Business or Creator)
2. **Meta Developer Account**
3. **Instagram App** (not Facebook App)

## Step 1: Convert to Instagram Professional Account

1. Open Instagram app on your phone
2. Go to **Settings → Account Type and Tools**
3. Select **Switch to Professional Account**
4. Choose **Business** or **Creator**
5. Complete the industry selection and setup process

**Note**: Both Business and Creator accounts work with the Instagram Platform API.

## Step 2: Create Instagram App

1. Go to [Meta Developers](https://developers.facebook.com/)
2. Click **"Create App"**
3. Choose **"Business"** as app type
4. Fill in app details:
   - App Name: Your app name
   - Contact Email: Your email
   - App Purpose: Social media management/content publishing

## Step 3: Configure Instagram Platform

1. In your app dashboard, click **"Add Product"**
2. Find **"Instagram Platform"** and click **"Set Up"**
3. Choose **"Instagram API with Instagram Login"**
4. Configure OAuth redirect URIs:
   - Development: `http://localhost:8000/api/instagram/oauth-callback`
   - Production: `https://yourdomain.com/api/instagram/oauth-callback`

### Required Permissions

Configure these permissions in your Instagram app:
- `instagram_business_basic` - Basic profile information
- `instagram_business_content_publish` - Content publishing

## Step 4: Get App Credentials

1. Go to **Instagram → API Setup with Instagram Login**
2. Copy the following credentials:
   - **Instagram App ID** (not Facebook App ID)
   - **Instagram App Secret**

## Step 5: Environment Configuration

Set up your environment variables:

```env
# Instagram Platform API Configuration
INSTAGRAM_APP_ID=your_instagram_app_id
INSTAGRAM_APP_SECRET=your_instagram_app_secret
INSTAGRAM_GRAPH_API_VERSION=v24.0
INSTAGRAM_REDIRECT_URI=http://localhost:8000/api/instagram/oauth-callback

# Frontend URL for OAuth redirects
FRONTEND_URL=http://localhost:3000
```

## Step 6: Database Models

### Instagram Account Model

```python
from sqlalchemy import Column, String, Boolean, DateTime, Integer
from sqlalchemy.dialects.postgresql import UUID
import uuid
from datetime import datetime

class InstagramAccount(Base):
    __tablename__ = "instagram_accounts"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(String, nullable=False)
    product_id = Column(String, nullable=False)
    instagram_business_account_id = Column(String, nullable=True)  # For Business API compatibility
    instagram_user_id = Column(String, nullable=False)  # The actual Instagram account ID
    access_token = Column(String, nullable=False)
    username = Column(String, nullable=False)
    name = Column(String, nullable=True)
    profile_picture_url = Column(String, nullable=True)
    followers_count = Column(Integer, nullable=True)
    is_active = Column(Boolean, default=True)
    auto_post = Column(Boolean, default=False)
    token_expires_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
```

### Instagram Post Model

```python
from sqlalchemy import Column, String, DateTime, Integer, Text
from sqlalchemy.dialects.postgresql import UUID
import uuid
from datetime import datetime
from enum import Enum

class InstagramPostStatus(str, Enum):
    PENDING = "pending"
    POSTED = "posted"
    FAILED = "failed"
    SCHEDULED = "scheduled"

class InstagramPost(Base):
    __tablename__ = "instagram_posts"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    instagram_account_id = Column(UUID(as_uuid=True), ForeignKey("instagram_accounts.id"))
    post_id = Column(UUID(as_uuid=True))  # Your app's post ID
    caption = Column(Text, nullable=False)
    image_url = Column(String, nullable=False)
    hashtags = Column(String, nullable=True)
    status = Column(String, default=InstagramPostStatus.PENDING)
    instagram_media_id = Column(String, nullable=True)
    instagram_permalink = Column(String, nullable=True)
    scheduled_for = Column(DateTime, nullable=True)
    posted_at = Column(DateTime, nullable=True)
    error_message = Column(Text, nullable=True)
    retry_count = Column(Integer, default=0)
    last_retry_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
```

## Step 7: OAuth Service Implementation

### OAuth Service Class

```python
import httpx
from typing import Optional, Dict, Any
from datetime import datetime, timedelta
from urllib.parse import urlencode

class InstagramOAuthService:
    def __init__(self):
        self.app_id = os.getenv('INSTAGRAM_APP_ID')
        self.app_secret = os.getenv('INSTAGRAM_APP_SECRET')
        self.redirect_uri = os.getenv('INSTAGRAM_REDIRECT_URI')

    def get_auth_url(self, state: str) -> str:
        """Generate the OAuth authorization URL for Instagram Platform API"""
        params = {
            'client_id': self.app_id,
            'redirect_uri': self.redirect_uri,
            'scope': 'instagram_business_basic,instagram_business_content_publish',
            'state': state,
            'response_type': 'code',
        }
        return f'https://api.instagram.com/oauth/authorize?{urlencode(params)}'

    async def exchange_code_for_token(self, code: str) -> Dict[str, Any]:
        """Exchange authorization code for access token"""
        async with httpx.AsyncClient() as client:
            response = await client.post(
                'https://api.instagram.com/oauth/access_token',
                data={
                    'client_id': self.app_id,
                    'client_secret': self.app_secret,
                    'grant_type': 'authorization_code',
                    'redirect_uri': self.redirect_uri,
                    'code': code,
                },
            )
            response.raise_for_status()
            data = response.json()

            # Exchange short-lived token for long-lived token
            if 'access_token' in data:
                long_lived_token_data = await self._get_long_lived_token(data['access_token'])
                data.update(long_lived_token_data)

            return data

    async def _get_long_lived_token(self, short_token: str) -> Dict[str, Any]:
        """Exchange short-lived token for long-lived token (60 days)"""
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    'https://graph.instagram.com/access_token',
                    params={
                        'grant_type': 'ig_exchange_token',
                        'client_secret': self.app_secret,
                        'access_token': short_token,
                    },
                )
                response.raise_for_status()
                data = response.json()

                # Add expiry timestamp
                if 'expires_in' in data:
                    data['expires_at'] = (datetime.utcnow() + timedelta(seconds=data['expires_in'])).isoformat()

                return data
        except httpx.HTTPError as e:
            print(f'Failed to get long-lived token: {str(e)}')
            return {'access_token': short_token}  # Fall back to short-lived token

    async def get_instagram_accounts(self, access_token: str) -> list[Dict[str, Any]]:
        """Get Instagram account info using Instagram Platform API"""
        async with httpx.AsyncClient() as client:
            response = await client.get(
                'https://graph.instagram.com/me',
                params={
                    'fields': 'id,username,name,profile_picture_url,followers_count,media_count,account_type',
                    'access_token': access_token,
                },
            )
            response.raise_for_status()
            ig_data = response.json()

            return [{
                'id': ig_data['id'],
                'username': ig_data.get('username', ''),
                'name': ig_data.get('name', ig_data.get('username', '')),
                'profile_picture_url': ig_data.get('profile_picture_url'),
                'followers_count': ig_data.get('followers_count'),
                'media_count': ig_data.get('media_count', 0),
                'account_type': ig_data.get('account_type', 'BUSINESS'),
                'access_token': access_token,
            }]

    async def refresh_token(self, access_token: str) -> Optional[Dict[str, Any]]:
        """Refresh a long-lived token before it expires"""
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    'https://graph.instagram.com/refresh_access_token',
                    params={
                        'grant_type': 'ig_refresh_token',
                        'access_token': access_token,
                    },
                )
                response.raise_for_status()
                data = response.json()

                if 'expires_in' in data:
                    data['expires_at'] = (datetime.utcnow() + timedelta(seconds=data['expires_in'])).isoformat()

                return data
        except httpx.HTTPError:
            return None
```

## Step 8: Publishing Service Implementation

### Publisher Service Class

```python
import httpx
import asyncio
from typing import Optional, Dict, Any
from datetime import datetime

class InstagramPublisher:
    def __init__(self):
        self.graph_base_url = 'https://graph.instagram.com'

    async def publish_post(self, account: InstagramAccount, image_url: str, caption: str) -> Dict[str, Any]:
        """Publish a post to Instagram"""
        try:
            # Use instagram_business_account_id or fallback to instagram_user_id
            account_id = account.instagram_business_account_id or account.instagram_user_id

            if not account_id:
                raise Exception('No Instagram account ID found. Please reconnect your Instagram account.')

            # Create media container
            container_id = await self._create_media_container(
                account_id=account_id,
                access_token=account.access_token,
                image_url=image_url,
                caption=caption,
            )

            if not container_id:
                raise Exception('Failed to create media container')

            # Wait for Instagram to process the media
            print(f'Media container created: {container_id}. Waiting for Instagram to process...')
            await asyncio.sleep(10)  # Wait 10 seconds for processing

            # Publish the container
            media_id = await self._publish_container(
                account_id=account_id,
                access_token=account.access_token,
                container_id=container_id,
            )

            if not media_id:
                raise Exception('Failed to publish media')

            # Get the published post details
            post_details = await self._get_post_details(media_id=media_id, access_token=account.access_token)

            print(f'Successfully published Instagram post {media_id}')

            return {
                'success': True,
                'media_id': media_id,
                'permalink': post_details.get('permalink'),
                'post_details': post_details,
            }

        except Exception as e:
            print(f'Failed to publish Instagram post: {str(e)}')
            return {'success': False, 'error': str(e)}

    async def _create_media_container(self, account_id: str, access_token: str, image_url: str, caption: str) -> Optional[str]:
        """Create a media container for Instagram"""
        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    f'{self.graph_base_url}/{account_id}/media',
                    data={'image_url': image_url, 'caption': caption, 'access_token': access_token},
                )
                response.raise_for_status()
                data = response.json()
                return data.get('id')
        except httpx.HTTPError as e:
            print(f'Failed to create media container: {str(e)}')
            return None

    async def _publish_container(self, account_id: str, access_token: str, container_id: str) -> Optional[str]:
        """Publish a media container to Instagram"""
        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    f'{self.graph_base_url}/{account_id}/media_publish',
                    data={'creation_id': container_id, 'access_token': access_token},
                )
                response.raise_for_status()
                data = response.json()
                return data.get('id')
        except httpx.HTTPError as e:
            print(f'Failed to publish container: {str(e)}')
            return None

    async def _get_post_details(self, media_id: str, access_token: str) -> Dict[str, Any]:
        """Get details of a published Instagram post"""
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f'{self.graph_base_url}/{media_id}',
                    params={
                        'fields': 'id,media_type,media_url,permalink,timestamp,caption',
                        'access_token': access_token,
                    },
                )
                response.raise_for_status()
                return response.json()
        except httpx.HTTPError as e:
            print(f'Failed to get post details: {str(e)}')
            return {}

    def validate_caption(self, caption: str) -> Dict[str, Any]:
        """Validate Instagram caption against platform limits"""
        errors = []
        warnings = []

        # Check length (2200 character limit)
        if len(caption) > 2200:
            errors.append(f'Caption too long: {len(caption)} characters (max 2200)')

        # Check hashtag count (30 hashtag limit)
        hashtags = [word for word in caption.split() if word.startswith('#')]
        if len(hashtags) > 30:
            errors.append(f'Too many hashtags: {len(hashtags)} (max 30)')

        # Check mention count (unofficial limit around 30)
        mentions = [word for word in caption.split() if word.startswith('@')]
        if len(mentions) > 30:
            warnings.append(f'Many mentions: {len(mentions)} (may affect reach)')

        return {
            'valid': len(errors) == 0,
            'errors': errors,
            'warnings': warnings,
            'hashtag_count': len(hashtags),
            'mention_count': len(mentions),
            'character_count': len(caption),
        }

    def format_caption_with_hashtags(self, caption: str, hashtags: list[str] = None) -> str:
        """Format caption with hashtags properly"""
        if not hashtags:
            return caption

        # Ensure hashtags start with #
        formatted_hashtags = []
        for tag in hashtags:
            if not tag.startswith('#'):
                tag = f'#{tag}'
            formatted_hashtags.append(tag)

        # Add hashtags with proper spacing
        if caption and not caption.endswith('\n'):
            caption += '\n\n'

        caption += ' '.join(formatted_hashtags)
        return caption
```

## Step 9: API Endpoints Implementation

### OAuth Endpoints

```python
from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.responses import RedirectResponse

router = APIRouter(prefix="/api/instagram")

@router.post('/connect')
async def connect_instagram_account(request: dict):
    """Start OAuth flow"""
    user_id = request.get('user_id')
    product_id = request.get('product_id')

    state = f"{user_id}:{product_id}"
    auth_url = instagram_oauth.get_auth_url(state)

    return {'auth_url': auth_url, 'message': 'Redirect user to this URL'}

@router.get('/oauth-callback')
async def oauth_callback(code: str = Query(...), state: str = Query(...)):
    """Handle Instagram OAuth callback"""
    try:
        # Parse state to get user_id and product_id
        user_id, product_id = state.split(':')

        # Exchange code for token
        token_data = await instagram_oauth.exchange_code_for_token(code)
        if not token_data.get('access_token'):
            raise Exception('Failed to get access token')

        # Get Instagram accounts
        accounts = await instagram_oauth.get_instagram_accounts(token_data['access_token'])
        if not accounts:
            raise Exception('No Instagram accounts found')

        # Deactivate existing accounts for this product (one account per product)
        # Update existing active account to inactive

        # Save new account to database
        for account_data in accounts:
            instagram_account = InstagramAccount(
                user_id=user_id,
                product_id=product_id,
                instagram_business_account_id=account_data['id'],
                instagram_user_id=account_data['id'],
                access_token=token_data['access_token'],
                username=account_data.get('username', ''),
                name=account_data.get('name'),
                profile_picture_url=account_data.get('profile_picture_url'),
                followers_count=account_data.get('followers_count'),
                token_expires_at=datetime.fromisoformat(token_data.get('expires_at')) if token_data.get('expires_at') else None,
            )
            # Save to database

        # Redirect to frontend with success message
        frontend_url = os.getenv('FRONTEND_URL')
        return RedirectResponse(
            url=f'{frontend_url}/instagram/callback?success=true&message=Successfully connected Instagram account',
            status_code=302,
        )

    except Exception as e:
        frontend_url = os.getenv('FRONTEND_URL')
        return RedirectResponse(
            url=f'{frontend_url}/instagram/callback?error=true&message={str(e)}',
            status_code=302
        )

@router.get('/accounts')
async def list_instagram_accounts(product_id: str = None):
    """List connected Instagram accounts"""
    # Query database for active accounts
    # Filter by product_id if provided
    # Return account list
    pass

@router.delete('/accounts/{account_id}')
async def disconnect_instagram_account(account_id: str):
    """Disconnect an Instagram account"""
    # Find account by ID
    # Set is_active = False (soft delete)
    # Return success message
    pass
```

### Publishing Endpoints

```python
@router.post('/publish')
async def publish_to_instagram(request: dict):
    """Publish content to Instagram immediately"""
    post_id = request.get('post_id')
    caption = request.get('caption')
    hashtags = request.get('hashtags', [])
    image_url = request.get('image_url')

    # Get your app's post from database
    # Find active Instagram account for the product
    # Validate caption and image
    # Format caption with hashtags
    # Call publisher.publish_post()
    # Update database with results

    pass

@router.post('/schedule')
async def schedule_instagram_post(request: dict):
    """Schedule post for later publishing"""
    # Similar to publish but set scheduled_for timestamp
    # Add to background job queue for processing
    pass

@router.get('/posts')
async def list_instagram_posts(post_id: str = None):
    """List Instagram posts"""
    # Query database for Instagram posts
    # Filter by post_id if provided
    # Return post list with status
    pass
```

## Step 10: Frontend Integration

### React Hook for Instagram

```typescript
import { useState, useEffect } from 'react'

interface InstagramAccount {
  id: string
  username: string
  name?: string
  profile_picture_url?: string
  followers_count?: number
  is_active: boolean
  auto_post: boolean
}

export const useInstagram = (productId: string) => {
  const [accounts, setAccounts] = useState<InstagramAccount[]>([])
  const [loading, setLoading] = useState(false)

  const connectAccount = async () => {
    try {
      const response = await fetch('/api/instagram/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product_id: productId })
      })
      const data = await response.json()

      if (data.auth_url) {
        window.location.href = data.auth_url
      }
    } catch (error) {
      console.error('Failed to connect Instagram account:', error)
    }
  }

  const disconnectAccount = async (accountId: string) => {
    try {
      await fetch(`/api/instagram/accounts/${accountId}`, {
        method: 'DELETE'
      })
      await fetchAccounts() // Refresh list
    } catch (error) {
      console.error('Failed to disconnect account:', error)
    }
  }

  const publishPost = async (data: {
    post_id: string
    caption: string
    hashtags?: string[]
    image_url: string
  }) => {
    try {
      const response = await fetch('/api/instagram/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      return await response.json()
    } catch (error) {
      console.error('Failed to publish post:', error)
      throw error
    }
  }

  const fetchAccounts = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/instagram/accounts?product_id=${productId}`)
      const data = await response.json()
      setAccounts(data.accounts || [])
    } catch (error) {
      console.error('Failed to fetch accounts:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (productId) {
      fetchAccounts()
    }
  }, [productId])

  return {
    accounts,
    loading,
    connectAccount,
    disconnectAccount,
    publishPost,
    refetch: fetchAccounts
  }
}
```

### Instagram Component

```tsx
import React, { useState } from 'react'
import { useInstagram } from './useInstagram'

interface InstagramPostFormProps {
  productId: string
  postId: string
  imageUrl: string
  defaultCaption?: string
}

export const InstagramPostForm: React.FC<InstagramPostFormProps> = ({
  productId,
  postId,
  imageUrl,
  defaultCaption = ''
}) => {
  const { accounts, connectAccount, publishPost } = useInstagram(productId)
  const [caption, setCaption] = useState(defaultCaption)
  const [hashtags, setHashtags] = useState<string[]>([])
  const [isPublishing, setIsPublishing] = useState(false)

  const handlePublish = async () => {
    try {
      setIsPublishing(true)
      const result = await publishPost({
        post_id: postId,
        caption,
        hashtags,
        image_url: imageUrl
      })

      if (result.success) {
        alert('Successfully published to Instagram!')
      } else {
        alert(`Failed to publish: ${result.error}`)
      }
    } catch (error) {
      alert('Failed to publish to Instagram')
    } finally {
      setIsPublishing(false)
    }
  }

  if (accounts.length === 0) {
    return (
      <div className="instagram-setup">
        <h3>Instagram Publishing</h3>
        <p>Connect your Instagram account to publish content.</p>
        <button onClick={connectAccount}>
          Connect Instagram Account
        </button>
      </div>
    )
  }

  return (
    <div className="instagram-form">
      <h3>Publish to Instagram</h3>

      <div className="connected-account">
        <p>Connected: @{accounts[0].username}</p>
      </div>

      <div className="form-group">
        <label>Caption:</label>
        <textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          maxLength={2200}
          rows={4}
        />
        <small>{caption.length}/2200 characters</small>
      </div>

      <div className="form-group">
        <label>Hashtags (comma-separated):</label>
        <input
          type="text"
          value={hashtags.join(', ')}
          onChange={(e) => setHashtags(
            e.target.value.split(',').map(tag => tag.trim()).filter(Boolean)
          )}
        />
        <small>{hashtags.length}/30 hashtags</small>
      </div>

      <button
        onClick={handlePublish}
        disabled={isPublishing || !caption.trim()}
      >
        {isPublishing ? 'Publishing...' : 'Publish to Instagram'}
      </button>
    </div>
  )
}
```

## Step 11: Database Constraints

### One Instagram Account Per Product

```sql
-- Create unique partial index (only for active accounts)
CREATE UNIQUE INDEX CONCURRENTLY idx_instagram_accounts_unique_active_per_product
ON instagram_accounts (product_id)
WHERE is_active = true;
```

This ensures only one active Instagram account per product while allowing multiple inactive accounts.

## Step 12: Error Handling and Validation

### Common Validation Functions

```python
def validate_image_url(url: str) -> bool:
    """Validate that image URL is accessible"""
    try:
        response = requests.head(url, timeout=5)
        return response.status_code == 200 and 'image' in response.headers.get('content-type', '')
    except:
        return False

def validate_caption(caption: str) -> Dict[str, Any]:
    """Validate Instagram caption"""
    errors = []

    if len(caption) > 2200:
        errors.append('Caption too long (max 2200 characters)')

    hashtags = [word for word in caption.split() if word.startswith('#')]
    if len(hashtags) > 30:
        errors.append('Too many hashtags (max 30)')

    return {
        'valid': len(errors) == 0,
        'errors': errors,
        'hashtag_count': len(hashtags),
        'character_count': len(caption)
    }
```

## Step 13: Testing

### Test the Complete Flow

1. **OAuth Flow**:
   ```bash
   curl -X POST http://localhost:8000/api/instagram/connect \
     -H "Content-Type: application/json" \
     -d '{"user_id": "test-user", "product_id": "test-product"}'
   ```

2. **Publishing Test**:
   ```bash
   curl -X POST http://localhost:8000/api/instagram/publish \
     -H "Content-Type: application/json" \
     -d '{
       "post_id": "test-post-123",
       "caption": "Test post from my app!",
       "hashtags": ["test", "automation"],
       "image_url": "https://picsum.photos/1080/1080"
     }'
   ```

## Troubleshooting

### Common Issues

1. **"Invalid OAuth access token - Cannot parse access token"**
   - **Cause**: Using Facebook Graph API endpoints with Instagram Platform tokens
   - **Solution**: Use `https://graph.instagram.com/` for all API calls after authentication

2. **"Invalid platform app" error**
   - **Cause**: Wrong OAuth scope or using Facebook app instead of Instagram app
   - **Solution**: Use Instagram app credentials and scope: `instagram_business_basic,instagram_business_content_publish`

3. **Media container creation fails**
   - **Cause**: Image URL not publicly accessible or invalid format
   - **Solution**: Ensure image URLs return proper HTTP 200 and content-type headers

4. **Token expiration**
   - **Cause**: Long-lived tokens expire after 60 days
   - **Solution**: Implement token refresh using the `refresh_token` method

### Rate Limits

Instagram API rate limits are based on your account's impressions:
- **Formula**: 4800 × (account impressions / 1000) per 24 hours
- **Minimum**: 200 calls per hour
- **Recommendation**: Implement exponential backoff for failed requests

## Security Best Practices

1. **Environment Variables**: Never commit access tokens or secrets to version control
2. **Token Refresh**: Implement automatic refresh for long-lived tokens
3. **Input Validation**: Validate all user inputs before sending to Instagram API
4. **Rate Limiting**: Implement client-side rate limiting to prevent quota exhaustion
5. **Error Logging**: Log API errors for debugging but sanitize sensitive data

## Production Deployment

### Environment Configuration

```env
# Production settings
INSTAGRAM_APP_ID=your_production_app_id
INSTAGRAM_APP_SECRET=your_production_app_secret
INSTAGRAM_REDIRECT_URI=https://yourdomain.com/api/instagram/oauth-callback
FRONTEND_URL=https://yourdomain.com
```

### Database Migration

Create and run your database migrations to add the Instagram tables.

### App Review (Optional)

For advanced access (managing other users' accounts):
1. Submit app for Instagram App Review
2. Provide detailed use case documentation
3. Include privacy policy and terms of service
4. Demonstrate app functionality

## Resources

- [Instagram Platform API Documentation](https://developers.facebook.com/docs/instagram-platform/)
- [Instagram API with Instagram Login](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/)
- [Content Publishing Guide](https://developers.facebook.com/docs/instagram-platform/content-publishing/)
- [OAuth 2.0 Flow](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/get-started#access-tokens)
- [Rate Limits and Best Practices](https://developers.facebook.com/docs/graph-api/overview/rate-limiting/)

## Support

For implementation questions:
1. Check the Meta Developer Community
2. Review Instagram Platform API documentation
3. Test with Graph API Explorer for debugging
4. Monitor API error responses for specific error codes