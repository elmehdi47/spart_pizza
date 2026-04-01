import { Router } from "express";
import crypto from "crypto";

const authRouter = Router();

const ADMIN_USERNAME = "spartpizza";
const ADMIN_PASSWORD = "34pizzaspart;";
const TOKEN_TTL_MS = 8 * 60 * 60 * 1000; // 8 hours

function getSecret(): string {
  return process.env.SESSION_SECRET ?? "spart-admin-secret-fallback";
}

function makeToken(username: string): string {
  const payload = JSON.stringify({ username, exp: Date.now() + TOKEN_TTL_MS });
  const encoded = Buffer.from(payload).toString("base64url");
  const sig = crypto.createHmac("sha256", getSecret()).update(encoded).digest("hex");
  return `${encoded}.${sig}`;
}

function verifyToken(token: string): { username: string } | null {
  try {
    const [encoded, sig] = token.split(".");
    if (!encoded || !sig) return null;
    const expected = crypto.createHmac("sha256", getSecret()).update(encoded).digest("hex");
    if (!crypto.timingSafeEqual(Buffer.from(sig, "hex"), Buffer.from(expected, "hex"))) return null;
    const payload = JSON.parse(Buffer.from(encoded, "base64url").toString());
    if (Date.now() > payload.exp) return null;
    return { username: payload.username };
  } catch {
    return null;
  }
}

authRouter.post("/auth/login", (req, res) => {
  const { username, password } = req.body as { username?: string; password?: string };
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    const token = makeToken(username);
    res.json({ token, username });
  } else {
    res.status(401).json({ error: "Invalid credentials" });
  }
});

authRouter.get("/auth/verify", (req, res) => {
  const auth = req.headers.authorization ?? "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  const result = verifyToken(token);
  if (result) {
    res.json({ valid: true, username: result.username });
  } else {
    res.status(401).json({ valid: false });
  }
});

export { verifyToken };
export default authRouter;
