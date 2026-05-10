import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { api } from '../lib/api';
import { dashboardPathForRole, isUserRole, loginPathForRole, roleLabel, signupPathForRole, USER_ROLES } from '../lib/navigation';
import type { LoginResponse, OTPResponse, UploadResponse, UserRole } from '../lib/types';
import { useSessionStore } from '../store/session';

type RegisterForm = {
  name: string;
  phone: string;
  email: string;
  password: string;
  address: string;
  role: UserRole;
  vehicle_number: string;
};

const initialForm: RegisterForm = {
  name: '',
  phone: '',
  email: '',
  password: '',
  address: '',
  role: 'citizen',
  vehicle_number: ''
};

export function RegisterPage() {
  const { role: roleParam } = useParams();
  const navigate = useNavigate();
  const user = useSessionStore((state) => state.user);
  const setSession = useSessionStore((state) => state.setSession);
  const expectedRole: UserRole | null = isUserRole(roleParam) ? roleParam : null;
  const hasInvalidRolePath = Boolean(roleParam && !expectedRole);
  const [form, setForm] = useState<RegisterForm>(initialForm);
  const [billFile, setBillFile] = useState<File | null>(null);
  const [billPath, setBillPath] = useState<string | null>(null);
  const [otpCode, setOtpCode] = useState('');
  const [otpResponse, setOtpResponse] = useState<OTPResponse | null>(null);
  const [otpVerified, setOtpVerified] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isBusy, setIsBusy] = useState(false);

  const canRegister = useMemo(() => otpVerified && !isBusy, [isBusy, otpVerified]);
  const effectiveRole = expectedRole ?? form.role;
  const requiresOtp = effectiveRole !== 'admin';
  const requiresBillUpload = effectiveRole === 'citizen';
  const showsVehicleNumber = effectiveRole === 'driver';
  const addressLabel = effectiveRole === 'citizen' ? 'Household address' : 'Contact / office address';

  useEffect(() => {
    if (expectedRole) {
      setForm((current) => ({ ...current, role: expectedRole }));
    }
  }, [expectedRole]);

  useEffect(() => {
    if (!requiresOtp) {
      setOtpResponse(null);
      setOtpCode('');
      setOtpVerified(true);
      setErrorMessage(null);
      setStatusMessage('Admin signup does not require OTP verification.');
    } else {
      setOtpVerified(false);
      setStatusMessage(null);
    }
  }, [requiresOtp]);

  if (user && (!expectedRole || user.role === expectedRole)) {
    return <Navigate to={dashboardPathForRole(user.role)} replace />;
  }

  if (hasInvalidRolePath) {
    return (
      <main className="grid min-h-screen place-items-center bg-slate-100 px-6 py-10">
        <section className="glass-card w-full max-w-lg rounded-[2rem] p-8">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-rose-600">Invalid portal</p>
          <h1 className="mt-3 text-3xl font-black text-slate-950">Unknown signup role</h1>
          <p className="mt-4 text-slate-600">Use one of the supported role signup portals below.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            {USER_ROLES.map((role) => (
              <Link key={role} className="rounded-full bg-slate-950 px-4 py-2 text-sm font-bold text-white" to={signupPathForRole(role)}>
                {roleLabel(role)} signup
              </Link>
            ))}
          </div>
        </section>
      </main>
    );
  }

  function updateField<K extends keyof RegisterForm>(field: K, value: RegisterForm[K]) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function uploadBillIfNeeded(): Promise<string | null> {
    if (!requiresBillUpload || !billFile || billPath) {
      return billPath;
    }
    const data = new FormData();
    data.append('file', billFile);
    const response = await api.post<UploadResponse>('/uploads/electricity-bills', data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    setBillPath(response.data.public_url);
    return response.data.public_url;
  }

  async function handleRequestOtp() {
    if (!requiresOtp) {
      return;
    }
    setErrorMessage(null);
    setStatusMessage(null);
    setIsBusy(true);
    try {
      const response = await api.post<OTPResponse>('/auth/otp/request', { phone: form.phone });
      setOtpResponse(response.data);
      setStatusMessage(response.data.message);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unable to request OTP.');
    } finally {
      setIsBusy(false);
    }
  }

  async function handleVerifyOtp() {
    if (!requiresOtp) {
      return;
    }
    setErrorMessage(null);
    setStatusMessage(null);
    setIsBusy(true);
    try {
      const response = await api.post<OTPResponse>('/auth/otp/verify', { phone: form.phone, code: otpCode });
      setOtpVerified(true);
      setStatusMessage(response.data.message);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'OTP verification failed.');
    } finally {
      setIsBusy(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (requiresOtp && !otpVerified) {
      setErrorMessage('Verify the OTP before creating the account.');
      return;
    }
    setErrorMessage(null);
    setStatusMessage(null);
    setIsBusy(true);
    try {
      const electricity_bill_path = await uploadBillIfNeeded();
      await api.post('/auth/register', {
        ...form,
        email: form.email || null,
        vehicle_number: showsVehicleNumber ? form.vehicle_number : null,
        electricity_bill_path: requiresBillUpload ? electricity_bill_path : null
      });
      const loginResponse = await api.post<LoginResponse>('/auth/login', {
        phone: form.phone,
        password: form.password
      });
      setSession(loginResponse.data.access_token, loginResponse.data.user);
      navigate(dashboardPathForRole(loginResponse.data.user.role));
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Registration failed.');
    } finally {
      setIsBusy(false);
    }
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    setBillFile(file);
    setBillPath(null);
  }

  return (
    <main className="min-h-screen bg-slate-100 px-6 py-10">
      <section className="glass-card mx-auto max-w-2xl rounded-[2rem] p-8">
        <p className="text-sm font-bold uppercase tracking-[0.3em] text-emerald-600">Household verification</p>
        <h1 className="mt-3 text-3xl font-black text-slate-950">
          {expectedRole ? `${roleLabel(expectedRole)} signup` : 'Register for smart waste pickups'}
        </h1>
        <form className="mt-8 grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit}>
          <input className="rounded-2xl border border-slate-200 px-4 py-3" placeholder="Full name" value={form.name} onChange={(event) => updateField('name', event.target.value)} />
          <input className="rounded-2xl border border-slate-200 px-4 py-3" placeholder="Phone" value={form.phone} onChange={(event) => updateField('phone', event.target.value)} />
          <input className="rounded-2xl border border-slate-200 px-4 py-3" placeholder="Email" value={form.email} onChange={(event) => updateField('email', event.target.value)} />
          <input className="rounded-2xl border border-slate-200 px-4 py-3" type="password" placeholder="Password" value={form.password} onChange={(event) => updateField('password', event.target.value)} />
          {expectedRole ? (
            <div className="grid place-items-center rounded-2xl border border-dashed border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700">
              Role: {roleLabel(expectedRole)}
            </div>
          ) : (
            <select className="rounded-2xl border border-slate-200 px-4 py-3" value={form.role} onChange={(event) => updateField('role', event.target.value as UserRole)}>
              <option value="citizen">Citizen</option>
              <option value="driver">Driver</option>
              <option value="admin">Admin</option>
            </select>
          )}
          {showsVehicleNumber ? (
            <input className="rounded-2xl border border-slate-200 px-4 py-3" placeholder="Vehicle number" value={form.vehicle_number} onChange={(event) => updateField('vehicle_number', event.target.value)} />
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-3 text-sm text-slate-400">{effectiveRole === 'admin' ? 'Admin registration does not need a vehicle number.' : 'Driver registration requires a vehicle number.'}</div>
          )}
          <textarea className="rounded-2xl border border-slate-200 px-4 py-3 sm:col-span-2" placeholder={addressLabel} rows={4} value={form.address} onChange={(event) => updateField('address', event.target.value)} />
          {requiresBillUpload ? (
            <label className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 sm:col-span-2">
              Electricity bill upload
              <input className="mt-2 block w-full text-sm font-normal" type="file" accept=".pdf,image/*" onChange={handleFileChange} />
              <span className="mt-2 block text-xs font-normal text-slate-500">{billFile ? billFile.name : billPath ? `Uploaded: ${billPath}` : 'PDF or image proof accepted.'}</span>
            </label>
          ) : null}
          {requiresOtp ? (
            <div className="sm:col-span-2">
              <div className="grid gap-3 md:grid-cols-[1fr_auto_auto]">
                <input className="rounded-2xl border border-slate-200 px-4 py-3" placeholder="Enter OTP" value={otpCode} onChange={(event) => setOtpCode(event.target.value)} />
                <button className="rounded-2xl bg-emerald-600 px-5 py-3 font-bold text-white" type="button" onClick={handleRequestOtp} disabled={!form.phone || isBusy}>
                  Request OTP
                </button>
                <button className="rounded-2xl bg-slate-950 px-5 py-3 font-bold text-white" type="button" onClick={handleVerifyOtp} disabled={!otpCode || isBusy || !otpResponse}>
                  Verify OTP
                </button>
              </div>
            </div>
          ) : null}
          <button className="rounded-2xl bg-cyan-600 px-5 py-3 font-bold text-white sm:col-span-2 disabled:opacity-60" type="submit" disabled={!canRegister}>
            Complete registration
          </button>
        </form>
        {statusMessage ? <p className="mt-4 rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{statusMessage}</p> : null}
        {errorMessage ? <p className="mt-4 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{errorMessage}</p> : null}
        <p className="mt-2 text-xs text-slate-500">
          {requiresOtp
            ? otpResponse
              ? `Delivery channel: ${otpResponse.delivery_channel}`
              : 'Request an OTP to begin phone verification.'
            : 'Admin signup does not require OTP verification.'}
        </p>
        <p className="mt-6 text-sm text-slate-600">
          Already registered?{' '}
          <Link className="font-bold text-emerald-700" to={expectedRole ? loginPathForRole(expectedRole) : '/login'}>
            Login
          </Link>
          .
        </p>
        <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-500">
          {USER_ROLES.map((role) => (
            <Link key={role} className="rounded-full bg-white px-3 py-1.5 font-semibold text-slate-700" to={signupPathForRole(role)}>
              {roleLabel(role)} signup
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
