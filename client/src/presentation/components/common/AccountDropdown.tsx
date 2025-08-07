import React from 'react';
import AccountBusinessController from '../../../business/controllers/AccountBusinessController';
import Account from '../../../data/models/Account';

interface AccountDropdownProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
}

const AccountDropdown: React.FC<AccountDropdownProps> = ({ value, onChange, label }) => {
  return (
    <AccountBusinessController>
      {({ accounts, loading }: { accounts: Account[], loading: boolean }) => {
        if (loading) {
          return (
            <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {label && <span>{label}:</span>}
              <select disabled>
                <option>Loading accounts...</option>
              </select>
            </label>
          );
        }

        return (
          <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {label && <span>{label}:</span>}
            <select value={value} onChange={(e) => onChange(e.target.value)}>
              <option value="">Select account...</option>
              {accounts.map(account => (
                <option key={account.name} value={account.name}>
                  {account.name}
                </option>
              ))}
            </select>
          </label>
        );
      }}
    </AccountBusinessController>
  );
};

export default AccountDropdown;
