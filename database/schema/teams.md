# Teams Collection

**Collection Path**: `/teams`

## Purpose
Manages logical groupings of participants and enforces team composition rules.

## Fields
- `teamId` (string): Document ID.
- `teamName` (string): Unique team name.
- `teamCode` (string): 6-character unique join code.
- `leaderUid` (string): UID of the Team Leader.
- `members` (array of objects): Denormalized list of members for quick read access.
  - `uid` (string)
  - `fullName` (string)
  - `teamRole` (string: `leader` | `member`)
  - `isFemale` (boolean): Tracked to enforce the female member requirement.
- `memberCount` (number): Total members (2 to 6).
- `femaleCount` (number): Total female members (must be >= 1 for eligibility).
- `eligibilityStatus` (string): `eligible` | `pending`
- `status` (string): `active` | `disqualified`
- `createdTimestamp` (timestamp)
- `updatedTimestamp` (timestamp)

## Relationships
- **Users**: Leader and Members link back to the `/users` collection.
- **Projects/Submissions**: 1:1 relationship with a project and its submission.
- **Join Requests**: Target for `/teamJoinRequests`.

## Important Queries
- **Team by Code**: `where('teamCode', '==', '123456')`
- **Team Roster**: Direct read of `doc('/teams/{teamId}').members`.

## Security Considerations
- **Data Integrity**: Team membership limits (max 6, >=1 female) and preventing multiple team memberships require a backend transaction. Firestore rules will just enforce that the user must be a member to read, and only the backend can modify the `members` array.
- **Leaving/Transfer**: Not allowed. Enforced by backend logic.
