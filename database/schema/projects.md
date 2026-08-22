# Projects Collection

**Collection Path**: `/projects`

## Purpose
Stores the living problem statement and project description chosen by the team. Since the hackathon is open-ended, this is completely defined by the team.

## Fields
- `projectId` (string): Document ID (Could mirror `teamId` for a 1:1 relationship).
- `teamId` (string): Reference to the team.
- `title` (string): Project title.
- `problemStatement` (string): Detailed problem statement.
- `description` (string): Description of the proposed solution.
- `category` (string): `software` | `hardware`
- `technologies` (array of strings): Tags for tech stack.
- `status` (string): `draft` | `finalized`
- `createdTimestamp` (timestamp)
- `updatedTimestamp` (timestamp)

## Relationships
- **Teams**: Belongs to exactly 1 team.
- **Submissions**: Forms the basis of the final submission.

## Important Queries
- **My Team's Project**: `doc('/projects/{teamId}')` or `where('teamId', '==', teamId)`

## Security Considerations
- Only the **Team Leader** can update the project.
- Members can read it.
- Once the submission is locked, the project is marked `finalized` and locked by rules/backend.
