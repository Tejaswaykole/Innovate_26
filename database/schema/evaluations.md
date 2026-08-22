# Evaluations Collection

**Collection Path**: `/evaluations`

## Purpose
Stores the scoring and feedback submitted by a judge for a specific team's project.

## Fields
- `evaluationId` (string): Document ID.
- `teamId` (string): Target team.
- `projectId` (string): Target project.
- `judgeUid` (string): Evaluating judge.
- `criteriaScores` (map): Configurable map to store dynamic scoring. Example:
  - `innovation`: 8
  - `execution`: 9
  - `presentation`: 7
- `totalScore` (number): Aggregated sum of criteria scores.
- `feedback` (string): Judge's qualitative feedback.
- `status` (string): `draft` | `submitted`
- `createdTimestamp` (timestamp)
- `updatedTimestamp` (timestamp)
- `submittedTimestamp` (timestamp | null)

## Relationships
- **Judge Assignments**: Usually a 1:1 reflection of an assignment that reaches `status: 'evaluated'`.
- **Results**: Aggregated by Admins to generate final results.

## Important Queries
- **Team Evaluations**: Admin queries `where('teamId', '==', teamId)` to average scores.
- **Judge's Evaluations**: Judge queries `where('judgeUid', '==', uid)`.

## Security Considerations
- **Data Integrity**: Judges can only create an evaluation if a valid `judgeAssignment` exists for them + that team. This will likely be enforced by a Backend Endpoint to ensure `totalScore` is calculated correctly and the assignment is marked `completed` simultaneously in a transaction.
- Participants cannot see evaluations until (and if) Admins publish them.
