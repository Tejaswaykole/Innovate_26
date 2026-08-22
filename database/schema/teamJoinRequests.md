# Team Join Requests Collection

**Collection Path**: `/teamJoinRequests`

## Purpose
Manages invitations and requests for participants to join teams using the 6-character team code.

## Fields
- `requestId` (string): Document ID.
- `teamId` (string): Target team.
- `participantUid` (string): Participant requesting to join.
- `participantName` (string): Denormalized for UI.
- `status` (string): `pending` | `accepted` | `rejected` | `cancelled` | `expired`
- `createdTimestamp` (timestamp)
- `updatedTimestamp` (timestamp)
- `decisionTimestamp` (timestamp | null)

## Relationships
- **Teams**: Links to the target `/teams` document.
- **Users**: Links to the requesting `/users` participant.

## Important Queries
- **My Active Requests**: `where('participantUid', '==', uid) && where('status', '==', 'pending')` (Limit 5)
- **Team Pending Requests**: `where('teamId', '==', teamId) && where('status', '==', 'pending')`

## Security Considerations
- **Limit Enforcement**: Max 5 active requests per participant is enforced via a backend transaction upon creation.
- **Acceptance Logic**: Only the `leaderUid` of the target `teamId` can accept the request. This operation must be a **backend transaction** because it needs to:
  1. Add member to `teams` array.
  2. Update `users.teamId`.
  3. Mark this request as `accepted`.
  4. Mark other pending requests for this participant as `cancelled`.
