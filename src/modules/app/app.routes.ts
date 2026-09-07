import { Router } from "express";

const router = Router();

router.get("/version", (_req, res) => {
  res.status(200).json({
    success: true,
    data: {
      version: "1.0.0",
      versionCode: 1,
      apkUrl:
        "https://github.com/HimeshRoy/locallens-app-apk/releases/latest/download/LocalLens.apk",
      releaseNotes: "Initial release of LocalLens.",
      forceUpdate: false,
    },
  });
});

export default router;