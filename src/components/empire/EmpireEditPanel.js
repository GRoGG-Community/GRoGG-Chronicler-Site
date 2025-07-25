export default function EmpireEditPanel({ name, empireInfo, onCancel }) {
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
            <form className="empire-edit-form" onSubmit={handleSave}>
                <label>
                    Lore:
                    <textarea
                        name="lore"
                        value={edit.lore || ''}
                        onChange={handleChange}
                        rows={3}
                    />
                </label>
                <label>
                    Stats:
                    <input name="stats" value={edit.stats || ''} onChange={handleChange} />
                </label>
                <label>
                    Ethics:
                    <input name="ethics" value={edit.ethics || ''} onChange={handleChange} />
                </label>
                <label>
                    Civics:
                    <input name="civics" value={edit.civics || ''} onChange={handleChange} />
                </label>
                <label>
                    Special Info:
                    <input name="special" value={edit.special || ''} onChange={handleChange} />
                </label>
                <div style={{display: 'flex', gap: '1rem', marginTop: '1rem'}}>
                    <button type="submit" className="empire-save-btn">Save</button>
                    <button type="button" className="empire-back-btn" onClick={onCancel}>Cancel</button>
                </div>
            </form>
        );
    }