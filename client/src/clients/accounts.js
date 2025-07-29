export async function fetchAccountsRaw() {
    const res = await fetch('/api/accounts?ts=' + Date.now())
    let data = await res.json()

    return data;
}

export async function fetchAccounts() {
    let data = await fetchAccountsRaw()
    data = data.reduce((acc, val) => {
        acc[val.name] = val.password
        return acc
    }, {})

    return data;
}

export async function deleteAccount(name) {
    const accounts = await fetchAccountsRaw()
    const account = accounts.find(it => it.name === name)

    if (!account) {
        console.log(`No account with name ${name}. Returning...`)
        return
    }

    return fetch(`/api/accounts/${account.id}`, 
        {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' }
        }
    )
}