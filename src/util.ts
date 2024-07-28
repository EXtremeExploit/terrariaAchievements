export type StateSet<T> = React.Dispatch<React.SetStateAction<T>>;

export interface Achievement {
    Conditions: Record<string, Condition>;
}

export interface Condition {
    Completed: boolean;
    Value?: number;
}

export type AchievementsType = Record<string, Achievement>;

export type AchievementName = keyof AchievementsType;
export type AchievementConditionName<T extends AchievementName> = keyof ((AchievementsType)[T]['Conditions']);
export type AchievementConditionProgressName<T extends AchievementName, C extends AchievementConditionName<T>> = keyof (AchievementsType)[T]['Conditions'][C];
