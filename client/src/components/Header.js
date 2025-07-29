import { useNavigate } from "react-router";

export const tabs = [
    { key: 'channels', label: 'Channels' },
    { key: 'empires', label: 'Empires' },
    { key: 'treaties', label: 'Treaties' },
    { key: 'accounts', label: 'Manage Accounts' },
    { key: 'manage-empires', label: 'Manage Empires' }
];

export default function Header({activeTab}) {
    console.log("activeTab", activeTab)
    const navigate = useNavigate();

    return (<header className="header">
        <h1>Stellaris RP Chronicler</h1>
        <div className="tabs-bar">
            {tabs.map(tab => (
                <button
                    key={tab.key}
                    className={`tab-btn${activeTab === tab.key ? ' active' : ''}`}
                    onClick={() => {
                        navigate(`/${tab.key}`)
                    }}
                >{tab.label}</button>
            ))}
        </div>
    </header>)
}