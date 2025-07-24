import { handleLinkAccount, handleUnlinkAccount } from "../../handlers/handlers";
import { getEmpireAccount } from "../../utils/empireListFunctions";
import { LoadingMessage } from "../Messages";
import EmpireList from "./EmpireList";

export default function EmpireListController({
        accounts,
        account,
        setNewEmpireLoading,
        setNewEmpireError,
        setEmpirePage,
        setEditEmpire
}) {
    const [empires, setEmpires] = useState(undefined);
    
    useEffect(() => {
        fetch('/empires.json')
            .then(res => res.json())
            .then(data => {
                setEmpires(Array.isArray(data) ? data : []);
            });
    }, []);

    if (empires === undefined) {
        <LoadingMessage/>
    } else {
        <EmpireList
            empires={empires}
            accounts={accounts} 
            onLink={handleLinkAccount}
            onUnlink={handleUnlinkAccount} 
            onDelete={(name) => handleDeleteEmpire(
                name,
                setNewEmpireLoading,
                setNewEmpireError,
                setEmpires
            )}
            loading={false}
            account={account}
            setEmpirePage={setEmpirePage}
            setEditEmpire={setEditEmpire} 
            getEmpireAccount={(empireName) => getEmpireAccount(empires, empireName)}
        />
    }

}