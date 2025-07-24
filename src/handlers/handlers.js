// --- Account handlers ---
export function handleCreateAccount(
    e,
    newAccountName,
    newAccountPass,
    accounts,
    setAccountError,
    setAccountSuccess,
    setAccountsTabLoading,
    setAccounts,
    setNewAccountName,
    setNewAccountPass
) {
    e.preventDefault();
    setAccountError('');
    setAccountSuccess('');
    setAccountsTabLoading(true);
    const name = newAccountName.trim();
    const pass = newAccountPass.trim();
    if (!name || !pass) {
        setAccountError('Account name and password are required.');
        setAccountsTabLoading(false);
        return;
    }
    // Fetch latest accounts.json
    fetch('/accounts.json?ts=' + Date.now())
        .then(res => res.json())
        .then(data => {
            if (data[name]) {
                setAccountError('Account name already exists.');
                setAccountsTabLoading(false);
                return;
            }
            // Use backend API for creation
            return fetch('/api/accounts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, pass })
            })
            .then(res => res.json())
            .then(result => {
                if (result.success) {
                    setAccounts({ ...data, [name]: pass });
                    setNewAccountName('');
                    setNewAccountPass('');
                    setAccountSuccess('Account created successfully.');
                } else {
                    setAccountError(result.error || 'Failed to create account.');
                }
            });
        })
        .catch(() => setAccountError('Failed to create account.'))
        .finally(() => setAccountsTabLoading(false));
}

export function handleDeleteAccount(
    acc,
    setEditAccountLoading,
    setEditAccountError,
    setAccounts,
    setAccountSuccess
) {
    setEditAccountLoading(true);
    setEditAccountError('');
    if (!window.confirm(`Delete account "${acc}"? This cannot be undone.`)) {
        setEditAccountLoading(false);
        return;
    }
    fetch('/accounts.json?ts=' + Date.now())
        .then(res => res.json())
        .then(data => {
            if (!data[acc]) {
                setEditAccountError('Account does not exist.');
                setEditAccountLoading(false);
                return;
            }
            // Use backend API for deletion
            return fetch('/api/accounts/delete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: acc })
            })
            .then(res => res.json())
            .then(result => {
                if (result.success) {
                    const updated = { ...data };
                    delete updated[acc];
                    setAccounts(updated);
                    setAccountSuccess('Account deleted.');
                } else {
                    setEditAccountError(result.error || 'Failed to delete account.');
                }
            });
        })
        .catch(() => setEditAccountError('Failed to delete account.'))
        .finally(() => setEditAccountLoading(false));
}

export function handleRenameAccount(
    e,
    editAccount,
    editAccountName,
    setEditAccountLoading,
    setEditAccountError,
    setAccounts,
    setEditAccount,
    setAccountSuccess
) {
    e.preventDefault();
    setEditAccountLoading(true);
    setEditAccountError('');
    const newName = editAccountName.trim();
    if (!newName) {
        setEditAccountError('Account name is required.');
        setEditAccountLoading(false);
        return;
    }
    fetch('/accounts.json?ts=' + Date.now())
        .then(res => res.json())
        .then(data => {
            if (!data[editAccount]) {
                setEditAccountError('Account does not exist.');
                setEditAccountLoading(false);
                return;
            }
            if (data[newName]) {
                setEditAccountError('Account name already exists.');
                setEditAccountLoading(false);
                return;
            }
            // Use backend API for rename
            return fetch('/api/accounts/rename', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ oldName: editAccount, newName })
            })
            .then(res => res.json())
            .then(result => {
                if (result.success) {
                    const updated = { ...data };
                    updated[newName] = updated[editAccount];
                    delete updated[editAccount];
                    setAccounts(updated);
                    setEditAccount(null);
                    setAccountSuccess('Account renamed successfully.');
                } else {
                    setEditAccountError(result.error || 'Failed to rename account.');
                }
            });
        })
        .catch(() => setEditAccountError('Failed to rename account.'))
        .finally(() => setEditAccountLoading(false));
}

export function handleChangePassword(
    e,
    editAccount,
    editAccountPass,
    setEditAccountLoading,
    setEditAccountError,
    setAccounts,
    setEditAccount,
    setAccountSuccess
) {
    e.preventDefault();
    setEditAccountLoading(true);
    setEditAccountError('');
    const newPass = editAccountPass.trim();
    if (!newPass) {
        setEditAccountError('Password is required.');
        setEditAccountLoading(false);
        return;
    }
    fetch('/accounts.json?ts=' + Date.now())
        .then(res => res.json())
        .then(data => {
            if (!data[editAccount]) {
                setEditAccountError('Account does not exist.');
                setEditAccountLoading(false);
                return;
            }
            // Use backend API for password change
            return fetch('/api/accounts/password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: editAccount, pass: newPass })
            })
            .then(res => res.json())
            .then(result => {
                if (result.success) {
                    setAccounts({ ...data, [editAccount]: newPass });
                    setEditAccount(null);
                    setAccountSuccess('Password changed successfully.');
                } else {
                    setEditAccountError(result.error || 'Failed to change password.');
                }
            });
        })
        .catch(() => setEditAccountError('Failed to change password.'))
        .finally(() => setEditAccountLoading(false));
}

// --- Empire handlers ---
export function handleCreateEmpire(
    e,
    newEmpireName,
    empires,
    setNewEmpireError,
    setNewEmpireLoading,
    setEmpires,
    setNewEmpireName
) {
    e.preventDefault();
    setNewEmpireError('');
    setNewEmpireLoading(true);
    const name = newEmpireName.trim();
    if (!name) {
        setNewEmpireError('Empire name is required.');
        setNewEmpireLoading(false);
        return;
    }
    fetch('/empires.json?ts=' + Date.now())
        .then(res => res.json())
        .then(data => {
            if (data.some(e => e.name === name)) {
                setNewEmpireError('Empire name already exists.');
                setNewEmpireLoading(false);
                return;
            }
            // Use backend API for creation
            return fetch('/api/empires/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name })
            })
            .then(res => res.json())
            .then(result => {
                if (result.success) {
                    setEmpires([...data, { name, account: null }]);
                    setNewEmpireName('');
                } else {
                    setNewEmpireError(result.error || 'Failed to create empire.');
                }
            });
        })
        .catch(() => setNewEmpireError('Failed to create empire.'))
        .finally(() => setNewEmpireLoading(false));
}

export function handleDeleteEmpire(
    empireName,
    setNewEmpireLoading,
    setNewEmpireError,
    setEmpires
) {
    setNewEmpireLoading(true);
    setNewEmpireError('');
    if (!window.confirm(`Delete empire "${empireName}"? This cannot be undone.`)) {
        setNewEmpireLoading(false);
        return;
    }
    fetch('/empires.json?ts=' + Date.now())
        .then(res => res.json())
        .then(data => {
            if (!data.some(e => e.name === empireName)) {
                setNewEmpireError('Empire does not exist.');
                setNewEmpireLoading(false);
                return;
            }
            // Use backend API for deletion
            return fetch('/api/empires/delete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: empireName })
            })
            .then(res => res.json())
            .then(result => {
                if (result.success) {
                    setEmpires(data.filter(e => e.name !== empireName));
                } else {
                    setNewEmpireError(result.error || 'Failed to delete empire.');
                }
            });
        })
        .catch(() => setNewEmpireError('Failed to delete empire.'))
        .finally(() => setNewEmpireLoading(false));
}

export function handleLinkAccount(empireName, accountName) {
    fetch('/api/empires/link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ empireName, accountName })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            setEmpires(prev =>
                prev.map(e => e.name === empireName ? { ...e, account: accountName } : e)
            );
        }
    });
}
export function handleUnlinkAccount(empireName) {
    fetch('/api/empires/unlink', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ empireName })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            setEmpires(prev =>
                prev.map(e => e.name === empireName ? { ...e, account: null } : e)
            );
        }
    });
}