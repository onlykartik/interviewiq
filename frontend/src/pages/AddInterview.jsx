import { addInterview } from '../api';
import { useNavigate } from 'react-router-dom';
import { addCompany, getCompanies } from '../api';
import { useEffect, useState } from 'react';


export default function AddInterview() {
    const [companies, setCompanies] = useState([]);
    const [companyId, setCompanyId] = useState('');
    const [newCompany, setNewCompany] = useState('');
    const [role, setRole] = useState('');
    const [date, setDate] = useState('');
    const [result, setResult] = useState('Pending');
    const [error, setError] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        async function loadCompanies() {
        const res = await getCompanies();
        setCompanies(res.data);
        }
        loadCompanies();
    }, []);

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');

        try {
        let finalCompanyId = companyId;

        // ➕ Add new company if provided
        if (!companyId && newCompany) {
            const res = await addCompany(newCompany);
            finalCompanyId = res.data.id;
        }

        if (!finalCompanyId) {
            return setError('Please select or add a company');
        }

        await addInterview({
            company_id: finalCompanyId,
            role,
            interview_date: date,
            result
        });

        navigate('/interviews');

        } catch (err) {
        setError('Failed to add interview');
        }
    }

    // ⛔ Prevent past dates
    const today = new Date().toISOString().split('T')[0];

    return (
        <div>
        <h2>Add Interview</h2>

        <form onSubmit={handleSubmit}>

            <label>Company</label>
            <select
            value={companyId}
            onChange={e => setCompanyId(e.target.value)}
            >
            <option value="">Select company</option>
            {companies.map(c => (
                <option key={c.id} value={c.id}>
                {c.name}
                </option>
            ))}
            </select>

            <p>or add new company</p>
            <input
            placeholder="New company name"
            value={newCompany}
            onChange={e => setNewCompany(e.target.value)}
            />

            <label>Role</label>
            <input
            required
            value={role}
            onChange={e => setRole(e.target.value)}
            />

            <label>Interview Date</label>
            <input
            type="date"
            min={today}
            required
            value={date}
            onChange={e => setDate(e.target.value)}
            />

            <label>Result</label>
            <select
            value={result}
            onChange={e => setResult(e.target.value)}
            >
            <option>Pending</option>
            <option>Selected</option>
            <option>Rejected</option>
            </select>

            <button type="submit">Save Interview</button>
        </form>

        {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
}