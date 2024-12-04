# Code style
### Backend
For the backend (FastAPI project), we use `black` to format the code. 
Please make sure to run `black` before committing your changes. 
You can install `black` by running `pip install black`. 
You can run `black` by running `black .` in the root directory of the project.

You can automate this process by using a pre-commit hook.

### Frontend
For the frontend (React project), we use `eslint` to format the code.

You can run the linter by running `npm run lint` in the `frontend` directory.

# Min Diff
We follow a min diff policy. This means that we try to keep the diff of each PR as small as possible.
This makes it easier to review the PR and understand the changes made.


