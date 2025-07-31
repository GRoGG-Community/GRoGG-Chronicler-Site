import Account, { AccountMap, assertAccountArray } from "../model/Account";

export async function fetchAccounts(): Promise<Array<Account>> {
    const res = await fetch('/api/accounts')
    let data = assertAccountArray(await res.json())

    return data;
}

/**
 * 
 * @deprecated Migrate code to use the fetchAccounts() method
 * @returns a Map of username to password wrapped in a Promise
 */
export async function fetchAccountMap(): Promise<AccountMap> {
    const data = await fetchAccounts()

    return data.reduce((acc, val) => {
        acc[val.name] = val.password
        return acc
    }, {} as AccountMap)
}

// Using type references: Account["id"] = type of the id field in Account
export async function editAccount(id: Account["id"], name: Account["name"], password: Account["password"]) {
    return await fetch(`api/accounts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            id: id,
            name: name,
            password: password
        })
    })
}

export async function deleteAccount(name: string): Promise<Response | undefined> {
    const accounts = await fetchAccounts()
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