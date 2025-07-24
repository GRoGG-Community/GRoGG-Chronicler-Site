export function getEmpireNames(empires) {
    return empires.map(e => e.name);
}

export function getEmpireAccount(empires, empireName) {
    const emp = empires.find(e => e.name === empireName);
    return emp && emp.account ? emp.account : null;
}