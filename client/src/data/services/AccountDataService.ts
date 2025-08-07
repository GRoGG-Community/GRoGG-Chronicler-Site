/**
 * AccountDataService
 * Data layer service for account HTTP operations and data persistence.
 * Handles all API communication for account entities.
 */

import Account, { assertAccountArray } from "../models/Account";

export class AccountDataService {
    /**
     * Fetch all accounts as array from API
     */
    static async fetchAccountsRaw(): Promise<Array<Account>> {
        const res = await fetch('/api/accounts?ts=' + Date.now());
        let data = assertAccountArray(await res.json());
        return data;
    }

    /**
     * Fetch accounts as name-password map
     */
    static async fetchAccounts(): Promise<Record<string, string>> {
        const data = await this.fetchAccountsRaw();
        return data.reduce((acc, val) => {
            acc[val.name] = val.password;
            return acc;
        }, {} as Record<string, string>);
    }

    /**
     * Update an existing account
     */
    static async editAccount(id: Account["id"], name: Account["name"], password: Account["password"]) {
        return await fetch(`api/accounts/${id}`, { 
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: id, 
                name: name, 
                password: password
            })
        });
    }

    /**
     * Create a new account
     */
    static async createAccount(name: Account["name"], password: Account["password"]) {
        return await fetch('/api/accounts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: name,
                password: password
            })
        });
    }

    /**
     * Delete an account by name
     */
    static async deleteAccount(name: string): Promise<Response | undefined> {
        const accounts = await this.fetchAccountsRaw();
        const account = accounts.find(it => it.name === name);

        if (!account) {
            return;
        }

        return await fetch(`/api/accounts/${account.id}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
