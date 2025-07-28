import { useState, useEffect } from "react";
import { LoadingMessage } from "../Messages";
import AccountList from "./AccountList";

export default function AccountListController({
    onEdit,
    onDelete,
    editAccountLoading
}) {
    const [accounts, setAccounts] = useState(undefined);

    useEffect(() => {
        fetch('/api/accounts')
            .then(res => res.json())
            .then(data => {
                setAccounts(data && typeof data === 'object' && !Array.isArray(data) ? data.accounts : {});
            });
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