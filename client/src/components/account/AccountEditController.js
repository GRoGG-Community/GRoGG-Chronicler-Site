import { editAccount } from "../../clients/accounts";
import { handleCreateAccount } from "../../handlers/handlers";
import AccountEdit from "./AccountEdit";
import { useState } from "react";


export default function AccountEditController({updateAccounts, accountName, accountPass, accountId}) {
     const [name, setName] = useState(accountName || '');
     const [pass, setPass] = useState(accountPass || '');

     const [error, setError] = useState('')
     const [success, setSuccess] = useState('')

     function onSubmit(e) {
        e.preventDefault()
        // Account is being editted
        if (accountId) {
            editAccount(accountId, name, pass).then(() => updateAccounts())
        } else { // Account is being created
            handleCreateAccount(
                e,
                name,
                pass,
                [],
                setError,
                setSuccess,
                updateAccounts,
                () => {},
                setName,
                setPass
            )
        }
     }

     const buttonLabel = accountId ? "Edit Account" : "Create Account" 

    return (<AccountEdit
        accountName={name}
        accountPass={pass}
        error={error}
        success={success}
        onNameChanged={setName}
        onPasswordChanged={setPass}
        onSubmit={onSubmit}
        buttonLabel={buttonLabel}
    />)
}