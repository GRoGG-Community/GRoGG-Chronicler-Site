import { useState, useEffect } from "react";
import AccountEditController from "../components/account/AccountEditController";
import AccountListController from "../components/account/AccountListController";
import Header from "../components/Header";
import { fetchAccountsRaw } from "../clients/accounts";
import { handleDeleteAccount } from "../handlers/handlers";
import Account, { AccountMap } from "../model/Account";

export function AccountPage() {
    const [editAccount, setEditAccount] = useState<Account | undefined>(undefined)

    const [accounts, setAccounts] = useState<Array<Account>>([]);

    function updateAccounts() {
        console.log("Updating accounts")
        fetchAccountsRaw().then(setAccounts)
    }

    useEffect(updateAccounts, []);

    return (
        <div className="app-container">
            <Header activeTab={"accounts"} />

            <section className="account-manage-section card">
                <h2>Manage Accounts</h2>
                <AccountEditController updateAccounts={updateAccounts}/>
                <h3>All Accounts</h3>
                <AccountListController
                    onEdit={acc => {
                        console.log("Starting edit", accounts.find(it => it.name === acc))
                        setEditAccount(accounts.find(it => it.name === acc)!!);
                    }}
                    onDelete={acc => handleDeleteAccount(
                        acc,
                        () => {},
                        () => {},
                        () => { updateAccounts() },
                        () => {},
                    )}
                    editAccountLoading={false}
                />
                {editAccount && (
                    <AccountEditController
                        updateAccounts={updateAccounts}
                        accountId={editAccount.id}
                        accountName={editAccount.name}
                        accountPass={editAccount.password}
                    />
                )}
            </section>
        </div>
    )
}