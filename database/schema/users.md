# Users Collection

**Collection Path**: `/users`

## Purpose
Stores centralized account profiles across the platform for all participants, judges, and admins. Firebase Auth UIDs are used as the document ID.

## Fields
- `uid` (string): Firebase Auth UID (Primary Key).
- `fullName` (string): Full name.
- `personalEmail` (string): Required personal email address.
- `mobileNumber` (string): Contact number.
- `college` (string): College name.
- `branch` (string): Branch of study.
- `year` (number): Current year of study.
- `semester` (number): Current semester.
- `studentId` (string): Student/Roll Number.
- `role` (string): System role (`participant` | `judge` | `admin`).
- `accountStatus` (string): Account status (`active` | `suspended`).
- `emailVerified` (boolean): Whether email has been verified.
- `teamId` (string | null): Direct reference to the team the user belongs to.
- `teamRole` (string | null): `leader` or `member` (Only applicable if `teamId` is present).
- `createdTimestamp` (timestamp)
- `updatedTimestamp` (timestamp)

## Relationships
- **Teams**: Direct denormalized link to `teamId`. Allows O(1) checks to see if a participant is in a team and what their role is, preventing complex joins.
- **Join Requests**: Participants are linked to `teamJoinRequests`.

## Important Queries
- **My Profile**: `doc('/users/{uid}')`
- **All Judges**: `where('role', '==', 'judge')`

## Security Considerations
- Users can read/write their own non-privileged profile data.
- Only Admin or Backend can update `role`, `accountStatus`, `teamId`, and `teamRole`.
