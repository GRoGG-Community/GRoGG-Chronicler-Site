import Account, { assertAccountArray } from "../models/Account";

export async function fetchAccountsRaw(): Promise<Array<Account>> {
    const res = await fetch('/api/accounts?ts=' + Date.now())
    let data = assertAccountArray(await res.json())

    return data;
}

export async function fetchAccounts(): Promise<Record<string, string>> {
    const data = await fetchAccountsRaw()

    return data.reduce((acc, val) => {
        acc[val.name] = val.password
        return acc
    }, {} as Record<string, string>)
}

// Using type references: Account["id"] = type of the id field in Account
export async function editAccount(id: Account["id"], name: Account["name"], password: Account["password"]) {
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

export async function createAccount(name: Account["name"], password: Account["password"]) {
    return await fetch('/api/accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            name: name,
            password: password
        })
    });
}

export async function deleteAccount(name: string): Promise<Response | undefined> {
    const accounts = await fetchAccountsRaw()
    const account = accounts.find(it => it.name === name)

    if (!account) {
        return
    }

    return await fetch(`/api/accounts/${account.id}`, 
        {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' }
        }
    )
}