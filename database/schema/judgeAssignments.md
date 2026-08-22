# Judge Assignments Collection

**Collection Path**: `/judgeAssignments`

## Purpose
A junction collection mapping Judges to Teams. Determines which submissions a judge is authorized to view and evaluate.

## Fields
- `assignmentId` (string): Document ID.
- `judgeUid` (string): UID of the judge.
- `teamId` (string): Assigned team.
- `status` (string): `pending` | `evaluated`
- `assignedTimestamp` (timestamp)
- `completedTimestamp` (timestamp | null)

## Relationships
- **Users**: Links to `/users` (judge).
- **Teams**: Links to `/teams`.

## Important Queries
- **My Assignments**: Judge UI queries `where('judgeUid', '==', uid)`.
- **Team's Judges**: Admin queries `where('teamId', '==', teamId)` to ensure proper coverage (e.g., each team evaluated by 3 judges).

## Security Considerations
- Only **Admins** can create or modify assignments.
- Judges can read their own assignments.
- This collection acts as the **Authorization Control** for Firestore rules. A rule will check `exists(/databases/$(database)/documents/judgeAssignments/$(assignmentId))` to allow a judge to read a team's submission.
