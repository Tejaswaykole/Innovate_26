# Testing Guidelines

## End-to-End Testing

### Participant Journey
1. Open the public portal and register an account.
2. Verify email address via Firebase Auth intercept.
3. Access the Participant Dashboard.
4. Form a team and note the generated 6-character Code.
5. Create a secondary account and request to join via the Code.
6. The Leader must accept the request.
7. Upon fulfilling the gender diversity and minimum count rules, the Team status should automatically unlock to `ELIGIBLE`.
8. The Leader navigates to Project Submission and attaches all necessary files (PPT, Github URL, Demo Video).
9. Lock the submission.

### Judge Journey
1. The Admin provisions a new Judge Account in the Admin Portal.
2. The Admin assigns the Judge to the Participant's Team.
3. The Judge logs into the separate Judge Portal.
4. The Judge opens the assigned project and reviews the read-only submission.
5. The Judge scores all criteria from 1 to 10.
6. The Judge submits the Evaluation.

### Admin Journey
1. The Admin opens the Admin Panel and views real-time metrics.
2. Once all evaluations are `SUBMITTED`, the Admin navigates to the Results tab.
3. Click "Publish Top 3".
4. The backend securely calculates and publishes the Top 3 ranks to the public database.

## QA Requirements
- **Browser Compatibility**: Fully tested across Chrome, Edge, Safari, and Firefox.
- **Responsiveness**: All applications are responsive and render cleanly down to `320px` width. Admin tables utilize CSS overflow where necessary to maintain readability.
- **Role Isolation**: Strict cross-site boundary testing ensures that a Judge cannot access the Admin panel, nor can a Participant intercept Judge data.
