import { Router } from "express";

import authRoutes from "../modules/auth/auth.routes.js";
import categoryRoutes from "../modules/category/category.routes.js";
import placeRoutes from "../modules/place/place.routes.js";
import placeImageRoutes from "../modules/place-image/place-image.routes.js";
import reviewRoutes from "../modules/review/review.routes.js";
import favoriteRoutes from "../modules/favorite/favorite.routes.js";
import businessClaimRoutes from "../modules/business-claim/business-claim.routes.js";
import collectionRoutes from "../modules/collection/collection.routes.js";
import userRoutes from "../modules/user/user.routes.js";
import aiRoutes from "../modules/ai/ai.routes.js";
import locationRoutes from "../modules/location/location.routes.js";

const router = Router();

router.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "LocalLens AI API is running",
  });
});

router.use("/auth", authRoutes);
router.use("/categories", categoryRoutes);
router.use("/places", placeRoutes);
router.use("/places", placeImageRoutes);
router.use("/reviews", reviewRoutes);
router.use("/favorites", favoriteRoutes);
router.use("/business-claims", businessClaimRoutes);
router.use("/collections", collectionRoutes);
router.use("/users", userRoutes);
router.use("/location", locationRoutes);
router.use("/ai", aiRoutes);

export default router;
