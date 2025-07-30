import { internalRuntype } from "simple-runtypes/dist/runtype";
import { ErrorMessage, LoadingMessage } from "../Messages";
import { FormEventHandler } from "react";

interface AccountEditProps {
    error: string,
    success: string,
    accountName: string, 
    accountPass: string, 
    onSubmit: FormEventHandler<HTMLFormElement>, 
    onNameChanged: (newName: string) => void, 
    onPasswordChanged: (newPassword: string) => void,
    buttonLabel: string
}

export default function AccountEdit({ 
    error,
    success,
    accountName, 
    accountPass, 
    onSubmit, 
    onNameChanged, 
    onPasswordChanged,
    buttonLabel
}: AccountEditProps) {
    return (<>
        <form
            onSubmit={onSubmit}
            className="account-form"
        >
            <div className="account-form-fields">
                <input
                    placeholder="Account name"
                    value={accountName}
                    onChange={e => onNameChanged(e.target.value)}
                    required
                    className="login-input"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={accountPass}
                    onChange={e => onPasswordChanged(e.target.value)}
                    required
                    className="login-input"
                />
                <button
                    type="submit"
                    className="login-btn"
                    onClick={e => e.stopPropagation()}
                >{buttonLabel}</button>
            </div>
        </form>
    {error && <ErrorMessage>{error}</ErrorMessage>}
    {success && <LoadingMessage>{success}</LoadingMessage>}
    </>)
}