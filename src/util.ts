import { Double, Int32 } from 'bson';
import { VanillaIconIndexes } from './consants';
import { CSSProperties } from 'react';

export type StateSet<T> = React.Dispatch<React.SetStateAction<T>>;

export interface Achievement {
    Conditions: Record<string, Condition>;
}

export interface Condition {
    Completed: boolean;
    Value?: Int32 | Double;
}

export type AchievementsType = Record<string, Achievement>;

export type AchievementName = keyof AchievementsType;
export type AchievementConditionName<T extends AchievementName> = keyof ((AchievementsType)[T]['Conditions']);
export type AchievementConditionProgressName<T extends AchievementName, C extends AchievementConditionName<T>> = keyof (AchievementsType)[T]['Conditions'][C];

export function getAchievementImgStyle(name: string, completed = true): CSSProperties {
    const index = VanillaIconIndexes.findIndex(((e) => e == name));
    if (index >= 0) {
        let x = (index % 8) * 66;
        const y = Math.floor(index / 8) * 66;

        if (!completed)
            x += 528;

        return {
            background: `url('/icons/Vanilla.png')`,
            backgroundPosition: `left ${-x}px top ${-y}px`,
            width: '64px',
            height: '64px'
        };
    }

    return {
        background: `url('/icons/Missing.png')`,
        backgroundPositionX: `${completed ? 0 : 64}px`,
        backgroundPositionY: `0px`,
        width: '64px',
        height: '64px'
    };
}

export function isAchievementCompleted(ach: Achievement) {
    const conds = ach.Conditions;

    for (const condName in conds) {
        const cond = conds[condName];

        if (!cond.Completed) {
            return false;
        }
    }

    return true;
}
