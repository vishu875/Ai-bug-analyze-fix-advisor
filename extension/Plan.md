# Phase 2 Plan 

## Phase 1 - Changes

- Remove the panel to show and interact it is not an interactive extension anymore, rather is a automatic program repair tool.
- The analyse code is now a background process for backend simulations rather than a feature.

## Phase 2 Deliverables

- We should make this pipeline 
    - Step 1 : Analyse code for the following kinds of bugs
        - Logical Issues
        - Path Configuration
        - API Deprecation Issue
        - Backend Issues
            - Server Issues
            - Data Retrival Null
        - Segmention Faults
    - Step 2 : Take the analysis report and pass it to the debugger as the input.
        - First Understand the errors and thier location in the code. 
        - Find the fixes and automatically repair them but ask for consent before the auto fix as the user should have the right to change the code.
        - So this has to run multiple times in the background so our plan is:
            - To run the pipeline multiple times and in a blockwise manner.
            - Then we could reduce the latency and increse the accuracy.
            - The small syntax errors need not have the user's approval but any logical would need it.
            - The issues such as the database retrivals and etc must have the simulations in a tight manner so have to look at processes which do that.