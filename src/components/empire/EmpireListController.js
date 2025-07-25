import { useState, useEffect } from "react";
import { handleLinkAccount, handleUnlinkAccount, handleDeleteEmpire } from "../../handlers/handlers";
import { getEmpireAccount } from "../../utils/empireListFunctions";
import { LoadingMessage } from "../Messages";
import EmpireList from "./EmpireList";

export default function EmpireListController({
        accounts,
        account,
        setNewEmpireLoading,
        setNewEmpireError,
        setEmpirePage,
        setEditEmpire,
        showManageActions = false 
}) {
    const [empires, setEmpires] = useState(undefined);

    useEffect(() => {
        fetch('/empires.json')
            .then(res => res.json())
            .then(data => {
                setEmpires(Array.isArray(data) ? data : []);
            });
    }, []);
    function handleLinkAccountLocal(empireName, accountName) {
        handleLinkAccount(empireName, accountName);
        setEmpires(prev =>
            prev.map(e => e.name === empireName ? { ...e, account: accountName } : e)
        );
    }
    function handleUnlinkAccountLocal(empireName) {
        handleUnlinkAccount(empireName);
        setEmpires(prev =>
            prev.map(e => e.name === empireName ? { ...e, account: null } : e)
        );
    }

    if (empires === undefined) {
        return <LoadingMessage/>;
    } else {
        return (
            <EmpireList
                empires={empires}
                accounts={accounts} 
                onLink={handleLinkAccountLocal}
                onUnlink={handleUnlinkAccountLocal}
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
                showManageActions={showManageActions} 
            />
        );
    }

}