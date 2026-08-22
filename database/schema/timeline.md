# Timeline Collection

**Collection Path**: `/timeline`

## Purpose
Manages the official stages of the hackathon (Registration, Development, Submission, Judging, Results). Controls global system locks based on current time.

## Fields
- `timelineId` (string): Document ID (e.g., `stage_1_registration`).
- `title` (string): Stage title.
- `description` (string): Public details.
- `startDate` (timestamp): Begins at.
- `endDate` (timestamp): Ends at.
- `status` (string): `upcoming` | `active` | `completed`
- `order` (number): For chronological sorting in UI.
- `createdTimestamp` (timestamp)
- `updatedTimestamp` (timestamp)

## Relationships
- **Global**: Read by the backend/frontend to determine if actions are allowed (e.g., "Can I submit my project?" -> Check if `Submission` stage is `active`).

## Important Queries
- **Full Timeline**: Ordered by `order ASC`.

## Security Considerations
- Read-only for everyone except `admin`.
- Backend endpoints will query the timeline to enforce deadlines (e.g., blocking submissions after the deadline).
