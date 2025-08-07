import { AccountDataService } from "../../../data/services/AccountDataService";
import { EmpireDataService } from "../../../data/services/EmpireDataService";
import { EntityHandlerFactory, ACCOUNT_HANDLER_CONFIG } from "../../services/EntityHandlerFactory";
import AccountInfoEdit from "../../../presentation/components/account/info/AccountInfoEdit";
import { FormEvent, useState } from "react";
import { AccountInfoControllerProps } from '../../../data/types/AccountTypes';
import { useEntityState } from '../../hooks/infrastructure/useEntityState';
import { AccountCache, EmpireCache } from "../../../data/cache/EntityCacheManager";

export default function AccountInfoController({updateAccounts, accountName, accountPass, accountId, onCancel}: AccountInfoControllerProps) {
     const [name, setName] = useState(accountName || '');
     const [pass, setPass] = useState(accountPass || '');

     const entityState = useEntityState();

     function onSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()
        // Account is being editted
        if (accountId) {
            const id = typeof accountId === 'string' ? parseInt(accountId, 10) : accountId;
            
            // If the name is changing, we need to update empire links
            const isNameChanging = accountName && accountName !== name;
            
            // For editing, only update fields that have changed and are not empty
            const updateData: { name?: string; password?: string } = {};
            if (name.trim() && name !== accountName) {
                updateData.name = name;
            }
            if (pass.trim()) {
                updateData.password = pass;
            }
            
            // Don't proceed if no changes were made
            if (Object.keys(updateData).length === 0) {
                return;
            }
            
            // Use the existing editAccount function but with current values for unchanged fields
            const finalName = updateData.name || accountName || '';
            const finalPass = updateData.password || pass;
            
            AccountDataService.editAccount(id, finalName, finalPass).then(async () => {
                // If account name changed, update all empires linked to the old name
                if (isNameChanging && accountName) {
                    try {
                        const empires = await EmpireDataService.fetchEmpires();
                        const linkedEmpires = empires.filter((empire: any) => empire.account === accountName);
                        
                        // Update each linked empire to use the new account name
                        await Promise.all(
                            linkedEmpires.map((empire: any) => 
                                EmpireDataService.updateEmpire(empire.id.toString(), { ...empire, account: name })
                            )
                        );
                        
                        EmpireCache.invalidate(); // Clear empire cache after updates
                    } catch (error) {
                        console.error('Failed to update empire links after account rename:', error);
                    }
                }
                
                AccountCache.invalidate(); // Use consistent cache invalidation pattern
                updateAccounts(); // Keep for backwards compatibility if needed
            })
        } else { // Account is being created
            const createHandler = EntityHandlerFactory.createHandler(
                ACCOUNT_HANDLER_CONFIG,
                entityState,
                async () => { 
                    AccountCache.invalidate(); // Use consistent cache invalidation pattern
                    updateAccounts(); // Keep for backwards compatibility if needed
                }
            );
            
            createHandler(e, { name, password: pass }).then(() => {
                setName('');
                setPass('');
            });
        }
     }

     const buttonLabel = accountId ? "Update Account" : "Create Account" 

    return (<AccountInfoEdit
        accountName={name}
        accountPass={pass}
        error={entityState.error}
        success={entityState.success}
        loading={entityState.loading}
        onNameChanged={setName}
        onPasswordChanged={setPass}
        onSubmit={onSubmit}
        buttonLabel={buttonLabel}
        isEditing={!!accountId}
        onCancel={onCancel}
    />)
}