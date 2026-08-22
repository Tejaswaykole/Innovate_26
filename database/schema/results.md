# Results Collection

**Collection Path**: `/results`

## Purpose
Stores the final aggregated winners (Top 3) for the hackathon.

## Fields
- `resultId` (string): Document ID (e.g., `rank_1`).
- `rank` (number): 1, 2, or 3.
- `teamId` (string): Winning team.
- `projectId` (string): Winning project.
- `finalScore` (number): Aggregated score.
- `status` (string): `draft` | `published`
- `publishedTimestamp` (timestamp | null)
- `confirmedByAdminUid` (string): Admin who finalized it.
- `createdTimestamp` (timestamp)
- `updatedTimestamp` (timestamp)

## Relationships
- **Teams**: Direct link to winning team.
- **Projects**: Direct link to winning project.

## Important Queries
- **Leaderboard**: `where('status', '==', 'published')` ordered by `rank ASC`.

## Security Considerations
- Completely hidden from participants and judges until `status == 'published'`.
- Only Admin can write.
- No prize-money or sponsor fields exist, strictly tracking Team -> Rank mapping.
