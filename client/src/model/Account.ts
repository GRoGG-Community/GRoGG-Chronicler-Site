import * as st from "simple-runtypes";

export const accountRuntype = st.record({
    id: st.integer(),
    name: st.string(),
    password: st.string()
})

type Account = ReturnType<typeof accountRuntype>
export default Account

export function isAccount(obj: any): obj is Account {
    return st.use(accountRuntype, obj).ok
}

export function assertAccount(obj: any): Account {
    return accountRuntype(obj)
}

export function assertAccountArray(arr: any): Array<Account> {
    if (Array.isArray(arr)) {
        return arr.map(acc => {
            try {
                return assertAccount(acc)
            } catch (e) {
                throw new Error(`Received invalid account: ${JSON.stringify(acc)}`, {cause: e})
            }
        })
    } else {
        throw TypeError(`Expected arr to be of type "Array" but was ${typeof arr}`)
    }
}


/**
 * @deprecated
 */
export type AccountMap = {
    [name: string]: string
}