export enum AuthMessage {
  SIGN_IN_SUCCESS = 'Sign in success.',
  SIGN_UP_SUCCESS = 'Sign up success.',
  INVALID_CREDENTIALS = 'Invalid credentials.',
  SIGN_OUT_SUCCESS = 'Sign out success.',
}

export enum AuthSummary {
  SIGN_UP_SUMMARY = 'Sign up for users.',
  SIGN_IN_SUMMARY = 'Sign in for users.',
  SIGN_OUT = 'Sign out for users.',
}

export const authConstant = {
  jwtAccessToken: 'jwtAccessToken',
};
