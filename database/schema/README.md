# Database Schema Domains

This document outlines the **conceptual future data domains** that will be built during the formal schema design phase (D2).

> **IMPORTANT:** No fields, subcollections, or exact schemas have been finalized yet. The purpose of this list is to define the boundaries of the data architecture.

### Future Firestore Collections
1. **users**: Centralized accounts across the platform. Will store references to roles (`participant`, `judge`, `admin`).
2. **teams**: Logical groupings of participants.
3. **teamJoinRequests**: Management of invitations and requests to join a team.
4. **projects**: The core submission entity tied to a problem statement.
5. **submissions**: Represents the final artifact submitted by a team for judging.
6. **judges**: Additional metadata specific to the judge role (e.g., expertise, assigned tracks).
7. **evaluations**: Scores and feedback submitted by judges for a particular project/submission.
8. **announcements**: Global or targeted notifications for participants.
9. **timeline**: Hackathon schedule events.
10. **results**: Final aggregated scores and winners.
11. **certificates**: Issued certificate records and metadata.

### Future File Storage Domains
Firebase Storage paths will follow this conceptual structure:
- **project_submissions/**:
  - `/PPT/`
  - `/demo_video/`
  - `/screenshots/`
- **certificates/**:
  - `/generated_certificates/`

*Note: Public upload paths will be strictly prohibited. Rules will govern precisely who can write to each path based on authentication and team membership.*
