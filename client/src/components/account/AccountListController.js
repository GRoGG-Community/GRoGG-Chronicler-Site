import { useState, useEffect } from "react";
import { LoadingMessage } from "../Messages";
import AccountList from "./AccountList";
import { fetchAccounts } from "../../clients/accounts";

export default function AccountListController({
    onEdit,
    onDelete,
    editAccountLoading
}) {
    const [accounts, setAccounts] = useState(undefined);

    useEffect(() => {
        fetchAccounts().then(data => setAccounts(data));
    }, []);

    if (accounts === undefined) {
        return <LoadingMessage>Loading accounts...</LoadingMessage>;
    }

    return (
        <AccountList
            accounts={accounts}
            onEdit={onEdit}
            onDelete={onDelete}
            editAccountLoading={editAccountLoading}
        />
    );
}