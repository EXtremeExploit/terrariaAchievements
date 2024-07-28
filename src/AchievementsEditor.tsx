
import { AchievementsType, StateSet } from './util';

export function AchievementsEditor(props: {
    achievements: AchievementsType,
    setAchievements: StateSet<AchievementsType>
}) {
    return (
        <>
            {Object.entries(props.achievements).map((achievement) => <div>
                <h1 key={achievement[0]}>{achievement[0]}</h1>
                <h2 key={achievement[0] + '-conds-text'}>Conditions:</h2>
                {Object.entries(achievement[1].Conditions).map((condition) => <div key={`${achievement[0]}+${condition[0]}`}>
                    <h3>{condition[0]}</h3>

                    {
                        (() => {
                            const cond = condition[1];
                            const key = `${achievement[0]}+${condition[0]}`;

                            const elements = [];

                            if (typeof cond.Value != 'undefined') {
                                elements.push(<p>Value:
                                    <input key={key + '-value'} type='number' value={cond.Value} onChange={(ev) => {
                                        const newAchievements = JSON.parse(JSON.stringify(props.achievements));
                                        newAchievements[achievement[0]].Conditions[condition[0]].Value = parseInt(ev.target.value);
                                        props.setAchievements(newAchievements);
                                    }}>
                                    </input></p>);
                            }

                            elements.push(<p>Completed:
                                <input key={key + '-completed'} type='checkbox' checked={cond.Completed} onChange={(_ev) => {
                                    const newAchievements = JSON.parse(JSON.stringify(props.achievements));
                                    newAchievements[achievement[0]].Conditions[condition[0]].Completed = !newAchievements[achievement[0]].Conditions[condition[0]].Completed;
                                    props.setAchievements(newAchievements);
                                }}>
                                </input>
                            </p>);

                            return elements;
                        })()
                    }
                </div>
                )}
            </div>)}
        </>
    );
}
