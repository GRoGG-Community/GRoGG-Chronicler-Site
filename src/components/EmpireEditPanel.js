import React, { useState } from 'react';
import ActionButton from './ActionButton';
import FormField from './FormField';
import Card from './Card';

export default function EmpireEditPanel({ name, onCancel, empireInfo, saveEmpireInfo }) {
    const info = empireInfo[name] || {};
    const [edit, setEdit] = useState(info);

    function handleChange(e) {
        setEdit({ ...edit, [e.target.name]: e.target.value });
    }
    function handleSave(e) {
        e.preventDefault();
        saveEmpireInfo(name, edit).then(() => {
            onCancel();
        });
    }

    return (
        <Card className="empire-edit-form">
            <form onSubmit={handleSave}>
                <FormField
                    label="Lore:"
                    name="lore"
                    as="textarea"
                    value={edit.lore || ''}
                    onChange={handleChange}
                    rows={3}
                />
                <FormField
                    label="Stats:"
                    name="stats"
                    value={edit.stats || ''}
                    onChange={handleChange}
                />
                <FormField
                    label="Ethics:"
                    name="ethics"
                    value={edit.ethics || ''}
                    onChange={handleChange}
                />
                <FormField
                    label="Civics:"
                    name="civics"
                    value={edit.civics || ''}
                    onChange={handleChange}
                />
                <FormField
                    label="Special Info:"
                    name="special"
                    value={edit.special || ''}
                    onChange={handleChange}
                />
                <div className="actions-row">
                    <ActionButton type="submit" variant="primary" className="empire-save-btn">Save</ActionButton>
                    <ActionButton type="button" variant="secondary" className="empire-back-btn" onClick={onCancel}>Cancel</ActionButton>
                </div>
            </form>
        </Card>
    );
}
