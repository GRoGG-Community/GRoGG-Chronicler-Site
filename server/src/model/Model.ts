type id = number

interface Empire {
    id: id,
    name: string,
    lore?: string,
    stats?: string,
    ethics?: string,
    special?: string
}

interface Account {
    id: id,
    name: string
}

interface empireAccount {
    empireId: id,
    accountId: number
}