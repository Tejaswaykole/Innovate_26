# Database Relationships Diagram

This diagram visualizes the flow and hierarchy of the Firestore schema, mapping entities to their associated roles and operations.

```mermaid
erDiagram
    USERS ||--o{ TEAM_JOIN_REQUESTS : "creates/receives"
    USERS ||--o| TEAMS : "belongs to (embedded reference)"
    USERS ||--o{ CERTIFICATES : "owns"
    
    TEAMS ||--o| PROJECTS : "owns (1:1)"
    TEAMS ||--o{ TEAM_JOIN_REQUESTS : "receives"
    
    PROJECTS ||--o| SUBMISSIONS : "finalizes as"
    
    JUDGES ||--o{ JUDGE_ASSIGNMENTS : "receives"
    JUDGES ||--o{ EVALUATIONS : "creates"
    
    JUDGE_ASSIGNMENTS }o--|| TEAMS : "maps judge to team"
    
    EVALUATIONS }o--|| TEAMS : "scores"
    EVALUATIONS }o--|| PROJECTS : "scores"
    
    RESULTS }o--|| TEAMS : "ranks"
    
    %% Notes
    %% JUDGES are USERS with role == 'judge'
    %% ADMINS are USERS with role == 'admin'
    %% ANNOUNCEMENTS and TIMELINE are global collections decoupled from users.
```

## Denormalization Strategy
1. **Team Members inside `teams`**: Instead of a separate `teamMembers` collection, member data (uid, name, role) is stored as an array within the `teams` document. This allows O(1) loading of a complete team profile.
2. **`teamId` inside `users`**: A direct reference is stored in the user profile to prevent querying the `teams` collection just to check if a user is currently engaged in one.
3. **Judge Assignments**: Stored separately to strictly control authorization rules, avoiding exposing all judge data within the team document.
