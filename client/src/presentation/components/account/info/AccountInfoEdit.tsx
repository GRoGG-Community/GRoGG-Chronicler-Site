import { ErrorMessage, LoadingMessage } from "../../common/Messages";
import { FormEventHandler } from "react";
import { AccountInfoEditProps } from '../../../../data/types/AccountTypes';

export default function AccountInfoEdit({ 
    error,
    success,
    accountName, 
    accountPass,
    loading,
    onSubmit,
    onNameChanged,
    onPasswordChanged,
    buttonLabel,
    isEditing,
    onCancel
}: AccountInfoEditProps) {
    const isFormValid = isEditing 
        ? accountName.trim() || accountPass.trim() // For editing, only need one field
        : accountName.trim() && accountPass.trim(); // For creation, need both fields

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
                    required={!isEditing}
                    className="login-input"
                    disabled={loading}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={accountPass}
                    onChange={e => onPasswordChanged(e.target.value)}
                    required={!isEditing}
                    className="login-input"
                    disabled={loading}
                />
                <div className="form-buttons">
                    <button
                        type="submit"
                        className="login-btn"
                        onClick={e => e.stopPropagation()}
                        disabled={!isFormValid || loading}
                    >{buttonLabel}</button>
                    {isEditing && (
                        <button
                            type="button"
                            className="cancel-btn"
                            onClick={onCancel}
                            disabled={loading}
                        >Cancel</button>
                    )}
                </div>
            </div>
        </form>
    {error && <ErrorMessage>{error}</ErrorMessage>}
    {success && <LoadingMessage>{success}</LoadingMessage>}
    </>)
}