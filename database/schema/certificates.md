# Certificates Collection

**Collection Path**: `/certificates`

## Purpose
Tracks generated certificates issued to participants.

## Fields
- `certificateId` (string): Document ID.
- `participantUid` (string): Owner of the certificate.
- `teamId` (string | null): Associated team (if applicable).
- `type` (string): `winner` | `participant`
- `status` (string): `generated` | `revoked`
- `storageUrl` (string): Firebase Storage download URL or path.
- `verificationId` (string): Unique hash for public verification.
- `issuedTimestamp` (timestamp)
- `createdTimestamp` (timestamp)

## Relationships
- **Users**: 1:N relationship (User -> Certificates).

## Important Queries
- **My Certificates**: `where('participantUid', '==', uid)`.
- **Public Verification**: `where('verificationId', '==', id)`.

## Security Considerations
- Read-only for the owner `participantUid`.
- Write-only for Admin / Backend Worker.
- Final artwork file resides in Firebase Storage under `/certificates/`.
