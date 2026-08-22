# Submissions Collection

**Collection Path**: `/submissions`

## Purpose
Represents the final, locked artifact submitted by a team for judging.

## Fields
- `submissionId` (string): Document ID.
- `teamId` (string): Target team.
- `projectId` (string): Target project.
- `submittedByUid` (string): UID of the Team Leader who finalized it.
- `status` (string): `draft` | `submitted`
- `projectTitle` (string): Snapshot for historical integrity.
- `description` (string): Snapshot of project description.
- `githubUrl` (string): Required repo link.
- `demoUrl` (string): Optional demo deployment link.
- `pptMetadata` (object):
  - `path` (string): Firebase Storage path.
  - `fileName` (string)
  - `size` (number)
- `videoMetadata` (object):
  - `path` (string): Firebase Storage path (Compulsory with Audio).
  - `fileName` (string)
- `screenshots` (array of objects): Allowed supplementary images (metadata).
- `submittedTimestamp` (timestamp)
- `updatedTimestamp` (timestamp)

## Relationships
- **Teams / Projects**: 1:1 relationship with a team's project.
- **Evaluations**: The artifact that is evaluated by judges.

## Important Queries
- **All Submissions**: Used by Admins for reviewing completion status.
- **Assigned Submissions**: Fetched by Judges during evaluation.

## Security Considerations
- Only the **Team Leader** can submit this document via a trusted backend endpoint (to prevent modifying status directly via Client SDK).
- Once `status == 'submitted'`, no further updates are permitted (enforced by Firestore rules/backend).
- Judges can read this document if they have an active assignment to `teamId`.
