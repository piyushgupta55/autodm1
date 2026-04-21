export interface ConnectedAccount {
  instagramUserId: string;
  instagramUserProfilePictureUrl: string;
  instagramUsername: string;
  integrationId: string;
  isDefault: boolean;
  isIntegrationBroken: boolean;
  autoDmCount: number;
  hasAutoResumableAutoDms: boolean;
  isReconnected: boolean;
  isPaused: boolean;
  disconnectModalStatus: number;
  reconnectModalStatus: number;
  disconnectBannerStatus: number;
}

export interface DashboardData {
  accountsConnected: ConnectedAccount[];
  needReconnection: boolean;
  reconnectionRequiredAccounts: any[];
  hasStarted: boolean;
  instagramUserProfilePictureUrl: string;
  instagramUsername: string;
  autoDmPausedModalStatus: number;
}

export interface ApiResponse<T> {
  data: T;
  status: boolean;
}

export interface InstagramProfile {
  id: string;
  username: string;
  name: string;
  profile_picture_url?: string;
}
