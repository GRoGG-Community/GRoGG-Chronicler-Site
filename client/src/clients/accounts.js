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

export async function editAccount(id, name, password) {
    return await fetch(`api/accounts/${id}`,{ 
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            id: id, 
            name: name, 
            password: password
        })
    })
}

export async function deleteAccount(name) {
    const accounts = await fetchAccountsRaw()
    const account = accounts.find(it => it.name === name)

    if (!account) {
        console.log(`No account with name ${name}. Returning...`)
        return
    }

    return await fetch(`/api/accounts/${account.id}`, 
        {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' }
        }
    )
}