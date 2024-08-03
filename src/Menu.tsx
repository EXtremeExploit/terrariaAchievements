import { useRef, useState } from 'react';
import { AchievementsType, StateSet } from './util';

import { Buffer } from 'buffer';


import { BSON } from 'bson';

import aes from 'aes-js';

const DEFAULT_KEY = new Uint8Array([0x52, 0x45, 0x4c, 0x4f, 0x47, 0x49, 0x43, 0x2d, 0x54, 0x45, 0x52, 0x52, 0x41, 0x52, 0x49, 0x41]);

function getEncryptionKey(steamID: bigint) {
    const buffer = new ArrayBuffer(8);
    const view = new DataView(buffer);

    view.setBigUint64(0, steamID, true);

    const array = new Uint8Array(16);
    array.set(new Uint8Array(buffer), 0);
    array.set(new Uint8Array(buffer), 8);

    return array;
}


export function Menu(props: {
    achievements: AchievementsType,
    setAchievements: StateSet<AchievementsType>
}) {
    const steamId = useRef<bigint>(0n);
    const file = useRef<File | null>(null);
    const [mode, setMode] = useState<'offline' | 'steam'>('offline');

    function handleFileChange(ev: React.ChangeEvent<HTMLInputElement>) {
        if (ev.target.files)
            file.current = ev.target.files[0];
    }

    function handleModeChange(ev: React.ChangeEvent<HTMLInputElement>) {
        setMode(ev.target.id as 'offline' | 'steam');
    }

    async function loadAchievements(key: Uint8Array): Promise<AchievementsType> {
        if (file.current == null) return {};

        const cbc = new aes.ModeOfOperation.cbc(key, key);

        const encryptedAchData = Buffer.from(await file.current.arrayBuffer());

        const bsonData = cbc.decrypt(encryptedAchData);

        const doc = BSON.deserialize(bsonData, {
            allowObjectSmallerThanBufferSize: true,
            promoteValues: false
        });
        return doc;
    }

    function saveAchievements(_ev: React.MouseEvent<HTMLButtonElement>) {
        const bson = BSON.serialize(props.achievements);

        const remainingBytes = 16 - (bson.length % 16);

        const bsonWithPadding = new Uint8Array(bson.length + remainingBytes);
        bsonWithPadding.set(bson);


        if (remainingBytes) {
            const padding = new Array(remainingBytes);
            for (let i = 0; i < remainingBytes; i++) {
                padding[i] = 0x0F;
            }
            bsonWithPadding.set(padding, bson.length);
        }


        let key: Uint8Array;
        switch (mode) {
            case 'steam':
                key = getEncryptionKey(steamId.current);
                break;
            case 'offline':
                key = DEFAULT_KEY;
                break;
        }


        const cbc = new aes.ModeOfOperation.cbc(key, key);
        const encryptedData = cbc.encrypt(bsonWithPadding);

        const blob = new Blob([encryptedData], {
            type: 'application/octet-stream'
        });

        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        const name = mode == 'steam' ? 'achievements-steam' : 'achievements';

        link.setAttribute(
            'download',
            `${name}.dat`,
        );

        document.body.appendChild(link);

        link.click();

        link.parentNode?.removeChild(link);
    }

    return <>
        <div>
            <h3>Locations:</h3>
            <h4>Linux/Vanilla: ~./.steam/root/userdata/(AccountId)/105600/remote/achievements-steam.dat</h4>
            <h4>Linux/tModLoader: ~/.local/share/Terraria/tModLoader/achievements.dat</h4>
            <h4>Windows: i dont know</h4>
        </div>

        <div>
            <h3>File:</h3>
            <input type='file' onChange={handleFileChange}></input>
        </div>

        <div>
            <h4>tModLoader/Offline</h4>
            <input type='radio' id='offline' checked={mode == 'offline'} onChange={handleModeChange}></input>
        </div>

        <div>
            <h4>Steam/Vanilla/Online</h4>
            <input type='radio' id='steam' checked={mode == 'steam'} onChange={handleModeChange}></input>
        </div>

        <div>
            <p title={`SteamID is required for importing from steam's userdata/remote\nIt will attempt both offline key and steamid just in case its offline`}> <u>SteamID (Optional):</u></p>
            <input type='number' placeholder='76561197960287930' onChange={(ev) => steamId.current = BigInt(ev.target.value)}></input>
        </div >


        <button onClick={async (_ev) => {
            let ach = {};
            try {
                console.log('Trying default key');
                ach = await loadAchievements(DEFAULT_KEY);
                setMode('offline');
            } catch (error) {
                try {
                    console.log('Trying steam key');
                    const key = getEncryptionKey(steamId.current);
                    ach = await loadAchievements(key);
                    setMode('steam');
                } catch (error2) {
                    alert('Failure to decrypt file, Steam ID is wrong?');
                }
            }
            props.setAchievements(ach);
        }}>Load</button>

        <button title={`Save using the specified key above (Steam's account id or tModLoader/Offline key)\nMAKE A BACKUP BEFORE REPLACING\nMainly useful for transfering from vanilla to tModLoader and viceversa`}
            onClick={saveAchievements}>Save</button>
    </>;
}
