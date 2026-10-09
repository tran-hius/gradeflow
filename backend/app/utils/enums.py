import enum


class UserRole(str, enum.Enum):
    ADMIN = "admin"
    TEACHER = "teacher"
    STUDENT = "student"


class StudentStatus(str, enum.Enum):
    EXCELLENT = "excellent"
    GOOD = "good"
    AVERAGE = "average"
    AT_RISK = "at-risk"
    FAILING = "failing"
