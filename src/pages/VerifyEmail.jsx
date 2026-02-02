import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("Verifying your email...");

  useEffect(() => {
    const verifyUser = async () => {
  const accessToken = searchParams.get("access_token");
  const refreshToken = searchParams.get("refresh_token");
  const type = searchParams.get("type");

  if (!accessToken || !type) {
    setStatus("Invalid or expired verification link.");
    return;
  }

  try {
    const res = await fetch("https://your-backend.com/api/verify-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        accessToken,
        refreshToken,
        type,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setStatus(data.error || "Verification failed");
      return;
    }

    setStatus("✅ Email verified successfully!");
  } catch (err) {
    setStatus("Something went wrong.");
  }
};

    verifyUser();
  }, [searchParams]);

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h2>Email Verification</h2>
      <p>{status}</p>
    </div>
  );
};

export default VerifyEmail;