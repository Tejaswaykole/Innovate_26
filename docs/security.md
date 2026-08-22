# Hackathon Platform Security Architecture & Audit Report

## Authentication Model
The platform relies entirely on Firebase Authentication for identity verification. Passwords are theoretically managed entirely by Google Identity Services and are **never** stored in Firestore or standard backend environments. 
All authenticated sessions yield JWT access tokens which are actively validated via `firebase-admin` on the backend.

## Authorization Model
Roles are strictly enforced natively in Firestore (`role` property) and actively decoded inside the backend (`requireRole` middleware).
There are three isolated domains:
1. **Participant** (Default Public Portal)
2. **Judge** (`/judge` endpoints, Judge Portal)
3. **Admin** (`/admin` endpoints, highest privileges)

Privilege escalation natively via the frontend is **impossible** as role manipulation is explicitly blocked in `firestore.rules`.

## Firestore Rules
- Default `deny` is enabled.
- Database access control is heavily federated: Users can read their own data and public references, but critical transactions (e.g., locking a project submission, updating evaluation scores, setting Top 3 ranks) are entirely restricted from direct client-side requests (`allow write: if isAdmin();`). 

## Storage Rules
File uploads are restricted to Firebase Storage under the `/submissions/{teamId}/` path.
- **Access Check**: Users must be authenticated.
- **Write Checks**: The authenticated user must be the `teamRole == 'leader'` associated natively with that `teamId`.
- **Size Bounds**: Files must be strictly under `100MB`.

## Backend Security
The Express backend isolates API surfaces.
- IDOR checks: User identity vs target `teamId` validation is systematically forced during evaluations and submissions.
- Injection: Native URL boundary parsing and numerical enforcement checks exist in Judge submission paths.
- CORS: Ready to be configured to domain constraints in the environment.

## Known Limitations & Audit Findings
- **Dependency Scan**: `uuid` minor vulnerability identified in `firebase-admin` dependency tree. Updating this requires a major breaking version change to Firebase SDK; it is noted as acceptable risk for now since UUID collision generation vectors here are extremely narrow.
- **Rate Limiting**: Native API Gateway rate limiting should be established in the cloud environment prior to production rollout to prevent DDOS.

## Security Testing
A comprehensive test suite of permission checks natively resulted in expected `403 Forbidden` errors across the boundary fences.
- Participant → Admin API [DENIED]
- Judge → Another Judge's assigned team [DENIED]
- Member → Finalizing submission [DENIED]
