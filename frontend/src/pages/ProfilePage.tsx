import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import * as userApi from '../api/user.api';

export default function ProfilePage() {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleExport = async () => {
    if (!token) return;
    setExporting(true);
    try {
      const data = await userApi.exportUserData(token);
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `my-data-export-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err: any) {
      alert('Failed to export data: ' + err.message);
    } finally {
      setExporting(false);
    }
  };

  const handleDelete = async () => {
    if (!token) return;
    setDeleting(true);
    try {
      await userApi.deleteAccount(token);
      logout();
      navigate('/login');
    } catch (err: any) {
      alert('Failed to delete account: ' + err.message);
      setDeleting(false);
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-8 col-lg-6">
        <h1 className="mb-4">My Profile</h1>
        <div className="card mb-4">
          <div className="card-body">
            <h5 className="card-title">Account Information</h5>
            <p><strong>Email:</strong> {user?.email}</p>
            <p><strong>Account ID:</strong> {user?.id}</p>
          </div>
        </div>

        <div className="card mb-4">
          <div className="card-body">
            <h5 className="card-title">My Data (RGPD)</h5>
            <p className="text-muted">
              You have the right to export all your personal data. Click the button below to download a JSON file containing all your information and todos.
            </p>
            <button
              className="btn btn-outline-primary"
              onClick={handleExport}
              disabled={exporting}
            >
              <i className="fas fa-download me-2"></i>
              {exporting ? 'Exporting...' : 'Export My Data'}
            </button>
          </div>
        </div>

        <div className="card border-danger">
          <div className="card-body">
            <h5 className="card-title text-danger">Danger Zone</h5>
            <p className="text-muted">
              Permanently delete your account and all associated data. This action cannot be undone.
            </p>
            {!showDeleteConfirm ? (
              <button
                className="btn btn-outline-danger"
                onClick={() => setShowDeleteConfirm(true)}
              >
                <i className="fas fa-trash me-2"></i>
                Delete My Account
              </button>
            ) : (
              <div>
                <p className="text-danger fw-bold">Are you sure? This will permanently delete your account and all your data.</p>
                <button
                  className="btn btn-danger me-2"
                  onClick={handleDelete}
                  disabled={deleting}
                >
                  {deleting ? 'Deleting...' : 'Yes, delete my account'}
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
