# Judges Architecture

**Note**: There is no separate `/judges` collection for authentication. Judge identity is handled in `/users` with `role: 'judge'`.

## Purpose
Judges evaluate finalized submissions based on specific tracks or domain expertise.

## Data Model (Embedded in `/users`)
When `role == 'judge'`, the user document contains additional fields:
- `judgeProfile` (object):
  - `expertise` (array of strings)
  - `assignedTracks` (array of strings)
  - `organization` (string)
- `assignmentStatus` (string): `active` | `completed`

## Important Queries
- **List All Judges**: Admin fetches `where('role', '==', 'judge')`.

## Security Considerations
- Admin can provision judge accounts via the Firebase Admin SDK.
- Participants cannot view judge profiles unless explicitly required by a public dashboard (currently restricted).
