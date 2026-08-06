export interface CreateVerificationRequestInput {
  reason?: string;

  documentUrl: string;
  documentPublicId: string;

  selfieUrl?: string;
  selfiePublicId?: string;
}