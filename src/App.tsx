import { useState } from 'react';

import { AchievementsEditor } from './AchievementsEditor';
import { Menu } from './Menu';

function App() {
    const [achievements, setAchievements] = useState({});

    return (<>
        <h2>EXtremeExploit's Terraria achievements editor</h2>
        <Menu achievements={achievements} setAchievements={setAchievements} />
        <AchievementsEditor achievements={achievements} setAchievements={setAchievements} />
    </>);
}

export default App;
