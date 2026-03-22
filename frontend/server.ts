import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import cors from "cors";
import { fileURLToPath } from "url";
import { createProxyMiddleware } from "http-proxy-middleware";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;
  const BACKEND_URL = process.env.SPRING_BOOT_URL || "http://localhost:8080";

  app.use(cors());

  // Proxy all /api requests to the Spring Boot backend
  app.use("/api", createProxyMiddleware({
    target: BACKEND_URL,
    changeOrigin: true,
    on: {
      error: (err, req, res: any) => {
        console.error(`[Proxy Error] ${err.message}`);
        if (!res.headersSent) {
          res.status(500).json({ error: "Backend unreachable", details: err.message });
        }
      }
    }
  }));

  app.use(express.json());

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
