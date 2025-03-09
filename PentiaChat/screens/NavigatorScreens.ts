export type Screens = {
	Splash: undefined;
	Rooms: undefined;
	Room: {
		id: string;
		name: string; // Save the name so we don't have to fetch it from the room itself
	};
	Login: undefined;
};
