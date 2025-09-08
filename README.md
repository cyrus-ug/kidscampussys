# kidscampussys
this is a school managemet system
Login Plan.
+------------------------------------------------+
| School Logo                                     |
|                                                |
| [ Login to Your Account ]                      |
|                                                |
| Email or Username  [______________]            |
| Password            [______________]            |
| [ ] Remember Me     [ Login Button ]           |
|                                                |
| ───────────────────────────────────             |
| [ Forgot Password? ]   [ Sign Up ]             |
+------------------------------------------------+

SCHOOL PORTAL Plane
+-------------------------------------------------------------+
| ≡ | School Portal                    [User Avatar ▼]       |
|   +---------------------------------------------------------+
|   | ▸ Dashboard                                           |
|   |   Pupils                                              |
|   |   Teachers                                            |
|   |   Classes                                             |
|   |   Requirements                                        |
|   |   Marks Entry                                         |
|   |   Conduct Reports                                     |
|   |   Report Cards                                        |
|   |   Settings                                            |
|   +---------------------------------------------------------+
|   |                                                         |
|   |  [ Total Pupils ]  [ Total Teachers ]  [ Active Term ] |
|   |                                                         |
|   |  [ Upcoming Events ]                                    |
|   |                                                         |
|   |  Quick Links: [Add Pupil] [Print Report]                |
|   |                                                         |
|   +---------------------------------------------------------+
+-------------------------------------------------------------+

PUPIL REGISTRATION PLAN
+------------------------------------------------+
| ← Back to Dashboard                            |
|                                                |
|               Pupil Registration               |
|                                                |
| [ Full Name ____________ ]                     |
| [ Date of Birth YYYY-MM-DD ]                   |
| [ Gender: (●) Male  ( ) Female  ( ) Other ]    |
| [ Class ▼ ] [ Section ▼ ]                      |
|                                                |
| Requirements Checklist:                        |
| [ ] Ream    [ ] Uniform   [ ] Birth Cert.      |
|                                                |
| Guardian Information:                          |
| Name ___________  Relationship ___________     |
| Phone __________  Email __________             |
|                                                |
|           [ Submit Registration ]              |
+------------------------------------------------+

Marks Entry Plan
← Back to Dashboard
Marks Entry
Term:   [ ▼ Select Term     ]  
Class:  [ ▼ Select Class    ]  
Subject:[ ▼ Select Subject ]  
[ Load Pupils ]
+----------------------------------------------------------------------------+
| # | Pupil Name      | Mid-Term | End-Term | Average | Grade |              |
+----------------------------------------------------------------------------+
| 1 | Alice Akello    | [  45   ]| [  50   ]|   47.5  |  C   |              |
| 2 | Brian Batte     | [  78   ]| [  82   ]|   80.0  |  B-  |              |
| …                                                                          |
+----------------------------------------------------------------------------+
[ Save Marks ]
Conduct Reports Plan
← Back to Dashboard
Conduct Reports
Term:  [ ▼ Select Term ]  
Class: [ ▼ Select Class ]  
[ Load Pupils ]
+----------------------------------------------------------------------------+
| # | Pupil Name      | Attendance      | Behavior       | Comments          |
+----------------------------------------------------------------------------+
| 1 | Alice Akello    | ( ) Present     | [ ▼ Excellent ]| [______________]  |
| 2 | Brian Batte     | ( ) Absent      | [ ▼ Good     ] | [______________]  |
| …                                                                          |
+----------------------------------------------------------------------------+
[ Save Reports ]

Report Card Generator Plan
← Back to Dashboard
Report Card Generator
Term:   [ ▼ Select Term ]  
Class:  [ ▼ Select Class ]  
[ Load Pupils ]
+-------------------------------------------------------------+
| # | Pupil Name      | Generate PDF | Email to Parent       |
+-------------------------------------------------------------+
| 1 | Alice Akello    | [Generate]   | [Email]               |
| 2 | Brian Batte     | [Generate]   | [Email]               |
| …                                                           |
+-------------------------------------------------------------+

Term Management Plan
← Back to Dashboard
Term Management
[ + New Term ]       [ Search ▾ ]     [ Show Archived ✓ ]

+----------------------------------------------------------------+
| Term Name     | Start Date  | End Date    | Status   | Actions |
+----------------------------------------------------------------+
| Term 1 2025   | 2025-01-10  | 2025-04-30  | Closed   | [Open] [Archive] |
| Term 2 2025   | 2025-05-01  | 2025-08-15  | Open     | [Close]          |
| Term 3 2024   | 2024-09-01  | 2024-12-20  | Archived |                  |
+----------------------------------------------------------------+

Modal: New Term
+---------------------------------------+
| New Term                              |
| Name: [ ____________ ]                |
| Start Date: [ YYYY-MM-DD ]            |
| End Date:   [ YYYY-MM-DD ]            |
| [ Create ]   [ Cancel ]               |
+---------------------------------------+

Smart Analytics Dashboard Plan
← Back to Dashboard
Smart Analytics Dashboard
Filters: [Term ▼] [Class ▼] [Gender ▼] [Section ▼] [ Load ]
+-----------------------------+  +----------------------------+
| Line Chart: Class Averages  |  | Bar Chart: Top/Bottom 5    |
|   (avg score by term)       |  |   (pupil vs. score)        |
+-----------------------------+  +----------------------------+

+---------------------------------------------+
| Radar Chart: Subject Strengths & Weaknesses |
+---------------------------------------------+

Summary Table: Top Performers | Bottom Performers
+---------------------------------------------+
| # | Name           | Avg Score | Grade      |
+---------------------------------------------+
| …                                           |
+---------------------------------------------+

[ Download CSV ]

Requirements Inventory Tracker Plan
← Back to Dashboard
Requirements Inventory Tracker
Filters: [Term ▼]  [Class ▼]  [Section ▼]  [ Load ]
Actions: [ Print Report ]  [ Email Missing Items ]
+-------------------------------------------------------------------------------------------+
| # | Pupil Name     | Ream of Paper | Uniform | Birth Cert. | … | Missing Count |            |
+-------------------------------------------------------------------------------------------+
| 1 | Alice Akello   | [x]           | [ ]     | [x]         |   | 1             | [Clear]    |
| 2 | Brian Batte    | [x]           | [x]     | [ ]         |   | 1             | [Clear]    |
| …                                                                                       |
+-------------------------------------------------------------------------------------------+

Parent portal Plan
+-------------------------------------------------------+
| ← Logout     School Logo     Parent: Jane Doe ▼      |
+-------------------------------------------------------+
| Your Children                                       |
| +-------------------------------------------------+ |
| | [Photo] Alice Akello        [ View Reports ► ] | |
| |                           [ Conduct ► ]         | |
| |                           [ Fees ► ]            | |
| +-------------------------------------------------+ |
| +-------------------------------------------------+ |  
| | [Photo] Brian Batte         [ View Reports ► ] | |
| |                           [ Conduct ► ]         | |
| |                           [ Fees ► ]            | |
| +-------------------------------------------------+ |
+-------------------------------------------------------+

Per-Child Notification Settings Plan
← Back to Parent Settings
Per-Child Notification Settings

+---------------------------------------------------------+
| Child: Alice Akello    [Photo]                         |
|  ┌───────────────────────────────────────────────────┐  |
|  │ Event             │ Email │ SMS │ Push           │  |
|  ├───────────────────────────────────────────────────┤  |
|  │ Report Card       │ [✔]   │ [ ] │ [✔]            │  |
|  │ Conduct           │ [ ]   │ [✔] │ [ ]            │  |
|  │ Fee Status        │ [✔]   │ [✔] │ [ ]            │  |
|  │ Missing Items     │ [ ]   │ [ ] │ [✔]            │  |
|  └───────────────────────────────────────────────────┘  |
+---------------------------------------------------------+

+---------------------------------------------------------+
| Child: Brian Batte     [Photo]                         |
|  └───────────────────────────────────────────────────┘  |
+---------------------------------------------------------+
[ Save All Settings ]

Teacher Activity Logs Plan
← Back to Dashboard
Teacher Activity Logs
Filters: [Teacher ▼]  [Action ▼]  [Date From YYYY-MM-DD]  [Date To YYYY-MM-DD]  [Load]
+------------------------------------------------------------------------------------------+
| # | Timestamp           | Teacher Name  | Action           | Details                    |
+------------------------------------------------------------------------------------------+
| 1 | 2025-09-08 14:32:10 | Ms. Akello    | Marks Entry      | Class 5A, Math, updated 30 |
| 2 | 2025-09-08 13:15:45 | Mr. Batte     | Conduct Report   | Class 6B, 25 entries       |
| …                                                                                    |
+------------------------------------------------------------------------------------------+
[Prev] [1] [2] [3] [Next]   [Export CSV]

Fee Tracking Plan
← Back to Dashboard
Fee Tracking
Filters: [Term ▼]  [Class ▼]  [Section ▼]  [From Date] [To Date]  [Load]

+----------------------------------------------------------------------------------+
| # | Pupil Name      | Total Due | Paid   | Balance | Actions                   |
+----------------------------------------------------------------------------------+
| 1 | Alice Akello    | 120,000   | 80,000 | 40,000  | [Record] [History] [Print] |
| 2 | Brian Batte     | 120,000   |120,000 |     0   | [History] [Print]         |
| …                                                                               |
+----------------------------------------------------------------------------------+
1.	[Export CSV] [Export PDF]

Assignments Plan
← Back to Dashboard        [ New Assignment ]
Assignments
+----------------------------------------------------------------------------+
| # | Title             | Subject | Due Date   | Resources  | Actions        |
+----------------------------------------------------------------------------+
| 1 | Chapter 5 Homework| Math    | 2025-10-15 | [Download] | [Review]/[Submit] |
| 2 | Essay: Environment| English | 2025-10-20 | [Download] | [Review]/[Submit] |
+----------------------------------------------------------------------------+

Modal: New Assignment
+------------------------------------------------+
| New Assignment                                |
| Title [__________]                            |
| Subject [▼ Select Subject]                    |
| Description [__________ multiline __________]  |
| Due Date [YYYY-MM-DD]                         |
| Attach Files [Choose file]                    |
| [Create] [Cancel]                             |
+------------------------------------------------+

Modal: Submit Work (Student)
+------------------------------------------------+
| Submit Assignment: “Chapter 5 Homework”       |
| Upload File [Choose file]                     |
| Comment [__________]                          |
| [Submit] [Cancel]                             |
+------------------------------------------------+

Modal: Review Submissions (Teacher)
+------------------------------------------------+
| Submissions for “Chapter 5 Homework”          |
| Student Name | File      | Comment | Grade |  |
| Alice Akello | [Download]| Nice   | [ A ]  |  |
| Brian Batte  | [Download]| See notes | [ B ]|  |
| …                                              |
| [Save Grades] [Close]                          |
+------------------------------------------------+

Library System Plan
← Back to Dashboard   [ + New Book ]   [Search ▾]   [Filter: Available ▾]
+----------------------------------------------------------------------------------+
| # | Title               | Author     | ISBN       | Total | Available | Actions |
+----------------------------------------------------------------------------------+
| 1 | Alice in Wonderland | L. Carroll | 1234567890 |   10  |     7     | [Edit]  |
|   |                     |            |            |       |           | [Delete]|
|   |                     |            |            |       |           | [Out]   |
|   |                     |            |            |       |           | [Hist]  |
+----------------------------------------------------------------------------------+

Modal: New/Edit Book
+------------------------------------------------+
| [New Book]                                     |
| Title    [__________]                          |
| Author   [__________]                          |
| ISBN     [__________]                          |
| Copies   [__]                                  |
| [Save]   [Cancel]                              |
+------------------------------------------------+

Modal: Checkout Book
+------------------------------------------------+
| Checkout “Alice in Wonderland”                 |
| Pupil   [▼ Select Pupil    ]                   |
| Due     [YYYY-MM-DD]                            |
| [Checkout] [Cancel]                            |
+------------------------------------------------+

Modal: Borrowing History
+------------------------------------------------+
| History for “Alice in Wonderland”              |
| Pupil     | Out Date     | Return Date | Status |
| Alice A.  | 2025-09-01   | 2025-09-10  | OK     |
| Brian B.  | 2025-09-02   | —           | Overdue|
| …                                              |
| [Close]                                        |
+------------------------------------------------+


