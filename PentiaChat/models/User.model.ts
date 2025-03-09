export type User = UserDTO & {
	key: string;
};

export type UserDTO = {
	uid: string;
	avatarURL: string;
	name: string;
};
