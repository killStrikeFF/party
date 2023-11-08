export type UserDetailsAuthorizedResponse = UnAuthorizedUserDetails | UserDetails;

export interface UnAuthorizedUserDetails {
  auth: false;
}

export interface UserDetails {
  auth: true;
  uuid: string;
  name: string;
  image: string;
  color: string;
}
