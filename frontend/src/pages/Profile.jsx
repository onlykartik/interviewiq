import { useEffect, useState } from 'react';
import { getMe, updateName } from '../api';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { logout } = useAuth();
  const [user, setUser] = useState(null);
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      const res = await getMe();
      setUser(res.data);
      setName(res.data.name || '');
    }
    load();
  }, []);

  async function save() {
    setSaving(true);
    await updateName(name);
    alert('Profile updated');
    setSaving(false);
  }

  if (!user) return <p>Loading profile...</p>;

  return (
    <div style={{ maxWidth: '400px' }}>
      <h2>Profile</h2>

      <p><strong>Email:</strong> {user.email}</p>

      <label>Name</label>
      <input
        value={name}
        onChange={e => setName(e.target.value)}
      />

      <button onClick={save} disabled={saving}>
        Save
      </button>

      <hr />

      <button onClick={logout} style={{ color: 'red' }}>
        Logout
      </button>
    </div>
  );
}