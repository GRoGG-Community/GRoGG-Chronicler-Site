import { useState, useEffect } from "react";
import { LoadingMessage } from "../Messages";
import AccountList from "./AccountList";
import { fetchAccountMap, fetchAccounts } from "../../clients/accounts";
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