import { Router } from "express";

const router = Router();

router.get("/version", (_req, res) => {
  res.status(200).json({
    success: true,
    data: {
  version: "1.0.1",
  versionCode: 3,
  apkUrl:
    "https://github.com/HimeshRoy/locallens-app-apk/releases/latest/download/LocalLens.apk",
  releaseNotes: "Bug fixes and improvements.",
  forceUpdate: false,
},
  });
});

export default router;