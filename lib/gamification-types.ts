
export interface UserGamificationState {
    userId: string;
    username: string; // Friendly name
    xp: number;
    level: number;
    streak: number;
    bestSpeedScore: number;
    achievements: string[];

    // Personalization & Analytics
    questionsAnswered: number;
    deepTalkCount: number;
    funCount: number;

    // Multipliers (computed or stored)
    playStyleMultiplier: number; // e.g., 1.0 base, increases if they play "Deep" often
}

export const INITIAL_USER_STATE: Omit<UserGamificationState, 'userId' | 'username'> = {
    xp: 0,
    level: 1,
    streak: 0,
    bestSpeedScore: 0,
    achievements: [],
    questionsAnswered: 0,
    deepTalkCount: 0,
    funCount: 0,
    playStyleMultiplier: 1.0,
};
