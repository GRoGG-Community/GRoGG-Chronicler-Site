import { useState, useEffect } from "react";
import { LoadingMessage } from "../Messages";
import AccountList from "./AccountList";
import { fetchAccounts, fetchAccountsRaw } from "../../clients/accounts";
import Account, { AccountMap } from "../../model/Account";

interface AccountListControllerProps {
    onEdit: (accountName: string) => void,
    onDelete: (accountName: string) => void,
    editAccountLoading: boolean
}

export default function AccountListController({
    onEdit,
    onDelete,
    editAccountLoading
}: AccountListControllerProps) {
    const [accounts, setAccounts] = useState<Array<Account> | undefined>(undefined);

    useEffect(() => {
        fetchAccountsRaw().then(data => setAccounts(data));
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