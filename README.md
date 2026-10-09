# GradeFlow — Student Performance Analytics API

A RESTful API for managing student records, analyzing academic performance, and generating data-driven insights using Python, NumPy, FastAPI, and SQLite.

> **Project status:** In Development
> **Project type:** Backend Engineering / Data Analytics
> **Primary goal:** Practice OOP, RESTful API design, data processing, and automated testing through a practical project.

## Overview

GradeFlow is a student performance management and analytics system designed to demonstrate how backend engineering can be combined with numerical computing.

The application manages student information and academic scores, processes score data using NumPy, and exposes analytical results through RESTful endpoints.

The project starts with NumPy-based data processing and gradually evolves into a complete backend application with database persistence, input validation, business logic separation, and automated testing.

## Goals

* Apply object-oriented programming (OOP) to a practical backend project.
* Strengthen NumPy fundamentals through real-world data processing.
* Design RESTful APIs with FastAPI.
* Separate API, business logic, and data access responsibilities.
* Persist data using SQLite and SQLAlchemy.
* Validate inputs and handle errors consistently.
* Write automated tests for analytical functions and API endpoints.
* Establish a foundation for future data science and machine learning features.

## Technology Stack

| Technology   | Purpose                                        |
| ------------ | ---------------------------------------------- |
| Python       | Primary programming language                   |
| NumPy        | Numerical computation and statistical analysis |
| FastAPI      | REST API development                           |
| Pydantic     | Request and response validation                |
| SQLite       | Relational data persistence                    |
| SQLAlchemy   | Database ORM                                   |
| Pytest       | Unit and integration testing                   |
| Git & GitHub | Version control and project documentation      |

## Core Features

### 1. Student Management

* Create student records.
* Retrieve a student by ID.
* List students.
* Update student information.
* Validate student data.

### 2. Score Management

* Record scores for individual subjects.
* Associate scores with students.
* Validate score ranges.
* Retrieve academic records.

### 3. Academic Analytics

Use NumPy to calculate:

* Mean score for each student.
* Standard deviation of each student's scores.
* Mean score for each subject.
* Students whose average scores fall below a configurable threshold.
* Score distributions and other basic descriptive statistics.

### 4. Student Ranking

* Rank students by average score.
* Return the highest-performing students.
* Identify students who may need additional academic support.

### 5. RESTful API

* Structured JSON responses.
* Request validation.
* Appropriate HTTP status codes.
* Consistent error handling.
* Interactive API documentation through FastAPI.

### 6. Automated Testing

* Unit tests for numerical calculations.
* Tests for empty and malformed input.
* Tests for score validation.
* API endpoint tests.
* Database-related integration tests.

## Project Roadmap

The project is developed incrementally to keep each stage manageable and testable.

* [ ] **Milestone 1 — NumPy Analytics**

  * Create a sample dataset.
  * Read scores from a CSV file.
  * Implement statistical analysis functions.
  * Handle empty arrays and invalid input shapes.
  * Test the functions independently.

* [ ] **Milestone 2 — OOP Design**

  * Introduce domain models and service classes.
  * Separate analytics logic from data access.
  * Define clear responsibilities between classes.

* [ ] **Milestone 3 — REST API**

  * Create FastAPI application and routers.
  * Define Pydantic schemas.
  * Implement student and analytics endpoints.
  * Add HTTP error handling.

* [ ] **Milestone 4 — Database Integration**

  * Integrate SQLite and SQLAlchemy.
  * Persist student and score records.
  * Implement repository methods.
  * Handle missing records and invalid references.

* [ ] **Milestone 5 — Testing and Refinement**

  * Add unit and integration tests.
  * Improve validation and error responses.
  * Document API examples.
  * Review code quality and separation of concerns.

* [ ] **Milestone 6 — Optional Extensions**

  * Import larger datasets with Pandas.
  * Add charts and data visualization.
  * Explore machine learning for academic performance prediction.
  * Add Docker support and deployment documentation.

## Planned API Endpoints

The following endpoints describe the intended API design. They will be implemented incrementally.

| Method  | Endpoint                           | Description                                                |
| ------- | ---------------------------------- | ---------------------------------------------------------- |
| `POST`  | `/students`                        | Create a student                                           |
| `GET`   | `/students`                        | List students                                              |
| `GET`   | `/students/{student_id}`           | Retrieve a student                                         |
| `PATCH` | `/students/{student_id}`           | Update student information                                 |
| `POST`  | `/students/{student_id}/scores`    | Record academic scores                                     |
| `GET`   | `/analytics/students/{student_id}` | Analyze an individual student's scores                     |
| `GET`   | `/analytics/subjects`              | Retrieve subject-level statistics                          |
| `GET`   | `/analytics/ranking`               | Rank students by average score                             |
| `GET`   | `/analytics/at-risk`               | Identify students below a selected average-score threshold |

## Example: NumPy Analytics

Suppose the application receives the following score matrix:

```python
import numpy as np

scores = np.array([
    [85, 72, 90, 66],
    [45, 58, 62, 70],
    [92, 88, 95, 91],
    [60, 75, 68, 80],
])

student_means = np.mean(scores, axis=1)
student_stds = np.std(scores, axis=1)
subject_means = np.mean(scores, axis=0)

print("Student averages:", student_means)
print("Student standard deviations:", student_stds)
print("Subject averages:", subject_means)
```

Here, `axis=1` calculates statistics across each student's subjects, while `axis=0` calculates statistics across students for each subject.

The analytics service will eventually transform these results into structured data that can be returned by the REST API.

## Architecture

The application will follow a layered structure to keep responsibilities separate.

```text
Client
  |
  v
FastAPI Router
  |
  v
Pydantic Validation
  |
  v
Service Layer
  |
  +---- Analytics Service ---- NumPy
  |
  v
Repository Layer
  |
  v
SQLite Database
```

### Layer Responsibilities

* **API layer:** Handles HTTP requests, responses, and status codes.
* **Schema layer:** Validates incoming data and defines response structures.
* **Service layer:** Implements business rules and coordinates processing.
* **Analytics layer:** Performs numerical calculations using NumPy.
* **Repository layer:** Encapsulates database access.
* **Database layer:** Stores student information and academic records.

This separation makes the project easier to test, maintain, and extend.

## Proposed Directory Structure

```text
gradeflow-api/
├── app/
│   ├── main.py
│   ├── api/
│   │   ├── students.py
│   │   └── analytics.py
│   ├── schemas/
│   │   ├── student.py
│   │   └── score.py
│   ├── models/
│   │   ├── student.py
│   │   └── score.py
│   ├── repositories/
│   │   └── student_repository.py
│   ├── services/
│   │   ├── student_service.py
│   │   └── analytics_service.py
│   └── core/
│       └── exceptions.py
├── tests/
├── data/
│   └── scores.csv
├── .gitignore
├── requirements.txt
└── README.md
```

The initial NumPy milestone may use a simpler structure. The full directory structure should be introduced as the project grows rather than created all at once.

## Getting Started

### Prerequisites

* Python 3.11 or later.
* pip.
* Git.

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd gradeflow-api
```

Replace `<your-repository-url>` with the URL of your GitHub repository.

### 2. Create a Virtual Environment

Windows:

```powershell
python -m venv .venv
.venv\Scripts\Activate.ps1
```

If PowerShell blocks script execution, activate the environment using Command Prompt instead:

```bat
.venv\Scripts\activate.bat
```

### 3. Install Dependencies

Create a `requirements.txt` file containing the dependencies required by the current milestone. For the planned API implementation, the initial list can be:

```text
numpy
fastapi
uvicorn[standard]
pydantic
sqlalchemy
pytest
httpx
```

Install them:

```bash
python -m pip install -r requirements.txt
```

### 4. Run the Application

Once the FastAPI application has been implemented:

```bash
uvicorn app.main:app --reload
```

Open the interactive API documentation at:

* Swagger UI: `http://127.0.0.1:8000/docs`
* ReDoc: `http://127.0.0.1:8000/redoc`

These URLs become available after the application is running successfully.

## Testing

Run the test suite from the project root:

```bash
pytest
```

Testing will cover analytical calculations, input validation, business rules, and API behavior as each milestone is implemented.

## Data Validation Rules

The application is intended to enforce the following rules:

* Student identifiers must be unique.
* Scores must be numeric and fall within the configured range of 0 to 100.
* Analytical functions must validate the expected array dimensions.
* Empty datasets must be handled explicitly.
* Missing students must produce an appropriate HTTP error.
* Invalid requests must return clear validation responses.

Additional rules may be introduced as the project evolves.

## Future Improvements

Potential extensions include:

* Pandas-based CSV and Excel imports.
* Matplotlib-based performance visualizations.
* More advanced statistical summaries.
* Machine learning models for exploratory performance prediction.
* Docker-based local development.
* Authentication and role-based access control.
* Deployment to a cloud platform.

These are optional extensions, not requirements for the initial version.

## Learning Outcomes

By completing GradeFlow, the developer aims to demonstrate practical understanding of:

* Python fundamentals and OOP.
* NumPy arrays, slicing, broadcasting, filtering, and aggregation.
* RESTful API design.
* FastAPI and Pydantic.
* Repository and service-layer separation.
* Relational database integration.
* Automated testing and input validation.
* Incremental software development and Git-based version control.

## License

This project is intended for educational and portfolio purposes. A formal open-source license can be added when the repository's distribution terms are decided.
