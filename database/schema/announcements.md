# Announcements Collection

**Collection Path**: `/announcements`

## Purpose
Global or targeted notifications sent by Admins to participants and/or judges.

## Fields
- `announcementId` (string): Document ID.
- `title` (string): Headline.
- `message` (string): Markdown or plaintext body.
- `priority` (string): `low` | `high` (determines UI styling).
- `audience` (string): `participant` | `judge` | `all`
- `status` (string): `draft` | `published`
- `publishedTimestamp` (timestamp | null)
- `createdBy` (string): Admin UID.
- `createdTimestamp` (timestamp)
- `updatedTimestamp` (timestamp)

## Relationships
- None (Standalone global documents).

## Important Queries
- **Active Announcements**: `where('status', '==', 'published') && where('audience', 'in', ['all', userRole])` ordered by `publishedTimestamp DESC`.

## Security Considerations
- Read-only for `participant` and `judge`.
- Read/Write for `admin`.
