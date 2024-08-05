import { AchievementsType, StateSet } from './util';

import './AchievementsEditor.css';

export function AchievementsEditor(props: {
    achievements: AchievementsType,
    setAchievements: StateSet<AchievementsType>
}) {
    return (
        <div className='achievements'>
            {
                Object.entries(props.achievements).map((achievement) => <div key={`${achievement[0]}-div`} className="achievement">
                    <h2 key={`${achievement[0]}-h2`}>{achievement[0]}</h2>
                    <div key={`${achievement[0]}-conditions`} className='conditions'>

                        <h3 key={achievement[0] + '-conds-text'}>Conditions:</h3>
                        {Object.entries(achievement[1].Conditions).map((condition) => (
                            <div key={`${achievement[0]}+${condition[0]}`} className='condition'>
                                <h4>{condition[0]}</h4>

                                <div className='progresses'>
                                    {
                                        (() => {
                                            const achName = achievement[0];

                                            const condName = condition[0];
                                            const cond = condition[1];
                                            const key = `${achName}+${condName}`;

                                            const elements = [];

                                            if (typeof cond.Value != 'undefined') {
                                                elements.push(<p key={key + '-value-p'} className='progress'>Value:
                                                    <input key={key + '-value'} type='number' value={cond.Value.value} onChange={(ev) => {
                                                        const newAchievements = JSON.parse(JSON.stringify(props.achievements)) as typeof props.achievements;
                                                        if (typeof newAchievements[achName].Conditions[condName].Value === 'undefined') return;
                                                        newAchievements[achName].Conditions[condName].Value.value = parseInt(ev.target.value);
                                                        props.setAchievements(newAchievements);
                                                    }}>
                                                    </input></p>);
                                            }

                                            elements.push(<p key={key + '-completed-p'} className='progress'>Completed:
                                                <input key={key + '-completed'} type='checkbox' checked={cond.Completed} onChange={(_ev) => {
                                                    const newAchievements = JSON.parse(JSON.stringify(props.achievements));
                                                    newAchievements[achName].Conditions[condName].Completed = !newAchievements[achName].Conditions[condName].Completed;
                                                    props.setAchievements(newAchievements);
                                                }}>
                                                </input>
                                            </p>);

                                            return elements;
                                        })()
                                    }
                                </div>
                            </div>
                        )
                        )}
                    </div>
                </div>)
            }
        </div>
    );
}
